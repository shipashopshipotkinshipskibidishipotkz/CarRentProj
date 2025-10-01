package com.example.booking_service.controller;

import com.example.booking_service.client.CarClient;
import com.example.booking_service.client.PaymentClient;
import com.example.booking_service.dto.PaymentDTO;
import com.example.booking_service.model.Booking;
import com.example.booking_service.repository.BookingRepository;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "Получить все бронирования")
    @GetMapping
    public List<Booking> getAllBookings() {
        logger.info("Получение всех бронирований");
        return bookingRepository.findAll();
    }

    @Operation(summary = "Получить бронирование по ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Бронирование найдено"),
            @ApiResponse(responseCode = "404", description = "Бронирование не найдено")
    })
    @GetMapping("/{id}")
    public Booking getBookingById(
            @Parameter(description = "ID бронирования", example = "1")
            @PathVariable Long id) {
        logger.info("Получение бронирования по id={}", id);
        return bookingRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Бронирование не найдено: {}", id);
                    return new RuntimeException("Бронирование не найдено: " + id);
                });
    }

    @Operation(summary = "Создать новое бронирование")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Бронирование успешно создано"),
            @ApiResponse(responseCode = "503", description = "Сервис временно недоступен"),
            @ApiResponse(responseCode = "500", description = "Ошибка при создании бронирования")
    })
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        logger.info("Создание бронирования: {}", booking);
        try {
            String carInfo = carClient.getCarById(booking.getCarId());
            logger.info("Ответ от car-service: {}", carInfo);

            Booking savedBooking = bookingRepository.save(booking);
            logger.info("Бронирование сохранено: {}", savedBooking);

            PaymentDTO paymentDTO = new PaymentDTO();
            paymentDTO.setBookingId(savedBooking.getBookingId());
            paymentDTO.setAmount(100.0);

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

    @Operation(summary = "Удалить бронирование по ID")
    @DeleteMapping("/{id}")
    public void deleteBooking(
            @Parameter(description = "ID бронирования", example = "1")
            @PathVariable Long id) {
        logger.info("Удаление бронирования id={}", id);
        bookingRepository.deleteById(id);
    }
}
