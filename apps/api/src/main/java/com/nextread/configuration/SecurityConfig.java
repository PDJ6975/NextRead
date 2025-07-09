package com.nextread.configuration;

import org.springframework.context.annotation.Configuration;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

@Configuration
public class SecurityConfig {

  @Bean
  SecurityFilterChain apiFilter(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())                // Stateless: usamos JWT
      .authorizeHttpRequests(auth -> auth
          .requestMatchers("/public/**").permitAll()
          .anyRequest().authenticated()
      )
      .oauth2ResourceServer(oauth2 -> oauth2
          .jwt(jwt -> jwt
              .jwtAuthenticationConverter(jwtAuthConverter()) // mapea roles
          )
      );
    return http.build();
  }

  @Bean
  JwtAuthenticationConverter jwtAuthConverter() {
    var converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(jwt -> {
        // Supabase suele incluir los roles en "role" o "roles".
        Collection<String> roles = Optional.ofNullable(jwt.getClaimAsStringList("role"))
                                          .orElseGet(() -> jwt.getClaimAsStringList("roles"));
        if (roles == null) roles = List.of();
        return roles.stream()
                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r.toUpperCase()))
                    .collect(Collectors.toSet());
    });
    return converter;
  }
}
