package com.nextread.utils.validators;

import com.nextread.utils.anotations.HalfStarIncrement;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class HalfStarIncrementValidator implements ConstraintValidator<HalfStarIncrement, Float> {
    
    @Override
    public boolean isValid(Float value, ConstraintValidatorContext context) {
        if (value == null) return true; // Permitimos nulos al ser el campo opcional
        return value >= 0 && value <= 5 && (value * 2) % 1 == 0;
    }
}
