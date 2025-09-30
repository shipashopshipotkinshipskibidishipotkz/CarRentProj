package com.example.payment_service.controller;

import com.example.payment_service.model.Payment;
import com.example.payment_service.repository.PaymentRepository;
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

    @GetMapping
    public List<Payment> getAllPayments() {
        logger.info("Получение всех платежей");
        return paymentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        logger.info("Получение платежа по id={}", id);
        return paymentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Платёж не найден: {}", id);
                    return new RuntimeException("Платёж не найден: " + id);
                });
    }

    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        logger.info("Создание платежа: {}", payment);
        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Платёж сохранён: {}", savedPayment);
        return savedPayment;
    }

    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable Long id) {
        logger.info("Удаление платежа id={}", id);
        paymentRepository.deleteById(id);
    }
}
