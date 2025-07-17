package com.nextread.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextread.dto.UserProfileDTO;
import com.nextread.entities.User;
import com.nextread.services.UserService;

@RequestMapping("/users")
@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        UserProfileDTO userDTO = UserProfileDTO.builder()
                .nickname(currentUser.getNickname())
                .avatarUrl(currentUser.getAvatarUrl())
                .build();
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/avatar")
    public ResponseEntity<String> updateAvatar(@RequestBody String avatar) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        String updatedAvatar = userService.updateAvatar(avatar, currentUser);

        return ResponseEntity.ok(updatedAvatar);
    }

    @PutMapping("/nickname")
    public ResponseEntity<String> updateNickname(@RequestBody String nickname) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        String updatedNickname = userService.updateNickname(nickname, currentUser);

        return ResponseEntity.ok(updatedNickname);
    }
}
