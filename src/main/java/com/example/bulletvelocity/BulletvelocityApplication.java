package com.example.bulletvelocity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Главный класс приложения Spring Boot.
 * Аннотация @SpringBootApplication говорит фреймворку о том,
 * что это стартовая точка приложения, и включает автоматическую конфигурацию.
 */
@SpringBootApplication
public class BulletvelocityApplication {

    public static void main(String[] args) {
        // Запуск нашего бэкенд сервера
        SpringApplication.run(BulletvelocityApplication.class, args);
        System.out.println("Сервер запущен! Откройте в браузере: http://localhost:8080");
    }
}