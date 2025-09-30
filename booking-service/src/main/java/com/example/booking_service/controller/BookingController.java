package com.example.booking_service.controller;

import com.example.booking_service.client.CarClient;
import com.example.booking_service.client.PaymentClient;
import com.example.booking_service.dto.PaymentDTO;
import com.example.booking_service.model.Booking;
import com.example.booking_service.repository.BookingRepository;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

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
        return bookingRepository.findAll();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Бронирование не найдено: " + id));
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            // проверяем машину
            String carInfo = carClient.getCarById(booking.getCarId());
            Booking savedBooking = bookingRepository.save(booking);

            // создаём платёж через DTO
            PaymentDTO paymentDTO = new PaymentDTO(savedBooking.getBookingId(), 100.0);
            paymentClient.createPayment(paymentDTO);

            return ResponseEntity.ok(savedBooking);

        } catch (CallNotPermittedException e) {
            return ResponseEntity.status(503)
                    .body("Сервис временно недоступен, CircuitBreaker сработал: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Ошибка при создании бронирования: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
    }
}
