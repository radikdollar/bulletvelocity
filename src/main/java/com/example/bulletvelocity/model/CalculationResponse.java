package com.example.bulletvelocity.model;

/**
 * DTO (Data Transfer Object) для отправки данных клиенту.
 **/
public record CalculationResponse(double velocity, String formattedVelocity) {
}