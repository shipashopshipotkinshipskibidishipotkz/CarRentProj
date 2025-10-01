package com.example.payment_service.controller;

import com.example.payment_service.model.Payment;
import com.example.payment_service.repository.PaymentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Operation(summary = "Получить все платежи")
    @GetMapping
    public List<Payment> getAllPayments() {
        logger.info("Получение всех платежей");
        return paymentRepository.findAll();
    }

    @Operation(summary = "Получить платеж по ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Платёж найден"),
            @ApiResponse(responseCode = "404", description = "Платёж не найден")
    })
    @GetMapping("/{id}")
    public Payment getPaymentById(
            @Parameter(description = "ID платежа", example = "1")
            @PathVariable Long id) {
        logger.info("Получение платежа по id={}", id);
        return paymentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Платёж не найден: {}", id);
                    return new RuntimeException("Платёж не найден: " + id);
                });
    }

    @Operation(summary = "Создать новый платёж")
    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        logger.info("Создание платежа: {}", payment);
        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Платёж сохранён: {}", savedPayment);
        return savedPayment;
    }

    @Operation(summary = "Удалить платёж по ID")
    @DeleteMapping("/{id}")
    public void deletePayment(
            @Parameter(description = "ID платежа", example = "1")
            @PathVariable Long id) {
        logger.info("Удаление платежа id={}", id);
        paymentRepository.deleteById(id);
    }
}
