package com.smartchat.service;

import com.smartchat.dto.ChatRequest;
import com.smartchat.dto.ChatResponse;

public interface GeminiService {

    /**
     * Sends the chat request along with conversation history to Google Gemini API
     * and returns the generated AI response.
     *
     * @param request the user's prompt and optional history
     * @return ChatResponse containing the AI reply and conversation metadata
     */
    ChatResponse generateChatResponse(ChatRequest request);

    /**
     * Checks if a non-empty API key is configured.
     *
     * @return true if key is present, false otherwise
     */
    boolean isApiKeyConfigured();

    /**
     * Generates a clean, concise conversation title based on the user's initial prompt.
     *
     * @param prompt the initial user prompt
     * @return a 3-6 word conversation title
     */
    String generateConversationTitle(String prompt);
}

