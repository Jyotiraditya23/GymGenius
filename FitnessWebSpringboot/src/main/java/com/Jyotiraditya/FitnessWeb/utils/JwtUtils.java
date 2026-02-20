package com.Jyotiraditya.FitnessWeb.utils;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtils {

    // Base64 encoded secret key (should be at least 256 bits for HS256)
    private static final String SECRET_KEY = "uXq1X8R/3t5yTjF9aQ2l+zZC7eB6YvTjN0x4LkP7m9Q=";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    private final SecretKey key;

    public JwtUtils() {
        this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY));
    }

    // =====================
    // Generate Token
    // =====================
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username) // .setSubject() -> .subject() in 0.12.x
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key) // algorithm inferred from key
                .compact();
    }

    // =====================
    // Extract Claims
    // =====================
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)        // verify signature with key
                .build()
                .parseSignedClaims(token)
                .getPayload();          // claims payload
    }

    // =====================
    // Validation
    // =====================
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}
