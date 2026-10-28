package com.smartchat.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartchat.config.GeminiProperties;
import com.smartchat.dto.ChatMessageDto;
import com.smartchat.dto.ChatRequest;
import com.smartchat.dto.ChatResponse;
import com.smartchat.dto.gemini.*;
import com.smartchat.exception.GeminiApiException;
import com.smartchat.service.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class GeminiServiceImpl implements GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiServiceImpl.class);

    private final GeminiProperties properties;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @org.springframework.beans.factory.annotation.Autowired
    public GeminiServiceImpl(GeminiProperties properties, RestClient restClient, ObjectMapper objectMapper) {
        this.properties = properties;
        this.restClient = restClient;
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
    }

    @Override
    public boolean isApiKeyConfigured() {
        return properties.isKeyConfigured();
    }

    @Override
    public ChatResponse generateChatResponse(ChatRequest request) {
        if (!isApiKeyConfigured()) {
            throw new GeminiApiException(
                    "Google Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable in Windows PowerShell: `[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'your_key_here', 'User')`.",
                    HttpStatus.UNAUTHORIZED
            );
        }

        String apiKey = properties.getResolvedApiKey();

        String conversationId = request.getConversationId();
        if (conversationId == null || conversationId.trim().isEmpty()) {
            conversationId = UUID.randomUUID().toString();
        }

        // Build valid alternating Gemini contents
        List<GeminiContent> contents = buildGeminiContents(request);
        GeminiGenerationConfig config = new GeminiGenerationConfig(
                properties.getTemperature(),
                properties.getMaxOutputTokens()
        );
        GeminiApiRequest apiRequest = new GeminiApiRequest(contents, config);

        // Standard official Gemini API endpoint
        String endpointUrl = String.format("%s/%s:generateContent",
                properties.getUrl().replaceAll("/+$", ""),
                properties.getModel()
        );

        logger.info("Sending chat request to Gemini model: '{}', history turns: {}, key info: [{}]",
                properties.getModel(),
                contents.size(),
                properties.getMaskedDiagnosticInfo()
        );

        try {
            ResponseEntity<GeminiApiResponse> responseEntity = restClient.post()
                    .uri(endpointUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("x-goog-api-key", apiKey)
                    .body(apiRequest)
                    .retrieve()
                    .toEntity(GeminiApiResponse.class);

            GeminiApiResponse apiResponse = responseEntity.getBody();
            if (apiResponse == null) {
                throw new GeminiApiException("Received empty response from Gemini API.", HttpStatus.BAD_GATEWAY);
            }

            if (apiResponse.getError() != null) {
                logger.error("Gemini API error code {}: {}",
                        apiResponse.getError().getCode(), apiResponse.getError().getMessage());
                throw new GeminiApiException(
                        "Gemini API Error: " + apiResponse.getError().getMessage(),
                        HttpStatus.valueOf(Math.min(599, Math.max(400, apiResponse.getError().getCode())))
                );
            }

            String responseText = apiResponse.extractResponseText();
            if (responseText == null || responseText.trim().isEmpty()) {
                throw new GeminiApiException(
                        "Gemini API returned a response without text content.",
                        HttpStatus.BAD_GATEWAY
                );
            }

            String title = generateConversationTitle(request.getPrompt());

            logger.info("Successfully received Gemini response for conversation: {}", conversationId);
            return ChatResponse.ofSuccess(responseText, conversationId, title, properties.getModel());

        } catch (HttpClientErrorException ex) {
            String errorDetail = parseClientErrorMessage(ex);
            logger.error("Gemini API client error [HTTP {}]: {}", ex.getStatusCode().value(), errorDetail);
            throw new GeminiApiException(errorDetail, (HttpStatus) ex.getStatusCode(), ex);

        } catch (HttpServerErrorException ex) {
            logger.error("Gemini API server error [HTTP {}]: {}", ex.getStatusCode().value(), ex.getStatusText());
            throw new GeminiApiException(
                    "Google Gemini service is temporarily unavailable (HTTP " + ex.getStatusCode().value() + "). Please try again in a few moments.",
                    HttpStatus.BAD_GATEWAY,
                    ex
            );
        } catch (GeminiApiException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.error("Failed to communicate with Gemini API: {}", ex.getMessage());
            throw new GeminiApiException(
                    "Failed to communicate with Gemini API: " + ex.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    ex
            );
        }
    }

    private String parseClientErrorMessage(HttpClientErrorException ex) {
        int code = ex.getStatusCode().value();
        String responseBody = ex.getResponseBodyAsString();

        String reason = null;
        String message = null;

        logger.warn("Gemini API error [HTTP {}], raw response: '{}'", code, responseBody);

        if (responseBody != null && !responseBody.isBlank()) {
            try {
                JsonNode root = objectMapper.readTree(responseBody);
                JsonNode errorNode = root.path("error");
                if (!errorNode.isMissingNode()) {
                    message = errorNode.path("message").asText(null);
                    JsonNode details = errorNode.path("details");
                    if (details.isArray() && !details.isEmpty()) {
                        for (JsonNode item : details) {
                            if (item.has("reason")) {
                                reason = item.path("reason").asText(null);
                                break;
                            }
                        }
                    }
                }
            } catch (Exception e) {
                logger.debug("Failed to parse JSON error response: {}", e.getMessage());
            }
        }

        logger.warn("Parsed Gemini error details - HTTP {}, reason: '{}', message: '{}'", code, reason, message);

        if ("ACCESS_TOKEN_TYPE_UNSUPPORTED".equalsIgnoreCase(reason)) {
            return "Google Generative Language API rejected the key with error 'ACCESS_TOKEN_TYPE_UNSUPPORTED'. " +
                    "Google response: \"" + (message != null ? message : "API key not valid") + "\". " +
                    "This typically indicates the API key is not currently active, unrecognized, or the Generative Language API is disabled for the associated Google Cloud project. " +
                    "Please verify or recreate your key in Google AI Studio (https://aistudio.google.com/app/apikey).";
        }

        if ("API_KEY_INVALID".equalsIgnoreCase(reason) || (message != null && message.contains("API key not valid"))) {
            return "The Google Gemini API key is invalid, revoked, or unrecognized: " + (message != null ? message : "Please check your GEMINI_API_KEY.") +
                    " Please verify your key at https://aistudio.google.com/app/apikey.";
        }

        if (code == 401) {
            return "Gemini API authentication failed (HTTP 401): " + (message != null ? message : "Unauthorized.") +
                    " Please verify that GEMINI_API_KEY is configured with an active key from Google AI Studio.";
        } else if (code == 403) {
            return "Gemini API permission denied (HTTP 403): Generative Language API is not enabled for your project or your API key lacks access. " +
                    (message != null ? message : "Please check Google AI Studio / Google Cloud Console.");
        } else if (code == 404) {
            return "Requested Gemini model '" + properties.getModel() + "' was not found or is unsupported in your region. Check gemini.api.model in application.properties.";
        } else if (code == 429) {
            return "Gemini API rate limit or quota exceeded (HTTP 429). Please wait a moment and try again.";
        } else if (code == 400) {
            return "Gemini API rejected the request (HTTP 400): " + (message != null ? message : "Invalid request parameters.");
        } else {
            return "Gemini API error (HTTP " + code + "): " + (message != null ? message : ex.getStatusText());
        }
    }

    /**
     * Builds a strictly alternating sequence of contents:
     * [user, model, user, model, ..., user]
     * Required by Gemini API v1beta.
     */
    private List<GeminiContent> buildGeminiContents(ChatRequest request) {
        List<GeminiContent> rawList = new ArrayList<>();

        if (request.getHistory() != null) {
            for (ChatMessageDto msg : request.getHistory()) {
                if (msg.getContent() == null || msg.getContent().trim().isEmpty()) {
                    continue;
                }
                String role = "user";
                if ("model".equalsIgnoreCase(msg.getRole()) || "assistant".equalsIgnoreCase(msg.getRole())) {
                    role = "model";
                }
                rawList.add(new GeminiContent(role, msg.getContent().trim()));
            }
        }

        // Add current prompt
        rawList.add(new GeminiContent("user", request.getPrompt().trim()));

        // Enforce Gemini's strict alternating turn requirements:
        List<GeminiContent> normalized = new ArrayList<>();
        for (GeminiContent item : rawList) {
            // Rule 1: First turn MUST be 'user'
            if (normalized.isEmpty() && !"user".equals(item.getRole())) {
                continue;
            }

            // Rule 2: Cannot have consecutive turns with the same role
            if (!normalized.isEmpty()) {
                GeminiContent last = normalized.get(normalized.size() - 1);
                if (last.getRole().equals(item.getRole())) {
                    if (item.getParts() != null && !item.getParts().isEmpty()) {
                        last.getParts().addAll(item.getParts());
                    }
                    continue;
                }
            }
            normalized.add(item);
        }

        // Guarantee at least the user's prompt is present
        if (normalized.isEmpty()) {
            normalized.add(new GeminiContent("user", request.getPrompt().trim()));
        }

        return normalized;
    }

    @Override
    public String generateConversationTitle(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return "New Chat";
        }
        String clean = prompt.trim()
                .replaceAll("^[\\W_]+", "")
                .replaceAll("[\\r\\n]+", " ");

        String[] words = clean.split("\\s+");
        if (words.length <= 5) {
            return clean.length() > 30 ? clean.substring(0, 27) + "..." : clean;
        }

        StringBuilder title = new StringBuilder();
        for (int i = 0; i < Math.min(5, words.length); i++) {
            if (i > 0) title.append(" ");
            title.append(words[i]);
        }
        return title.toString();
    }
}
