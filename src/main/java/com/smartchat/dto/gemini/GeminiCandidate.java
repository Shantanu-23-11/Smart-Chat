package com.smartchat.dto.gemini;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GeminiCandidate {

    private GeminiContent content;
    private String finishReason;
    private Integer index;

    public GeminiCandidate() {
    }

    public GeminiContent getContent() {
        return content;
    }

    public void setContent(GeminiContent content) {
        this.content = content;
    }

    public String getFinishReason() {
        return finishReason;
    }

    public void setFinishReason(String finishReason) {
        this.finishReason = finishReason;
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }
}

