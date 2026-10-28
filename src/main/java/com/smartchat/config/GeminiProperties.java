package com.smartchat.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.util.Locale;

@Component
@ConfigurationProperties(prefix = "gemini.api")
public class GeminiProperties {

    private static final Logger logger = LoggerFactory.getLogger(GeminiProperties.class);

    /**
     * Gemini API Key injected from application.properties or GEMINI_API_KEY.
     */
    private String key = "";

    /**
     * Model name (e.g. gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash).
     */
    private String model = "gemini-1.5-flash";

    /**
     * Base URL for Google Generative Language API.
     */
    private String url = "https://generativelanguage.googleapis.com/v1beta/models";

    /**
     * Connection timeout in milliseconds.
     */
    private int connectTimeout = 15000;

    /**
     * Read / response timeout in milliseconds.
     */
    private int readTimeout = 60000;

    /**
     * Generation temperature (0.0 to 2.0).
     */
    private Double temperature = 0.7;

    /**
     * Maximum output tokens generated.
     */
    private Integer maxOutputTokens = 4096;

    public String getKey() {
        return getResolvedApiKey();
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getConnectTimeout() {
        return connectTimeout;
    }

    public void setConnectTimeout(int connectTimeout) {
        this.connectTimeout = connectTimeout;
    }

    public int getReadTimeout() {
        return readTimeout;
    }

    public void setReadTimeout(int readTimeout) {
        this.readTimeout = readTimeout;
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

    /**
     * Dynamically resolves the API key with fallback and replacement priority:
     * 1. Java System Property (-Dgemini.api.key=... or -DGEMINI_API_KEY=...)
     * 2. Local .env file (if present in project root)
     * 3. Windows User Registry HKCU\Environment (picks up environment changes dynamically)
     * 4. Process environment variable ($env:GEMINI_API_KEY / $env:GOOGLE_API_KEY)
     * 5. Injected Spring property from application.properties
     */
    public String getResolvedApiKey() {
        // 1. Check system property override (-Dgemini.api.key=... or -DGEMINI_API_KEY=...)
        String sysProp = System.getProperty("gemini.api.key");
        if (sysProp == null) {
            sysProp = System.getProperty("GEMINI_API_KEY");
        }
        if (sysProp != null) {
            return cleanKey(sysProp);
        }

        // 2. Check local .env file (allows user to drop a .env file directly into project root)
        String dotenvKey = readFromDotEnv();
        if (dotenvKey != null && !dotenvKey.isBlank() && !isPlaceholder(dotenvKey)) {
            return cleanKey(dotenvKey);
        }

        // 3. Check Windows Registry HKCU (picks up setx or environment changes dynamically)
        if (isWindows()) {
            String winKey = readWindowsUserRegistryKey("GEMINI_API_KEY");
            if (winKey == null || winKey.isBlank() || isPlaceholder(winKey)) {
                winKey = readWindowsUserRegistryKey("GOOGLE_API_KEY");
            }
            if (winKey != null && !winKey.isBlank() && !isPlaceholder(winKey)) {
                return cleanKey(winKey);
            }
        }

        // 4. Check Process Environment ($env:GEMINI_API_KEY / $env:GOOGLE_API_KEY)
        String envKey = System.getenv("GEMINI_API_KEY");
        if (envKey == null || envKey.isBlank() || isPlaceholder(envKey)) {
            envKey = System.getenv("GOOGLE_API_KEY");
        }
        if (envKey != null && !envKey.isBlank() && !isPlaceholder(envKey)) {
            return cleanKey(envKey);
        }

        // 5. Injected Spring property (from application.properties: gemini.api.key=${GEMINI_API_KEY:})
        if (key != null && !key.isBlank() && !isPlaceholder(key)) {
            return cleanKey(key);
        }

        return "";
    }

    private String cleanKey(String val) {
        if (val == null) return "";
        String s = val.trim();
        if ((s.startsWith("\"") && s.endsWith("\"")) || (s.startsWith("'") && s.endsWith("'"))) {
            s = s.substring(1, s.length() - 1).trim();
        }
        return s.replaceAll("[\\r\\n\\t\\s]+", "");
    }

    public boolean isKeyConfigured() {
        String resolved = getResolvedApiKey();
        return resolved != null && !resolved.trim().isEmpty() && !isPlaceholder(resolved);
    }

    public String getKeyFormatDiagnostic() {
        String resolved = getResolvedApiKey();
        if (resolved == null || resolved.isBlank() || isPlaceholder(resolved)) {
            return "MISSING";
        }
        return "CONFIGURED";
    }

    public String getMaskedDiagnosticInfo() {
        String resolved = getResolvedApiKey();
        if (resolved == null || resolved.isBlank() || isPlaceholder(resolved)) {
            return "No key configured";
        }
        int len = resolved.length();
        String prefix = resolved.substring(0, Math.min(6, len));
        String suffix = len > 4 ? resolved.substring(len - 4) : "";
        return String.format(Locale.ROOT, "Prefix: %s..., Suffix: ...%s, Length: %d",
                prefix, suffix, len);
    }

    private boolean isPlaceholder(String val) {
        String v = val.toLowerCase().trim();
        return v.contains("your_") || v.contains("placeholder") || v.equals("null");
    }

    private boolean isWindows() {
        String os = System.getProperty("os.name", "").toLowerCase(Locale.ROOT);
        return os.contains("win");
    }

    private String readFromDotEnv() {
        File dotEnv = new File(".env");
        if (!dotEnv.exists() || !dotEnv.isFile()) {
            return null;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(dotEnv))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.startsWith("#") || !line.contains("=")) {
                    continue;
                }
                String[] parts = line.split("=", 2);
                String varName = parts[0].trim();
                if (varName.equalsIgnoreCase("GEMINI_API_KEY") || varName.equalsIgnoreCase("GOOGLE_API_KEY")) {
                    String value = parts[1].trim();
                    if ((value.startsWith("\"") && value.endsWith("\"")) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.substring(1, value.length() - 1);
                    }
                    return value;
                }
            }
        } catch (Exception e) {
            logger.debug("Could not read .env file: {}", e.getMessage());
        }
        return null;
    }

    private String readWindowsUserRegistryKey(String varName) {
        try {
            Process process = new ProcessBuilder("reg", "query", "HKCU\\Environment", "/v", varName)
                    .redirectErrorStream(true)
                    .start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.contains(varName)) {
                        String[] tokens = line.trim().split("\\s+");
                        if (tokens.length >= 3) {
                            return tokens[tokens.length - 1];
                        }
                    }
                }
            }
            process.waitFor();
        } catch (Exception e) {
            logger.debug("Could not query Windows User registry for {}: {}", varName, e.getMessage());
        }
        return null;
    }
}
