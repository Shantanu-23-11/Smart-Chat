package com.smartchat.dto.gemini;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class GeminiApiRequest {

    private List<GeminiContent> contents = new ArrayList<>();
    private GeminiGenerationConfig generationConfig;

    public GeminiApiRequest() {
    }

    public GeminiApiRequest(List<GeminiContent> contents) {
        this.contents = contents != null ? contents : new ArrayList<>();
    }

    public GeminiApiRequest(List<GeminiContent> contents, GeminiGenerationConfig generationConfig) {
        this.contents = contents != null ? contents : new ArrayList<>();
        this.generationConfig = generationConfig;
    }

    public List<GeminiContent> getContents() {
        return contents;
    }

    public void setContents(List<GeminiContent> contents) {
        this.contents = contents;
    }

    public GeminiGenerationConfig getGenerationConfig() {
        return generationConfig;
    }

    public void setGenerationConfig(GeminiGenerationConfig generationConfig) {
        this.generationConfig = generationConfig;
    }
}

