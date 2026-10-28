package com.smartchat.dto;

public class ChatMessageDto {

    /**
     * Role of the speaker: "user" or "model" (or "assistant").
     */
    private String role;

    /**
     * Text content of the message.
     */
    private String content;

    /**
     * Optional message timestamp (epoch milliseconds).
     */
    private Long timestamp;

    public ChatMessageDto() {
    }

    public ChatMessageDto(String role, String content) {
        this.role = role;
        this.content = content;
        this.timestamp = System.currentTimeMillis();
    }

    public ChatMessageDto(String role, String content, Long timestamp) {
        this.role = role;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}

