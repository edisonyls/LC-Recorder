package com.yls.ylslc.notebook;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotebookDto {
    private UUID id;
    private String name;
    private List<NotebookNode> contentTree;
    private LocalDateTime createdAt;
}
