package com.example.booking_service.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "bookings")
@Schema(description = "Сущность бронирования")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    @Schema(description = "ID бронирования", example = "1")
    private Long bookingId;

    @Schema(description = "ID пользователя", example = "5")
    private Long userId;

    @Schema(description = "ID машины", example = "10")
    private Long carId;

    @Schema(description = "Дата начала бронирования")
    private LocalDate startDate;

    @Schema(description = "Дата окончания бронирования")
    private LocalDate endDate;

    @Schema(description = "Статус бронирования", example = "ACTIVE")
    private String status;

    // --- getters & setters ---
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
