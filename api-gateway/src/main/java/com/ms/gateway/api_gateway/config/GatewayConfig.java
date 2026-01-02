package com.ms.gateway.api_gateway.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {

        log.info("🌐 Configuring API Gateway Routes...");

        return builder.routes()

                // ============================================
                // USER MANAGEMENT SERVICE ROUTES
                // ============================================
                .route("user-management-service", r -> r
                        .path("/api/users/**", "/api/auth/**")
                        .filters(f -> f
                                .addRequestHeader("X-Gateway", "API-Gateway")
                                .addRequestHeader("X-Service", "UserManagement")
                                .addResponseHeader("X-Powered-By", "Spring Cloud Gateway"))
                        .uri("http://localhost:8081"))

                // ============================================
                // CREDIT SCORING SERVICE ROUTES
                // ============================================
                .route("credit-scoring-service", r -> r
                        .path("/api/credit/**")
                        .filters(f -> f
                                .addRequestHeader("X-Gateway", "API-Gateway")
                                .addRequestHeader("X-Service", "CreditScoring")
                                .addResponseHeader("X-Powered-By", "Spring Cloud Gateway"))
                        .uri("http://localhost:8082"))

                // ============================================
                // HEALTH CHECK ROUTE
                // ============================================
                .route("health-check", r -> r
                        .path("/health")
                        .filters(f -> f.setStatus(200))
                        .uri("no://op"))

                .build();
    }
}