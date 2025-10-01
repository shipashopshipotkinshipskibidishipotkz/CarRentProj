package com.example.car_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI carServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Car Service API")
                        .description("API для управления машинами")
                        .version("v1.0"));
    }
}
