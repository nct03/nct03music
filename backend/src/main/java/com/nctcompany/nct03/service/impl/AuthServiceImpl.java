package com.nctcompany.nct03.service.impl;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.constant.SecurityConstants;
import com.nctcompany.nct03.dto.auth.AuthRequest;
import com.nctcompany.nct03.dto.auth.AuthResponse;
import com.nctcompany.nct03.dto.auth.RegisterRequest;
import com.nctcompany.nct03.exception.DuplicateResourceException;
import com.nctcompany.nct03.model.Role;
import com.nctcompany.nct03.model.User;
import com.nctcompany.nct03.repository.RoleRepository;
import com.nctcompany.nct03.repository.UserRepository;
import com.nctcompany.nct03.security.JwtService;
import com.nctcompany.nct03.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail();
        if (userRepository.existsByEmail(email)){
            throw new DuplicateResourceException("User with email=[%s] already existed".formatted(email));
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoto(ApplicationConstants.DEFAULT_IMAGE);

        Role role = roleRepository.findByName(Role.ROLE_FREE_USER);
        user.setRole(role);
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken, SecurityConstants.JWT_TYPE);

    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        if (authentication.isAuthenticated()){
            User user = (User) authentication.getPrincipal();
            var jwtToken = jwtService.generateToken(user);
            return new AuthResponse(jwtToken, SecurityConstants.JWT_TYPE);
        }else {
            throw new UsernameNotFoundException("Email not found");
        }
    }
}
