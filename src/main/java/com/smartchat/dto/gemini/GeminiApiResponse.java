package com.smartchat.dto.gemini;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GeminiApiResponse {

    private List<GeminiCandidate> candidates = new ArrayList<>();
    private GeminiError error;

    public GeminiApiResponse() {
    }

    public List<GeminiCandidate> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<GeminiCandidate> candidates) {
        this.candidates = candidates != null ? candidates : new ArrayList<>();
    }

    public GeminiError getError() {
        return error;
    }

    public void setError(GeminiError error) {
        this.error = error;
    }

    /**
     * Helper to extract the first response text safely.
     */
    public String extractResponseText() {
        if (candidates != null && !candidates.isEmpty()) {
            GeminiCandidate candidate = candidates.get(0);
            if (candidate.getContent() != null && candidate.getContent().getParts() != null) {
                StringBuilder sb = new StringBuilder();
                for (GeminiPart part : candidate.getContent().getParts()) {
                    if (part.getText() != null) {
                        sb.append(part.getText());
                    }
                }
                return sb.toString();
            }
        }
        return null;
    }
}

