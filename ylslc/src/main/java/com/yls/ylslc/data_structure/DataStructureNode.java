package com.yls.ylslc.data_structure;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataStructureNode {
    private String id;
    private String name;
    private String content;
    @Builder.Default
    private Integer orderIndex = 0;
    private LocalDateTime createdAt;
    @Builder.Default
    private List<DataStructureNode> children = new ArrayList<>();

    public DataStructureNode(String name, String content) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.children = new ArrayList<>();
    }
}
