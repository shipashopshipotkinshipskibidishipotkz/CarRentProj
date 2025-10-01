package com.example.booking_service.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.booking_service.dto.PaymentDTO;

@FeignClient(name = "payment-service")
public interface PaymentClient {

    @PostMapping("/payments")
    @CircuitBreaker(name = "payment-service")
    Object createPayment(@RequestBody PaymentDTO payment);
}
