package com.smartchat.dto.gemini;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class GeminiGenerationConfig {

    private Double temperature;
    private Integer maxOutputTokens;
    private Double topP;
    private Integer topK;

    public GeminiGenerationConfig() {
    }

    public GeminiGenerationConfig(Double temperature, Integer maxOutputTokens) {
        this.temperature = temperature;
        this.maxOutputTokens = maxOutputTokens;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Integer getMaxOutputTokens() {
        return maxOutputTokens;
    }

    public void setMaxOutputTokens(Integer maxOutputTokens) {
        this.maxOutputTokens = maxOutputTokens;
    }

    public Double getTopP() {
        return topP;
    }

    public void setTopP(Double topP) {
        this.topP = topP;
    }

    public Integer getTopK() {
        return topK;
    }

    public void setTopK(Integer topK) {
        this.topK = topK;
    }
}

