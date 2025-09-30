package com.example.booking_service.controller;

import com.example.booking_service.client.CarClient;
import com.example.booking_service.client.PaymentClient;
import com.example.booking_service.dto.PaymentDTO;
import com.example.booking_service.model.Booking;
import com.example.booking_service.repository.BookingRepository;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    private final BookingRepository bookingRepository;
    private final CarClient carClient;
    private final PaymentClient paymentClient;

    public BookingController(BookingRepository bookingRepository, CarClient carClient, PaymentClient paymentClient) {
        this.bookingRepository = bookingRepository;
        this.carClient = carClient;
        this.paymentClient = paymentClient;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        logger.info("Получение всех бронирований");
        return bookingRepository.findAll();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        logger.info("Получение бронирования по id={}", id);
        return bookingRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Бронирование не найдено: {}", id);
                    return new RuntimeException("Бронирование не найдено: " + id);
                });
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        logger.info("Создание бронирования: {}", booking);
        try {
            // проверяем машину
            String carInfo = carClient.getCarById(booking.getCarId());
            logger.info("Ответ от car-service: {}", carInfo);

            Booking savedBooking = bookingRepository.save(booking);
            logger.info("Бронирование сохранено: {}", savedBooking);

            // создаём платёж через DTO
            PaymentDTO paymentDTO = new PaymentDTO(savedBooking.getBookingId(), 100.0);
            paymentClient.createPayment(paymentDTO);
            logger.info("Платёж создан для бронирования id={}", savedBooking.getBookingId());

            return ResponseEntity.ok(savedBooking);

        } catch (CallNotPermittedException e) {
            logger.error("CircuitBreaker сработал для сервиса: {}", e.getMessage());
            return ResponseEntity.status(503)
                    .body("Сервис временно недоступен, CircuitBreaker сработал: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Ошибка при создании бронирования: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body("Ошибка при создании бронирования: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        logger.info("Удаление бронирования id={}", id);
        bookingRepository.deleteById(id);
    }
}
