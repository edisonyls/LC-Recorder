package com.yls.ylslc.question;

import com.yls.ylslc.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "question")
public class QuestionEntity {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ElementCollection
    @CollectionTable(name = "question_solutions", 
        joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "content", columnDefinition = "TEXT")
    @OrderColumn(name = "solution_order")
    private List<String> solutions = new ArrayList<>();

    private Integer number;
    private String title;
    private String difficulty;
    private LocalDate dateOfCompletion;
    private Boolean success;
    private Integer attempts;
    private String timeOfCompletion;
    private Boolean star;
    @Column(columnDefinition = "TEXT")
    private String reasonOfFail;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public void addSolution(String solutionContent) {
        solutions.add(solutionContent);
    }

    public void removeSolution(int index) {
        if (index >= 0 && index < solutions.size()) {
            solutions.remove(index);
        }
    }

    public void updateSolution(int index, String solutionContent) {
        if (index >= 0 && index < solutions.size()) {
            solutions.set(index, solutionContent);
        }
    }

    public QuestionEntity() {
        this.id = UUID.randomUUID();
    }
}
