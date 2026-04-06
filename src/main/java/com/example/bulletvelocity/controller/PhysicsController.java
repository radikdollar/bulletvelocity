package com.example.bulletvelocity.controller;

import com.example.bulletvelocity.model.CalculationRequest;
import com.example.bulletvelocity.model.CalculationResponse;
import com.example.bulletvelocity.view.PhysicsService;
import org.springframework.web.bind.annotation.*;

/**
 * REST контроллер (Слой Controller в MVC).
 * Его единственная задача — обработать веб-запрос, передать данные в сервис
 * и вернуть ответ. Никакой математики здесь быть не должно.
 */
@RestController
@RequestMapping("/api")
public class PhysicsController {

    private final PhysicsService physicsService;

    // Внедрение зависимости через конструктор (Dependency Injection)
    public PhysicsController(PhysicsService physicsService) {
        this.physicsService = physicsService;
    }

    @PostMapping("/calculate")
    public CalculationResponse calculateVelocity(@RequestBody CalculationRequest request) {
        // Делегируем выполнение логики слою Service
        return physicsService.calculateVelocity(request);
    }
}