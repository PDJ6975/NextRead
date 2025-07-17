package com.nextread.utils.validators;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nextread.utils.anotations.HalfStarIncrement;

import jakarta.validation.ConstraintValidatorContext;

@ExtendWith(MockitoExtension.class)
class HalfStarIncrementValidatorTest {

    private HalfStarIncrementValidator validator;

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private HalfStarIncrement annotation;

    @BeforeEach
    void setUp() {
        validator = new HalfStarIncrementValidator();
        validator.initialize(annotation);
    }

    @Nested
    @DisplayName("Valid Values Tests")
    class ValidValuesTests {

        @Test
        @DisplayName("Should accept null value")
        void shouldAcceptNullValue() {
            // When
            boolean result = validator.isValid(null, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 0.0")
        void shouldAcceptZero() {
            // When
            boolean result = validator.isValid(0.0f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 0.5")
        void shouldAcceptHalf() {
            // When
            boolean result = validator.isValid(0.5f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 1.0")
        void shouldAcceptOne() {
            // When
            boolean result = validator.isValid(1.0f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 1.5")
        void shouldAcceptOneAndHalf() {
            // When
            boolean result = validator.isValid(1.5f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 2.0")
        void shouldAcceptTwo() {
            // When
            boolean result = validator.isValid(2.0f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 2.5")
        void shouldAcceptTwoAndHalf() {
            // When
            boolean result = validator.isValid(2.5f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 3.0")
        void shouldAcceptThree() {
            // When
            boolean result = validator.isValid(3.0f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 3.5")
        void shouldAcceptThreeAndHalf() {
            // When
            boolean result = validator.isValid(3.5f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 4.0")
        void shouldAcceptFour() {
            // When
            boolean result = validator.isValid(4.0f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 4.5")
        void shouldAcceptFourAndHalf() {
            // When
            boolean result = validator.isValid(4.5f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept 5.0")
        void shouldAcceptFive() {
            // When
            boolean result = validator.isValid(5.0f, context);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should accept all valid half-star increments")
        void shouldAcceptAllValidHalfStarIncrements() {
            // Given
            float[] validValues = { 0.0f, 0.5f, 1.0f, 1.5f, 2.0f, 2.5f, 3.0f, 3.5f, 4.0f, 4.5f, 5.0f };

            // When & Then
            for (float value : validValues) {
                boolean result = validator.isValid(value, context);
                assertTrue(result, "Value " + value + " should be valid");
            }
        }
    }

    @Nested
    @DisplayName("Invalid Values Tests")
    class InvalidValuesTests {

        @Test
        @DisplayName("Should reject negative values")
        void shouldRejectNegativeValues() {
            // Given
            float[] negativeValues = { -1.0f, -0.5f, -2.5f, -10.0f };

            // When & Then
            for (float value : negativeValues) {
                boolean result = validator.isValid(value, context);
                assertFalse(result, "Negative value " + value + " should be invalid");
            }
        }

        @Test
        @DisplayName("Should reject values greater than 5")
        void shouldRejectValuesGreaterThanFive() {
            // Given
            float[] tooHighValues = { 5.5f, 6.0f, 10.0f, 100.0f };

            // When & Then
            for (float value : tooHighValues) {
                boolean result = validator.isValid(value, context);
                assertFalse(result, "Value " + value + " should be invalid (greater than 5)");
            }
        }

        @Test
        @DisplayName("Should reject values not in half-star increments")
        void shouldRejectValuesNotInHalfStarIncrements() {
            // Given
            float[] invalidIncrements = { 0.1f, 0.3f, 0.7f, 1.2f, 1.8f, 2.3f, 2.7f, 3.1f, 3.9f, 4.2f, 4.8f };

            // When & Then
            for (float value : invalidIncrements) {
                boolean result = validator.isValid(value, context);
                assertFalse(result, "Value " + value + " should be invalid (not half-star increment)");
            }
        }

        @Test
        @DisplayName("Should reject 0.1")
        void shouldRejectZeroPointOne() {
            // When
            boolean result = validator.isValid(0.1f, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should reject 0.3")
        void shouldRejectZeroPointThree() {
            // When
            boolean result = validator.isValid(0.3f, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should reject 1.2")
        void shouldRejectOnePointTwo() {
            // When
            boolean result = validator.isValid(1.2f, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should reject 2.7")
        void shouldRejectTwoPointSeven() {
            // When
            boolean result = validator.isValid(2.7f, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should reject 3.9")
        void shouldRejectThreePointNine() {
            // When
            boolean result = validator.isValid(3.9f, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should reject 4.8")
        void shouldRejectFourPointEight() {
            // When
            boolean result = validator.isValid(4.8f, context);

            // Then
            assertFalse(result);
        }
    }

    @Nested
    @DisplayName("Edge Cases Tests")
    class EdgeCasesTests {

        @Test
        @DisplayName("Should handle very small positive values")
        void shouldHandleVerySmallPositiveValues() {
            // Given
            float verySmallValue = 0.01f;

            // When
            boolean result = validator.isValid(verySmallValue, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should handle very small negative values")
        void shouldHandleVerySmallNegativeValues() {
            // Given
            float verySmallNegativeValue = -0.01f;

            // When
            boolean result = validator.isValid(verySmallNegativeValue, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should handle values just above 5")
        void shouldHandleValuesJustAboveFive() {
            // Given
            float justAboveFive = 5.01f;

            // When
            boolean result = validator.isValid(justAboveFive, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should handle floating point precision issues")
        void shouldHandleFloatingPointPrecisionIssues() {
            // Given - These values have enough precision difference to be detected
            float precisionValue1 = 1.51f; // Close to 1.5 but not exact
            float precisionValue2 = 2.49f; // Close to 2.5 but not exact

            // When
            boolean result1 = validator.isValid(precisionValue1, context);
            boolean result2 = validator.isValid(precisionValue2, context);

            // Then - Should still work correctly with precision differences
            assertFalse(result1);
            assertFalse(result2);
        }

        @Test
        @DisplayName("Should handle Float.MAX_VALUE")
        void shouldHandleFloatMaxValue() {
            // When
            boolean result = validator.isValid(Float.MAX_VALUE, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should handle Float.MIN_VALUE")
        void shouldHandleFloatMinValue() {
            // When
            boolean result = validator.isValid(Float.MIN_VALUE, context);

            // Then
            assertFalse(result); // Float.MIN_VALUE is positive but very small
        }

        @Test
        @DisplayName("Should handle negative Float.MAX_VALUE")
        void shouldHandleNegativeFloatMaxValue() {
            // When
            boolean result = validator.isValid(-Float.MAX_VALUE, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should handle positive infinity")
        void shouldHandlePositiveInfinity() {
            // When
            boolean result = validator.isValid(Float.POSITIVE_INFINITY, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should handle negative infinity")
        void shouldHandleNegativeInfinity() {
            // When
            boolean result = validator.isValid(Float.NEGATIVE_INFINITY, context);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should handle NaN")
        void shouldHandleNaN() {
            // When
            boolean result = validator.isValid(Float.NaN, context);

            // Then
            assertFalse(result);
        }
    }

    @Nested
    @DisplayName("Boundary Tests")
    class BoundaryTests {

        @Test
        @DisplayName("Should accept exact boundary values")
        void shouldAcceptExactBoundaryValues() {
            // When & Then
            assertTrue(validator.isValid(0.0f, context), "Lower boundary 0.0 should be valid");
            assertTrue(validator.isValid(5.0f, context), "Upper boundary 5.0 should be valid");
        }

        @Test
        @DisplayName("Should reject values just outside boundaries")
        void shouldRejectValuesJustOutsideBoundaries() {
            // When & Then
            assertFalse(validator.isValid(-0.1f, context), "Just below lower boundary should be invalid");
            assertFalse(validator.isValid(5.1f, context), "Just above upper boundary should be invalid");
        }

        @Test
        @DisplayName("Should test mathematical precision at boundaries")
        void shouldTestMathematicalPrecisionAtBoundaries() {
            // Given - Test the mathematical formula (value * 2) % 1 == 0
            float[] boundaryValues = { 0.0f, 0.5f, 5.0f, 4.5f };

            // When & Then
            for (float value : boundaryValues) {
                boolean result = validator.isValid(value, context);
                assertTrue(result, "Boundary value " + value + " should be valid");

                // Verify the mathematical condition
                assertEquals(0.0, (value * 2) % 1, 0.0001,
                        "Mathematical condition should be satisfied for " + value);
            }
        }
    }

    @Nested
    @DisplayName("Algorithm Tests")
    class AlgorithmTests {

        @Test
        @DisplayName("Should verify mathematical formula for valid values")
        void shouldVerifyMathematicalFormulaForValidValues() {
            // Given
            float[] validValues = { 0.0f, 0.5f, 1.0f, 1.5f, 2.0f, 2.5f, 3.0f, 3.5f, 4.0f, 4.5f, 5.0f };

            // When & Then
            for (float value : validValues) {
                double result = (value * 2) % 1;
                assertEquals(0.0, result, 0.0001,
                        "Mathematical formula should return 0 for valid value " + value);
            }
        }

        @Test
        @DisplayName("Should verify mathematical formula for invalid values")
        void shouldVerifyMathematicalFormulaForInvalidValues() {
            // Given
            float[] invalidValues = { 0.1f, 0.3f, 1.2f, 2.7f, 3.9f, 4.8f };

            // When & Then
            for (float value : invalidValues) {
                double result = (value * 2) % 1;
                assertNotEquals(0.0, result, 0.0001,
                        "Mathematical formula should not return 0 for invalid value " + value);
            }
        }

        @Test
        @DisplayName("Should verify range check works correctly")
        void shouldVerifyRangeCheckWorksCorrectly() {
            // Given
            float[] outOfRangeValues = { -1.0f, -0.5f, 5.5f, 6.0f };

            // When & Then
            for (float value : outOfRangeValues) {
                boolean inRange = value >= 0 && value <= 5;
                assertFalse(inRange, "Value " + value + " should be out of range");

                boolean validatorResult = validator.isValid(value, context);
                assertFalse(validatorResult, "Validator should reject out of range value " + value);
            }
        }
    }
}