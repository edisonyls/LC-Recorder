package com.yls.ylslc.question;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionDto {
    private UUID id;
    private Integer number;
    private String title;
    private String difficulty;
    private LocalDate dateOfCompletion;
    private Boolean success;
    private Integer attempts;
    private String timeOfCompletion;
    private List<String> solutions;
    private Boolean star;
    private String reasonOfFail;
    private LocalDateTime createdAt;
}
