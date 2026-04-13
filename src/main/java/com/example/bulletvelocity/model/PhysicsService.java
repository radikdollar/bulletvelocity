package com.example.bulletvelocity.model;

/**
 * Интерфейс сервиса физических расчетов.
 * Выполнение принципа Dependency Inversion (SOLID):
 * контроллер будет зависеть от абстракции, а не от конкретной реализации.
 */
public interface PhysicsService {
    CalculationResponse calculateVelocity(CalculationRequest request);
}