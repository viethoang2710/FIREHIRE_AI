package com.example.firehire_ai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer employerId;

    @OneToOne
    @JoinColumn(name = "userId")
    private User user;

    private String companyName;
    private String website;
    private String description;
}
