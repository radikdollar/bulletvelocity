package com.example.bulletvelocity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BulletvelocityApplication {

    public static void main(String[] args) {
        SpringApplication.run(BulletvelocityApplication.class, args);
        System.out.println("Сервер запущен! Откройте в браузере: http://localhost:8080");
    }
}