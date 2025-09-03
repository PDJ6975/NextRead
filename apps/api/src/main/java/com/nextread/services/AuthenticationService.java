package com.nextread.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nextread.dto.LoginUserDTO;
import com.nextread.dto.RegisterUserDTO;
import com.nextread.dto.VerifyUserDTO;
import com.nextread.entities.User;
import com.nextread.repositories.UserRepository;

import jakarta.mail.MessagingException;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final SurveyService surveyService;

    @Autowired
    public AuthenticationService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            EmailService emailService,
            SurveyService surveyService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.surveyService = surveyService;
    }

    public User signUp(RegisterUserDTO input) {
        User user = new User(input.getEmail(), input.getUsername(), passwordEncoder.encode(input.getPassword()));
        // Asignar avatar por defecto aleatorio de 5 posibles
        // TODO: Cambiar la URL base a la del entorno de producción cuando se despliegue
        int randomAvatar = new Random().nextInt(6) + 1;
        user.setAvatarUrl("http://localhost:3000/avatars/avatar" + randomAvatar + ".png");
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationEmail(user);

        // Guardar el usuario primero
        User savedUser = userRepository.save(user);

        // Crear encuesta por defecto para el nuevo usuario
        surveyService.findByUserOrCreate(savedUser);

        return savedUser;
    }

    public User authenticate(LoginUserDTO input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (!user.isEnabled()) {
            throw new RuntimeException(
                    "La cuenta todavía no está verificada. Por favor, hazlo antes de iniciar sesión.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));

        return user;
    }

    public void verifyUser(VerifyUserDTO input) {
        Optional<User> optionalUser = userRepository.findByEmail(input.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("El código de verificación ha expirado.");
            }
            if (user.getVerificationCode().equals(input.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiresAt(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("El código de verificación es incorrecto");
            }
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    public void resendVerificationCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new RuntimeException("La cuenta ya ha sido verificada");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1)); // 1 hora de caducidad, lo podemos
                                                                                 // cambiar
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    private void sendVerificationEmail(User user) { // TODO: Actualizar con nuestro logo. Asegurar mensaje adaptado
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            // Controlar excepciones de email
            e.printStackTrace();
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
