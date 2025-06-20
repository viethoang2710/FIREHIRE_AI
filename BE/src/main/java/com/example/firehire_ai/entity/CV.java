package com.example.firehire_ai.entity;

import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.entity.CVTemplate;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cvId;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "templateId", nullable = false)
    private CVTemplate template;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(columnDefinition = "LONGBLOB", nullable = false)
    private byte[] pdfData;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    // Optional: Override setters to update timestamp
    public void setTitle(String title) {
        this.title = title;
        this.updatedAt = LocalDateTime.now();
    }

    public void setPdfData(byte[] pdfData) {
        this.pdfData = pdfData;
        this.updatedAt = LocalDateTime.now();
    }

    public void setTemplate(CVTemplate template) {
        this.template = template;
        this.updatedAt = LocalDateTime.now();
    }

    public void setUser(User user) {
        this.user = user;
        this.updatedAt = LocalDateTime.now();
    }
}
