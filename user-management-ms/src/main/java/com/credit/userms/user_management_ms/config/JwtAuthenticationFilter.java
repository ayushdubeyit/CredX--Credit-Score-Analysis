package com.credit.userms.user_management_ms.config;

import com.credit.userms.user_management_ms.service.auth.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;



    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws
                                  ServletException, IOException {

        System.out.println("=== JWT Filter Called ===");

        //request header se authorization header nikalo!!
        final String authHeader = request.getHeader("Authorization");


        System.out.println("Authorization Header: " + authHeader);
        String jwt = null;
        String userEmail = null;
       //check if header is present and start with bearer or nt
        if(authHeader != null && authHeader.startsWith("Bearer ")){

            //extract actual token
            jwt = authHeader.substring(7);

            System.out.println("✅ Email extracted: " + userEmail); // ADD THIS

            try {
                //token se email extract
                userEmail = jwtUtil.extractUsername(jwt);


            } catch (Exception e) {

                System.out.println("token extraction failed: " + e.getMessage() );
            }

        }
        if( userEmail  != null && SecurityContextHolder.getContext().getAuthentication() == null){


            System.out.println("🔍 Loading user: " + userEmail);
            //database se userdetail nikalo
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            //token validation

            if(jwtUtil.validateToken(jwt, userDetails.getUsername())) {

// if token valid ---> user ko authenticated mark kro
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails , null
                                , userDetails.getAuthorities()
                        );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)

                );
               //spring security context me set kro


                SecurityContextHolder.getContext().setAuthentication(authToken);





                }

            }

        filterChain.doFilter(request,response);

        }

    }

