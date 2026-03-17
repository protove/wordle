package com.example.wordle.security.config

import com.example.wordle.security.filter.RateLimitingFilter
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RateLimitingConfig {
    @Bean
    fun rateLimitingFilter(): FilterRegistrationBean<RateLimitingFilter> {
        val registration = FilterRegistrationBean<RateLimitingFilter>()
        registration.filter = RateLimitingFilter(maxRequests = 20, windowMs = 60_000L)
        registration.addUrlPatterns("/api/auth/*")
        registration.order = 1
        return registration
    }
}
