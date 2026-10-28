package com.smartchat.dto.gemini;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class GeminiContent {

    /**
     * Role: "user" or "model"
     */
    private String role;

    private List<GeminiPart> parts = new ArrayList<>();

    public GeminiContent() {
    }

    public GeminiContent(String role, List<GeminiPart> parts) {
        this.role = role;
        this.parts = parts != null ? parts : new ArrayList<>();
    }

    public GeminiContent(String role, String text) {
        this.role = role;
        this.parts = new ArrayList<>();
        this.parts.add(new GeminiPart(text));
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<GeminiPart> getParts() {
        return parts;
    }

    public void setParts(List<GeminiPart> parts) {
        this.parts = parts;
    }
}

