package com.smartchat.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Configuration
public class RestClientConfig {

    private static final Logger logger = LoggerFactory.getLogger(RestClientConfig.class);

    private final GeminiProperties geminiProperties;

    public RestClientConfig(GeminiProperties geminiProperties) {
        this.geminiProperties = geminiProperties;
    }

    @Bean
    public RestClient restClient() {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(geminiProperties.getConnectTimeout()))
                .build();

        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofMillis(geminiProperties.getReadTimeout()));

        return RestClient.builder()
                .requestFactory(new BufferingClientHttpRequestFactory(requestFactory))
                .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {
                    byte[] bodyBytes = response.getBody().readAllBytes();
                    String bodyStr = new String(bodyBytes, StandardCharsets.UTF_8);
                    logger.warn("Gemini HTTP error {}: {}", response.getStatusCode(), bodyStr);

                    if (response.getStatusCode().is4xxClientError()) {
                        throw HttpClientErrorException.create(
                                response.getStatusText(),
                                response.getStatusCode(),
                                response.getStatusText(),
                                response.getHeaders(),
                                bodyBytes,
                                StandardCharsets.UTF_8
                        );
                    } else {
                        throw HttpServerErrorException.create(
                                response.getStatusText(),
                                response.getStatusCode(),
                                response.getStatusText(),
                                response.getHeaders(),
                                bodyBytes,
                                StandardCharsets.UTF_8
                        );
                    }
                })
                .build();
    }
}

