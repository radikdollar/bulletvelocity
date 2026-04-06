package com.example.bulletvelocity.model;

/**
 * Data Transfer Object для приема данных от клиента.
 **/
public record CalculationRequest(double bulletMass, double pendulumMass, double height) {
}