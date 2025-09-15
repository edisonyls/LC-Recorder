package com.yls.ylslc.data_structure;

import java.util.List;
import java.util.UUID;

public interface DataStructureService {
    DataStructureEntity createDataStructure(DataStructureEntity dataStructureEntity);

    List<DataStructureEntity> getDataStructures();

    boolean isExist(UUID id);

    DataStructureEntity updateName(UUID id, String name);

    DataStructureEntity delete(UUID id);

    Long countDataStructure(UUID userId);

    DataStructureEntity addNode(UUID dataStructureId, String parentNodeId, DataStructureNode node);

    DataStructureEntity updateNode(UUID dataStructureId, String nodeId, String name, String content);

    DataStructureEntity deleteNode(UUID dataStructureId, String nodeId);

    DataStructureNode findNode(UUID dataStructureId, String nodeId);
}
