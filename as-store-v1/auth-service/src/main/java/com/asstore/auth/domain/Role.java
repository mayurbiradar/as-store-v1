package com.asstore.auth.domain;

import lombok.Data;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "roles")
@Data
public class Role {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name; // e.g. ROLE_USER, ROLE_ADMIN
}
