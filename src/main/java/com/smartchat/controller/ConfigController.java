package com.smartchat.controller;

import com.smartchat.config.GeminiProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ConfigController {

    private final GeminiProperties geminiProperties;

    public ConfigController(GeminiProperties geminiProperties) {
        this.geminiProperties = geminiProperties;
    }

    /**
     * Returns application metadata and safe diagnostics regarding the Gemini API key.
     * Never exposes the key itself.
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("name", "SmartChat");
        config.put("version", "1.0.0");
        config.put("poweredBy", "Google Gemini");
        config.put("model", geminiProperties.getModel());
        config.put("apiKeyConfigured", geminiProperties.isKeyConfigured());
        config.put("keyFormat", geminiProperties.getKeyFormatDiagnostic());
        config.put("keyDiagnostic", geminiProperties.getMaskedDiagnosticInfo());
        return ResponseEntity.ok(config);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        return ResponseEntity.ok(status);
    }
}
