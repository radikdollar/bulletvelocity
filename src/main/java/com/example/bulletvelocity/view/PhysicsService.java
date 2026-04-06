package com.example.bulletvelocity.view;

import com.example.bulletvelocity.model.CalculationRequest;
import com.example.bulletvelocity.model.CalculationResponse;

/**
 * Интерфейс сервиса физических расчетов.
 * Выполнение принципа Dependency Inversion (SOLID):
 * контроллер будет зависеть от абстракции, а не от конкретной реализации.
 */
public interface PhysicsService {
    CalculationResponse calculateVelocity(CalculationRequest request);
}