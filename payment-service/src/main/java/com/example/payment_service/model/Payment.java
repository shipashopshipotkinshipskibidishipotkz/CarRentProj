package com.example.payment_service.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Schema(description = "Сущность платежа")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    @Schema(description = "ID платежа", example = "1")
    private Long paymentId;

    @Schema(description = "ID бронирования", example = "10")
    private Long bookingId;

    @Schema(description = "Сумма платежа", example = "100.0")
    private Double amount;

    @Column(name = "payment_date")
    @Schema(description = "Дата и время платежа")
    private LocalDateTime paymentDate;

    @Schema(description = "Статус платежа", example = "COMPLETED")
    private String status;

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
