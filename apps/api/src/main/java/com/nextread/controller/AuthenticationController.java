package com.nextread.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nextread.dto.LoginUserDTO;
import com.nextread.dto.RegisterUserDTO;
import com.nextread.dto.VerifyUserDTO;
import com.nextread.entities.User;
import com.nextread.responses.LoginResponse;
import com.nextread.services.AuthenticationService;
import com.nextread.services.JwtService;
import com.nextread.services.SurveyService;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final SurveyService surveyService;

    @Autowired
    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService,
            SurveyService surveyService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.surveyService = surveyService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody RegisterUserDTO registerUserDTO) {
        try {
            User registeredUser = authenticationService.signUp(registerUserDTO);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = Map.of("message", e.getMessage());
            
            // Determinar el código de estado basado en el tipo de error
            String message = e.getMessage();
            if (message.contains("existe") || message.contains("registrada") || message.contains("uso")) {
                // Email ya existe o nickname en uso
                return ResponseEntity.status(409).body(errorResponse); // Conflict
            } else if (message.contains("verificación") || message.contains("email")) {
                // Problemas con email de verificación
                return ResponseEntity.status(422).body(errorResponse); // Unprocessable Entity
            } else {
                // Otros errores de validación
                return ResponseEntity.badRequest().body(errorResponse); // 400
            }
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginUserDTO loginUserDto) {
        try {
            User authenticatedUser = authenticationService.authenticate(loginUserDto);
            String jwtToken = jwtService.generateToken(authenticatedUser);

            // Obtener el estado firstTime de la encuesta del usuario
            var survey = surveyService.findSurveyByUser(authenticatedUser);
            boolean isFirstTime = survey.getFirstTime() != null ? survey.getFirstTime() : false;

            LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(), isFirstTime);
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = Map.of("message", e.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDTO verifyUserDTO) {
        try {
            authenticationService.verifyUser(verifyUserDTO);
            return ResponseEntity.ok("Cuenta verificada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Código de verificación enviado nuevamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
