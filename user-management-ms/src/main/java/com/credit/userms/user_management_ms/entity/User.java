package com.credit.userms.user_management_ms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fullname", nullable = false)   // column name DB me FULLNAME
    private String fullName;                       // field name Java me fullName

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
}