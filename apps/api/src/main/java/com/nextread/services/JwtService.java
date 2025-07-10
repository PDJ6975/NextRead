package com.nextread.services;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private Long jwtExpiration;

    // Extraer usuario a partir del token (en nuestro caso, metemos el username en
    // el subject del token al crearlo)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Nos permite extraer una parte del token (claim), obteniendo todos los claim y
    // usando una función dependiendo del claim deseado
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Genera un token JWT para un usuario SIN claims extra (pasa el mapa vacío al
    // siguiente generateToken)
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // Permite añadir claims personalizados al token (metiéndolos directamente en el
    // mapa)
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    // Getter para obtener la expiración del token
    public long getExpirationTime() {
        return jwtExpiration;
    }

    // Método que construye el jwt con los claims
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration) {
        return Jwts
                .builder()
                .setClaims(extraClaims) // datos extra que se quiere meter en el token (si procede)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.ES256) // firma del token con clave secreta y algoritmo
                                                                    // ES256
                .compact();
    }

    // Método para validar un token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Verificar caducidad del token
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extraer el claim de caducidad del token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Método que decodifica el token y verifica la ferma con la clave secreta
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Convierte la clave secreta en un objeto Key para firmar/verificar JWTs
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
