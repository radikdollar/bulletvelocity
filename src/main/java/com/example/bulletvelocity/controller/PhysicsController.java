package com.example.bulletvelocity.controller;

import com.example.bulletvelocity.model.CalculationRequest;
import com.example.bulletvelocity.model.CalculationResponse;
import com.example.bulletvelocity.model.PhysicsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

/**
 * Классический MVC Контроллер.
 * Теперь он работает напрямую с HTML-шаблоном через Thymeleaf.
 */
@Controller
public class PhysicsController {

    private final PhysicsService physicsService;

    public PhysicsController(PhysicsService physicsService) {
        this.physicsService = physicsService;
    }

    // Обрабатывает открытие страницы в браузере (GET-запрос)
    @GetMapping("/")
    public String homePage(Model model) {
        // Передаем пустые/начальные данные для формы
        model.addAttribute("request", new CalculationRequest(9.0, 5.0, 15.0));
        return "index"; // Ищет файл src/main/resources/templates/index.html
    }

    // Обрабатывает нажатие кнопки "Выстрел" в форме (POST-запрос)
    @PostMapping("/calculate")
    public String calculateVelocity(@ModelAttribute CalculationRequest request, Model model) {
        // Делаем физический расчет
        CalculationResponse response = physicsService.calculateVelocity(request);

        // Передаем данные обратно в HTML
        model.addAttribute("request", request); // Чтобы значения в полях не стирались
        model.addAttribute("result", response); // Передаем результат

        return "index"; // Снова показываем ту же страницу, но уже с результатом
    }
}
