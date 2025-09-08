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
        // Verificar si el usuario ya existe antes de intentar crearlo
        if (userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new RuntimeException("Ya existe una cuenta registrada con este email.");
        }

        // Verificar si el nickname ya está en uso
        if (userRepository.findByNickname(input.getUsername()).isPresent()) {
            throw new RuntimeException("Este nombre de usuario ya está en uso. Elige otro.");
        }

        try {
            User user = new User(input.getEmail(), input.getUsername(), passwordEncoder.encode(input.getPassword()));
            // Asignar avatar por defecto aleatorio de 5 posibles
            int randomAvatar = new Random().nextInt(6) + 1;
            String frontendUrl = System.getenv("FRONTEND_URL");
            if (frontendUrl == null || frontendUrl.isEmpty()) {
                frontendUrl = "http://localhost:3000"; // Fallback para desarrollo
            }
            user.setAvatarUrl(frontendUrl + "/avatars/avatar" + randomAvatar + ".png");
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
            user.setEnabled(false);
            
            // Intentar enviar email de verificación
            try {
                sendVerificationEmail(user);
            } catch (Exception emailError) {
                throw new RuntimeException("No se pudo enviar el email de verificación. Verifica tu dirección de email.");
            }

            // Guardar el usuario primero
            User savedUser = userRepository.save(user);

            // Crear encuesta por defecto para el nuevo usuario
            surveyService.findByUserOrCreate(savedUser);

            return savedUser;
        } catch (Exception e) {
            // Si es una RuntimeException que ya lanzamos, re-lanzarla
            if (e instanceof RuntimeException && e.getMessage().contains("email") || 
                e.getMessage().contains("usuario") || e.getMessage().contains("verificación")) {
                throw e;
            }
            // Para otros errores, mensaje genérico
            throw new RuntimeException("Error al crear la cuenta. Inténtalo de nuevo más tarde.");
        }
    }

    public User authenticate(LoginUserDTO input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("Las credenciales ingresadas no son válidas."));

        if (!user.isEnabled()) {
            throw new RuntimeException(
                    "La cuenta todavía no está verificada. Por favor, verifica tu email antes de iniciar sesión.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));
        } catch (Exception e) {
            throw new RuntimeException("Las credenciales ingresadas no son válidas.");
        }

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

    private void sendVerificationEmail(User user) {
        String frontendUrl = System.getenv("FRONTEND_URL");
        if (frontendUrl == null || frontendUrl.isEmpty()) {
            frontendUrl = "http://localhost:3000"; // Fallback para desarrollo
        }
        
        String logoUrl = frontendUrl + "/logo-email.png";  // los archivos de public de Next.js se sirven como recurso estático sin pasar por ninguna ruta especial
        
        String subject = "Verifica tu cuenta en NextRead";
        String htmlMessage = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset=\"UTF-8\">"
                + "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
                + "<title>Verificaci&oacute;n de cuenta - NextRead</title>"
                + "</head>"
                + "<body style=\"margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fef7ed;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\">"
                
                // Header 
                + "<div style=\"background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 32px; text-align: center;\">"
                + "<img src=\"" + logoUrl + "\" alt=\"NextRead\" style=\"height: 48px; margin-bottom: 16px;\" onerror=\"this.style.display='none';\"/>"
                + "<h1 style=\"color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: -0.02em;\">NextRead</h1>"
                + "<p style=\"color: #fed7aa; font-size: 16px; margin: 8px 0 0 0;\">Tu pr&oacute;ximo libro favorito te est&aacute; esperando</p>"
                + "</div>"
                
                // Contenido principal
                + "<div style=\"padding: 48px 32px;\">"
                + "<div style=\"text-align: center; margin-bottom: 32px;\">"
                + "<div style=\"display: inline-block; padding: 16px; background-color: #fff7ed; border-radius: 50%; margin-bottom: 24px;\">"
                + "<span style=\"font-size: 48px;\">&#x2728;</span>"
                + "</div>"
                + "<h2 style=\"color: #1f2937; font-size: 28px; font-weight: 600; margin: 0 0 16px 0; line-height: 1.3;\">&iexcl;Bienvenido a NextRead!</h2>"
                + "<p style=\"color: #6b7280; font-size: 18px; line-height: 1.6; margin: 0;\">Est&aacute;s a un paso de descubrir tu pr&oacute;xima lectura favorita</p>"
                + "</div>"
                
                // Código de verificación
                + "<div style=\"background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 16px; padding: 32px; text-align: center; margin: 32px 0; border: 3px solid #f59e0b;\">"
                + "<p style=\"color: #92400e; font-size: 16px; font-weight: 500; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.05em;\">Tu c&oacute;digo de verificaci&oacute;n</p>"
                + "<div style=\"background-color: #ffffff; border-radius: 12px; padding: 24px; margin: 16px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\">"
                + "<span style=\"font-size: 36px; font-weight: 800; color: #ea580c; letter-spacing: 0.1em; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;\">" + user.getVerificationCode() + "</span>"
                + "</div>"
                + "<p style=\"color: #92400e; font-size: 14px; margin: 16px 0 0 0;\">&#x23F0; Este c&oacute;digo expira en 15 minutos</p>"
                + "</div>"
                
                // Instrucciones
                + "<div style=\"background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0;\">"
                + "<h3 style=\"color: #374151; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;\">&iquest;C&oacute;mo verificar tu cuenta?</h3>"
                + "<ol style=\"color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0; padding-left: 20px;\">"
                + "<li style=\"margin-bottom: 8px;\">Regresa a la p&aacute;gina de NextRead</li>"
                + "<li style=\"margin-bottom: 8px;\">Ingresa el c&oacute;digo de 6 d&iacute;gitos</li>"
                + "<li style=\"margin-bottom: 0;\">&iexcl;Empieza a descubrir libros incre&iacute;bles!</li>"
                + "</ol>"
                + "</div>"
                + "</div>"
                
                // Footer
                + "<div style=\"background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;\">"
                + "<p style=\"color: #9ca3af; font-size: 14px; margin: 0 0 8px 0;\">&iquest;No solicitaste esta verificaci&oacute;n?</p>"
                + "<p style=\"color: #9ca3af; font-size: 14px; margin: 0;\">Puedes ignorar este mensaje de forma segura.</p>"
                + "<div style=\"margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;\">"
                + "<p style=\"color: #d1d5db; font-size: 12px; margin: 0;\">&copy; 2024 NextRead - Descubre tu pr&oacute;xima gran lectura</p>"
                + "</div>"
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
