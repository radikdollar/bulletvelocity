package com.example.bulletvelocity.model;

import org.springframework.stereotype.Service;

import java.util.Locale;

/**
 * Реализация бизнес-логики.
 * Выполнение принципа Single Responsibility (SOLID):
 * этот класс занимается ТОЛЬКО математическими расчетами.
 */
@Service
public class PhysicsServiceImpl implements PhysicsService {

    private static final double GRAVITY = 9.81;

    @Override
    public CalculationResponse calculateVelocity(CalculationRequest request) {
        // 1. Переводим входные данные в систему СИ
        double m = request.bulletMass() / 1000.0;
        double M = request.pendulumMass();
        double h = request.height() / 100.0;

        // 2. Применяем формулу баллистического маятника
        double velocity = ((m + M) / m) * Math.sqrt(2 * GRAVITY * h);

        // 3. Форматируем результат
        // Используем Locale.US, чтобы разделителем всегда была точка, а не запятая
        String formatted = String.format(Locale.US, "%.2f", velocity);

        // 4. Возвращаем объект ответа
        return new CalculationResponse(velocity, formatted);
    }
}