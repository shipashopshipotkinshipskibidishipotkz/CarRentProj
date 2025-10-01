package com.example.booking_service.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "car-service")
public interface CarClient {

    @GetMapping("/cars/{id}")
    @CircuitBreaker(name = "car-service")
    String getCarById(@PathVariable("id") Long id);
}
