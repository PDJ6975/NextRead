package com.nextread.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.nextread.services.RateLimitService;

@Configuration
@EnableScheduling
public class SchedulingConfiguration {

    private final RateLimitService rateLimitService;

    @Autowired
    public SchedulingConfiguration(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Scheduled(cron = "0 0 2 * * ?") // Every day at 2 AM
    public void cleanOldRateLimitRequests() {
        rateLimitService.cleanOldRequests();
    }
}