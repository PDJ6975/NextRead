package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender emailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    @DisplayName("Should successfully send verification email")
    void shouldSuccessfullySendVerificationEmail() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Account Verification";
        String text = "<html><body>Verification code: 123456</body></html>";

        doNothing().when(emailSender).send(any(MimeMessage.class));

        // When & Then
        assertDoesNotThrow(() -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("Should create MimeMessage with correct parameters")
    void shouldCreateMimeMessageWithCorrectParameters() throws MessagingException {
        // Given
        String to = "user@example.com";
        String subject = "Test Subject";
        String text = "<html><body>Test HTML content</body></html>";

        doNothing().when(emailSender).send(any(MimeMessage.class));

        // When
        emailService.sendVerificationEmail(to, subject, text);

        // Then
        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("Should throw exception for empty recipient email")
    void shouldThrowExceptionForEmptyRecipientEmail() throws MessagingException {
        // Given
        String to = "";
        String subject = "Test Subject";
        String text = "Test content";

        // When & Then
        assertThrows(MessagingException.class, () -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Should throw exception for null recipient email")
    void shouldThrowExceptionForNullRecipientEmail() throws MessagingException {
        // Given
        String to = null;
        String subject = "Test Subject";
        String text = "Test content";

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Should handle empty subject")
    void shouldHandleEmptySubject() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "";
        String text = "Test content";

        doNothing().when(emailSender).send(any(MimeMessage.class));

        // When & Then
        assertDoesNotThrow(() -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("Should throw exception for null subject")
    void shouldThrowExceptionForNullSubject() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = null;
        String text = "Test content";

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Should handle empty text content")
    void shouldHandleEmptyTextContent() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Test Subject";
        String text = "";

        doNothing().when(emailSender).send(any(MimeMessage.class));

        // When & Then
        assertDoesNotThrow(() -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("Should throw exception for null text content")
    void shouldThrowExceptionForNullTextContent() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Test Subject";
        String text = null;

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Should handle HTML content correctly")
    void shouldHandleHtmlContentCorrectly() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "HTML Test";
        String text = "<html><body><h1>Welcome!</h1><p>Your verification code is: <strong>123456</strong></p></body></html>";

        doNothing().when(emailSender).send(any(MimeMessage.class));

        // When & Then
        assertDoesNotThrow(() -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("Should handle special characters in email content")
    void shouldHandleSpecialCharactersInEmailContent() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Código de Verificación - Ñoño & Café";
        String text = "<html><body>Código: 123456 - Símbolos: @#$%^&*()_+</body></html>";

        doNothing().when(emailSender).send(any(MimeMessage.class));

        // When & Then
        assertDoesNotThrow(() -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("Should propagate MessagingException when JavaMailSender throws exception")
    void shouldPropagateMessagingExceptionWhenJavaMailSenderThrowsException() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Test Subject";
        String text = "Test content";

        doThrow(new MailException("SMTP server error") {
        }).when(emailSender).send(any(MimeMessage.class));

        // When & Then
        assertThrows(MailException.class, () -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("Should handle multiple consecutive email sends")
    void shouldHandleMultipleConsecutiveEmailSends() throws MessagingException {
        // Given
        String to1 = "user1@example.com";
        String to2 = "user2@example.com";
        String subject = "Test Subject";
        String text = "Test content";

        doNothing().when(emailSender).send(any(MimeMessage.class));

        // When
        emailService.sendVerificationEmail(to1, subject, text);
        emailService.sendVerificationEmail(to2, subject, text);

        // Then
        verify(emailSender, times(2)).createMimeMessage();
        verify(emailSender, times(2)).send(mimeMessage);
    }

    @Test
    @DisplayName("Should handle long email content")
    void shouldHandleLongEmailContent() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Long Content Test";
        StringBuilder longContent = new StringBuilder();
        for (int i = 0; i < 1000; i++) {
            longContent.append("This is a very long email content line ").append(i).append(". ");
        }
        String text = "<html><body>" + longContent.toString() + "</body></html>";

        doNothing().when(emailSender).send(any(MimeMessage.class));

        // When & Then
        assertDoesNotThrow(() -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("Should handle invalid email format gracefully")
    void shouldHandleInvalidEmailFormatGracefully() throws MessagingException {
        // Given
        String to = "invalid-email-format";
        String subject = "Test Subject";
        String text = "Test content";

        doNothing().when(emailSender).send(any(MimeMessage.class));

        // When & Then
        assertDoesNotThrow(() -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("Should throw exception for multiple recipients format")
    void shouldThrowExceptionForMultipleRecipientsFormat() throws MessagingException {
        // Given
        String to = "user1@example.com,user2@example.com";
        String subject = "Test Subject";
        String text = "Test content";

        // When & Then
        assertThrows(MessagingException.class, () -> {
            emailService.sendVerificationEmail(to, subject, text);
        });

        verify(emailSender).createMimeMessage();
        verify(emailSender, never()).send(any(MimeMessage.class));
    }
}