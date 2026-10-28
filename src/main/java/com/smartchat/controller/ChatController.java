package com.smartchat.controller;

import com.smartchat.dto.ChatRequest;
import com.smartchat.dto.ChatResponse;
import com.smartchat.service.GeminiService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * Endpoint to receive a user prompt and optional conversation history,
     * send it to Gemini API, and return the generated AI response.
     *
     * @param request ChatRequest containing prompt and history
     * @return ResponseEntity with ChatResponse
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        logger.info("Received /api/chat request for prompt: '{}...'",
                request.getPrompt().substring(0, Math.min(30, request.getPrompt().length())));

        ChatResponse response = geminiService.generateChatResponse(request);
        return ResponseEntity.ok(response);
    }
}

