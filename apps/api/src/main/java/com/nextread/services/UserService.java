package com.nextread.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nextread.entities.User;
import com.nextread.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
    }

    @Transactional
    public String updateAvatar(String avatar, User current) {

        User user = userRepository.findByEmail(current.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setAvatarUrl(avatar);
        userRepository.save(user);
        return user.getAvatarUrl();

    }
}
