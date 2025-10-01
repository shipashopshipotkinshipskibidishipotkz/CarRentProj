package com.example.booking_service.dto;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO для создания платежа")
public class PaymentDTO {

    @Schema(description = "ID бронирования", example = "1")
    private Long bookingId;

    @Schema(description = "Сумма платежа", example = "100.0")
    private Double amount;

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
}
