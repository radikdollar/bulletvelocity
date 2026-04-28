package com.example.bulletvelocity.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Конфигурация безопасности проекта.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Отключаем требование логина и пароля для всех страниц
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )

                // 2. Настраиваем защиту от CSRF (подделка межсайтовых запросов)
                // Оставляем её включенной для нашей HTML-формы (Thymeleaf сам с ней разберется),
                // но отключаем для REST API и Swagger, иначе они не смогут отправлять POST-запросы.
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/**", "/swagger-ui/**", "/v3/api-docs/**")
                )

                // 3. (Опционально) Настройки для защиты заголовков браузера
                // Spring Security автоматически добавит заголовки от XSS, Clickjacking и т.д.
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin()) // Защита от встраивания твоего сайта в iframe хакеров
                );

        return http.build();
    }
}