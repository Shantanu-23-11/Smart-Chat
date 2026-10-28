package com.smartchat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartchat.dto.ChatRequest;
import com.smartchat.dto.ChatResponse;
import com.smartchat.exception.GeminiApiException;
import com.smartchat.exception.GlobalExceptionHandler;
import com.smartchat.service.GeminiService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ChatController.class)
@Import(GlobalExceptionHandler.class)
class ChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private GeminiService geminiService;

    @Test
    @DisplayName("POST /api/chat with valid prompt returns 200 OK and ChatResponse")
    void shouldReturnChatResponseWhenPromptIsValid() throws Exception {
        ChatResponse mockResponse = ChatResponse.ofSuccess(
                "MERN stack stands for MongoDB, Express, React, and Node.js.",
                "conv-123",
                "Explain MERN Stack",
                "gemini-1.5-flash"
        );

        when(geminiService.generateChatResponse(any(ChatRequest.class))).thenReturn(mockResponse);

        ChatRequest request = new ChatRequest("Explain MERN Stack");

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.response").value("MERN stack stands for MongoDB, Express, React, and Node.js."))
                .andExpect(jsonPath("$.conversationId").value("conv-123"))
                .andExpect(jsonPath("$.title").value("Explain MERN Stack"));
    }

    @Test
    @DisplayName("POST /api/chat with empty prompt returns 400 Bad Request")
    void shouldReturnBadRequestWhenPromptIsEmpty() throws Exception {
        ChatRequest request = new ChatRequest("");

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("Validation Error"));
    }

    @Test
    @DisplayName("POST /api/chat returns 401 when API key is missing or unauthorized")
    void shouldReturnUnauthorizedWhenApiKeyIsMissing() throws Exception {
        when(geminiService.generateChatResponse(any(ChatRequest.class)))
                .thenThrow(new GeminiApiException("Google Gemini API key is not configured.", HttpStatus.UNAUTHORIZED));

        ChatRequest request = new ChatRequest("Hello Gemini");

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("Gemini API Error"))
                .andExpect(jsonPath("$.message").value("Google Gemini API key is not configured."));
    }
}

