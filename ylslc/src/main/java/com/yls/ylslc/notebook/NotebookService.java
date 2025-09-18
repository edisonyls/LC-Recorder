package com.yls.ylslc.notebook;

import java.util.List;
import java.util.UUID;

public interface NotebookService {
    NotebookEntity createNotebook(NotebookEntity notebookEntity);

    List<NotebookEntity> getNotebooks();

    boolean isExist(UUID id);

    NotebookEntity updateName(UUID id, String name);

    NotebookEntity delete(UUID id);

    Long countNotebook(UUID userId);

    NotebookEntity addNode(UUID notebookId, String parentNodeId, NotebookNode node);

    NotebookEntity updateNode(UUID notebookId, String nodeId, String name, String content);

    NotebookEntity deleteNode(UUID notebookId, String nodeId);

    NotebookNode findNode(UUID notebookId, String nodeId);
}
