package com.nextread.utils.anotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.nextread.utils.validators.HalfStarIncrementValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = HalfStarIncrementValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface HalfStarIncrement {
    String message() default "El rating debe estar en incrementos de 0.5";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
