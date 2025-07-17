package com.example.demo.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

public class JwtUtil {
    private static final String SECRET_KEY = "this_is_a_very_secure_secret_key_1234";

    public static String generateToken(String name){
        long expirationTime = 1000*60*60;

        return Jwts.builder().setSubject(name).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis()+expirationTime))
        .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()),SignatureAlgorithm.HS256).compact();

    }
    
}
