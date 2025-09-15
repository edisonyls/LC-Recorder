package com.yls.ylslc.data_structure;

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
public class DataStructureDto {
    private UUID id;
    private String name;
    private List<DataStructureNode> contentTree;
    private LocalDateTime createdAt;
}
