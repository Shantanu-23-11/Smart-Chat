package com.smartchat.dto;

public class ErrorResponse {

    private boolean success = false;
    private String error;
    private String message;
    private int status;
    private long timestamp;

    public ErrorResponse() {
        this.timestamp = System.currentTimeMillis();
    }

    public ErrorResponse(String error, String message, int status) {
        this.success = false;
        this.error = error;
        this.message = message;
        this.status = status;
        this.timestamp = System.currentTimeMillis();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}

