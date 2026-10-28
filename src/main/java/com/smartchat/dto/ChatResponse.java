package com.smartchat.dto;

public class ChatResponse {

    private boolean success;
    private String response;
    private String conversationId;
    private String title;
    private String model;
    private Long timestamp;

    public ChatResponse() {
    }

    public ChatResponse(boolean success, String response, String conversationId, String title, String model) {
        this.success = success;
        this.response = response;
        this.conversationId = conversationId;
        this.title = title;
        this.model = model;
        this.timestamp = System.currentTimeMillis();
    }

    public static ChatResponse ofSuccess(String response, String conversationId, String title, String model) {
        return new ChatResponse(true, response, conversationId, title, model);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}

