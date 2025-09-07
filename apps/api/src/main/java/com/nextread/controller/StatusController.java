package com.nextread.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatusController {

    @GetMapping("/")
    public Map<String, Object> welcome() {
        return Map.of(
            "message", "NextRead API is running",
            "status", "healthy",
            "timestamp", LocalDateTime.now(),
            "version", "1.0.0"
        );
    }

    @GetMapping("/api/status")
    public Map<String, Object> status() {
        return Map.of(
            "service", "NextRead Backend API",
            "status", "operational",
            "timestamp", LocalDateTime.now()
        );
    }
}