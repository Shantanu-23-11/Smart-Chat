package com.smartchat.exception;

import com.smartchat.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(GeminiApiException.class)
    public ResponseEntity<ErrorResponse> handleGeminiApiException(GeminiApiException ex) {
        logger.error("Gemini API error: {}", ex.getMessage());
        HttpStatus status = ex.getStatus() != null ? ex.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        ErrorResponse response = new ErrorResponse(
                "Gemini API Error",
                ex.getMessage(),
                status.value()
        );
        return new ResponseEntity<>(response, status);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String validationErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));

        logger.warn("Validation error: {}", validationErrors);
        ErrorResponse response = new ErrorResponse(
                "Validation Error",
                validationErrors.isEmpty() ? "Invalid request payload" : validationErrors,
                HttpStatus.BAD_REQUEST.value()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleMessageNotReadableException(HttpMessageNotReadableException ex) {
        logger.warn("Malformed JSON request body: {}", ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                "Bad Request",
                "Malformed JSON request body. Please provide valid JSON.",
                HttpStatus.BAD_REQUEST.value()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        logger.warn("Invalid argument: {}", ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                "Bad Request",
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<ErrorResponse> handleTimeoutException(ResourceAccessException ex) {
        logger.error("Network timeout communicating with Gemini: {}", ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                "Gateway Timeout",
                "The request to Google Gemini API timed out. Please check your internet connection and try again.",
                HttpStatus.GATEWAY_TIMEOUT.value()
        );
        return new ResponseEntity<>(response, HttpStatus.GATEWAY_TIMEOUT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        logger.error("Unexpected server error: ", ex);
        ErrorResponse response = new ErrorResponse(
                "Internal Server Error",
                "An unexpected server error occurred. Please try again later.",
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

