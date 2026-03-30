package com.example.bulletvelocity;

import org.springframework.web.bind.annotation.*;

/**
 * REST контроллер для обработки математической логики.
 * Здесь мы принимаем данные от фронтенда, применяем формулы физики и возвращаем результат.
 */
@RestController
@RequestMapping("/api")
public class PhysicsController {

    // Вспомогательные классы (record) для приема и отправки данных в формате JSON
    public record CalculationRequest(double bulletMass, double pendulumMass, double height) {
    }

    public record CalculationResponse(double velocity, String formattedVelocity) {
    }

    /**
     * Эндпоинт, принимающий POST запрос с переменными для расчета.
     */
    @PostMapping("/calculate")
    public CalculationResponse calculateVelocity(@RequestBody CalculationRequest request) {

        // 1. Переводим входные данные в систему СИ
        // Масса пули (m): из граммов в килограммы
        double m = request.bulletMass() / 1000.0;

        // Масса маятника (M): остается в килограммах
        double M = request.pendulumMass();

        // Высота (h): из сантиметров в метры
        double h = request.height() / 100.0;

        // Ускорение свободного падения (g)
        double g = 9.81;

        // 2. Применяем формулу баллистического маятника:
        // Скорость пули V = ((m + M) / m) * sqrt(2 * g * h)
        double velocity = ((m + M) / m) * Math.sqrt(2 * g * h);

        // 3. Форматируем результат до двух знаков после запятой для красоты
        String formatted = String.format("%.2f", velocity);

        // 4. Возвращаем результат обратно на веб-страницу
        return new CalculationResponse(velocity, formatted);
    }
}