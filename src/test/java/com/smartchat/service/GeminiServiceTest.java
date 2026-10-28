package com.smartchat.service;

import com.smartchat.config.GeminiProperties;
import com.smartchat.dto.ChatRequest;
import com.smartchat.exception.GeminiApiException;
import com.smartchat.service.impl.GeminiServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class GeminiServiceTest {

    @Mock
    private RestClient restClient;

    private GeminiProperties properties;
    private GeminiServiceImpl geminiService;

    @BeforeEach
    void setUp() {
        System.clearProperty("gemini.api.key");
        System.clearProperty("GEMINI_API_KEY");
        properties = new GeminiProperties();
        properties.setModel("gemini-1.5-flash");
        properties.setUrl("https://generativelanguage.googleapis.com/v1beta/models");
        geminiService = new GeminiServiceImpl(properties, restClient, new com.fasterxml.jackson.databind.ObjectMapper());
    }

    @AfterEach
    void tearDown() {
        System.clearProperty("gemini.api.key");
        System.clearProperty("GEMINI_API_KEY");
    }

    @Test
    @DisplayName("Throws GeminiApiException with UNAUTHORIZED when API key is empty")
    void shouldThrowExceptionWhenApiKeyNotConfigured() {
        System.setProperty("gemini.api.key", "   ");

        ChatRequest request = new ChatRequest("Explain MERN stack");

        GeminiApiException exception = assertThrows(GeminiApiException.class, () -> {
            geminiService.generateChatResponse(request);
        });

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatus());
        assertTrue(exception.getMessage().contains("GEMINI_API_KEY"));
    }

    @Test
    @DisplayName("isApiKeyConfigured returns true for valid non-empty keys regardless of prefix")
    void shouldAcceptConfiguredKeys() {
        System.setProperty("gemini.api.key", "your_api_key_here");
        assertFalse(geminiService.isApiKeyConfigured());

        System.setProperty("gemini.api.key", "AIzaSyDummyTestKeyForUnitTestingOnly12345");
        assertTrue(geminiService.isApiKeyConfigured());

        System.setProperty("gemini.api.key", "AQ.DummyTestTokenForUnitTestingOnly123456");
        assertTrue(geminiService.isApiKeyConfigured());
    }

    @Test
    @DisplayName("generateConversationTitle correctly creates short titles")
    void shouldGenerateCleanTitleFromPrompt() {
        assertEquals("Explain MERN Stack in simple", geminiService.generateConversationTitle("Explain MERN Stack in simple words for a beginner"));
        assertEquals("DSA Study Plan", geminiService.generateConversationTitle("DSA Study Plan"));
        assertEquals("New Chat", geminiService.generateConversationTitle("   "));
        assertEquals("New Chat", geminiService.generateConversationTitle(null));
    }
}
