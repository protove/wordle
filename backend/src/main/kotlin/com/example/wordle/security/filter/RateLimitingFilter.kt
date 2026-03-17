package com.example.wordle.security.filter

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.web.filter.OncePerRequestFilter
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList

class RateLimitingFilter(
    private val maxRequests: Int = 20,
    private val windowMs: Long = 60_000L,
) : OncePerRequestFilter() {
    private val requestLog = ConcurrentHashMap<String, CopyOnWriteArrayList<Long>>()

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val clientIp = resolveClientIp(request)
        val now = System.currentTimeMillis()
        val windowStart = now - windowMs

        val timestamps = requestLog.computeIfAbsent(clientIp) { CopyOnWriteArrayList() }

        // 윈도우 밖의 오래된 요청 제거
        timestamps.removeIf { it < windowStart }

        if (timestamps.size >= maxRequests) {
            response.status = HttpStatus.TOO_MANY_REQUESTS.value()
            response.contentType = "application/json"
            response.writer.write("""{"error":"Too many requests. Please try again later."}""")
            return
        }

        timestamps.add(now)
        filterChain.doFilter(request, response)
    }

    private fun resolveClientIp(request: HttpServletRequest): String {
        val xForwardedFor = request.getHeader("X-Forwarded-For")
        return if (!xForwardedFor.isNullOrBlank()) {
            xForwardedFor.split(",").first().trim()
        } else {
            request.remoteAddr
        }
    }
}
