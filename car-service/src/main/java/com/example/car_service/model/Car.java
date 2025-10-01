package com.example.car_service.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;

@Entity
@Table(name = "cars")
@Schema(description = "Сущность машины")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "car_id")
    @Schema(description = "ID машины", example = "1")
    private Long carId;

    @Schema(description = "Марка машины", example = "Toyota")
    private String brand;

    @Schema(description = "Модель машины", example = "Camry")
    private String model;

    @Column(name = "release_year")
    @Schema(description = "Год выпуска", example = "2020")
    private int releaseYear;

    @Schema(description = "Пробег машины в км", example = "50000")
    private int mileage;

    @Schema(description = "Цена машины", example = "20000.0")
    private double price;

    @Column(name = "photo_url")
    @Schema(description = "Ссылка на фото машины", example = "https://example.com/car.jpg")
    private String photoUrl;

    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(int releaseYear) {
        this.releaseYear = releaseYear;
    }

    public int getMileage() {
        return mileage;
    }

    public void setMileage(int mileage) {
        this.mileage = mileage;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
