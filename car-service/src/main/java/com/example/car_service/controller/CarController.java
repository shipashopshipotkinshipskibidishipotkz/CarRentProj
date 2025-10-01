package com.example.car_service.controller;

import com.example.car_service.model.Car;
import com.example.car_service.repository.CarRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarController {

    private static final Logger logger = LoggerFactory.getLogger(CarController.class);

    private final CarRepository carRepository;

    public CarController(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Operation(summary = "Получить все машины")
    @GetMapping
    public List<Car> getAllCars() {
        logger.info("Получение всех машин");
        return carRepository.findAll();
    }

    @Operation(summary = "Получить машину по ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Машина найдена"),
            @ApiResponse(responseCode = "404", description = "Машина не найдена")
    })
    @GetMapping("/{id}")
    public Car getCarById(
            @Parameter(description = "ID машины", example = "1")
            @PathVariable Long id) {
        logger.info("Получение машины по id={}", id);
        return carRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Машина не найдена: {}", id);
                    return new RuntimeException("Машина не найдена: " + id);
                });
    }

    @Operation(summary = "Создать новую машину")
    @PostMapping
    public Car createCar(@RequestBody Car car) {
        logger.info("Создание машины: {}", car);
        Car savedCar = carRepository.save(car);
        logger.info("Машина сохранена: {}", savedCar);
        return savedCar;
    }

    @Operation(summary = "Удалить машину по ID")
    @DeleteMapping("/{id}")
    public void deleteCar(
            @Parameter(description = "ID машины", example = "1")
            @PathVariable Long id) {
        logger.info("Удаление машины id={}", id);
        carRepository.deleteById(id);
    }
}
