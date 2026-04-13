package com.example.bulletvelocity.controller;

import com.example.bulletvelocity.model.CalculationRequest;
import com.example.bulletvelocity.model.CalculationResponse;
import com.example.bulletvelocity.model.PhysicsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

/**
 * REST API Контроллер.
 * Возвращает данные в формате JSON. Идеально для мобильных приложений или других серверов.
 */
@RestController
@RequestMapping("/api/v1/physics")
// @Tag - Аннотация Swagger для группировки и описания API
@Tag(name = "Баллистический калькулятор", description = "API для расчетов скорости через баллистический маятник")
public class PhysicsRestController {

    private final PhysicsService physicsService;

    public PhysicsRestController(PhysicsService physicsService) {
        this.physicsService = physicsService;
    }

    // @Operation - Аннотация Swagger для описания конкретного метода
    @Operation(
            summary = "Рассчитать начальную скорость",
            description = "Принимает массы пули и маятника, а также высоту подъема, и возвращает рассчитанную скорость."
    )
    @PostMapping("/calculate")
    public CalculationResponse calculate(
            @RequestBody CalculationRequest request
    ) {
        // Мы переиспользуем тот же самый сервис, что и для HTML-страницы!
        return physicsService.calculateVelocity(request);
    }
}
