package com.smartchat.exception;

import org.springframework.http.HttpStatus;

public class GeminiApiException extends RuntimeException {

    private final HttpStatus status;

    public GeminiApiException(String message) {
        super(message);
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    public GeminiApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public GeminiApiException(String message, Throwable cause) {
        super(message, cause);
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    public GeminiApiException(String message, HttpStatus status, Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}

