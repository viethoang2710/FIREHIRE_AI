package com.example.firehire_ai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CVTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer templateId;

    private String name;
    private String description;
    private String previewURL;

    @ManyToOne
    @JoinColumn(name = "createdBy")
    private User createdBy;
}
