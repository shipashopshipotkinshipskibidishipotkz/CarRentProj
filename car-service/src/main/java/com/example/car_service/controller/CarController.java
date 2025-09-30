package com.example.car_service.controller;

import com.example.car_service.model.Car;
import com.example.car_service.repository.CarRepository;
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

    @GetMapping
    public List<Car> getAllCars() {
        logger.info("Получение всех машин");
        return carRepository.findAll();
    }

    @GetMapping("/{id}")
    public Car getCarById(@PathVariable Long id) {
        logger.info("Получение машины по id={}", id);
        return carRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Машина не найдена: {}", id);
                    return new RuntimeException("Машина не найдена: " + id);
                });
    }

    @PostMapping
    public Car createCar(@RequestBody Car car) {
        logger.info("Создание машины: {}", car);
        Car savedCar = carRepository.save(car);
        logger.info("Машина сохранена: {}", savedCar);
        return savedCar;
    }

    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable Long id) {
        logger.info("Удаление машины id={}", id);
        carRepository.deleteById(id);
    }
}
