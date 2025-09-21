package com.yls.ylslc.notebook;

import java.util.List;
import java.util.UUID;

public interface NotebookService {
    NotebookDto createNotebook(NotebookEntity notebookEntity);

    List<NotebookDto> getNotebooks();

    boolean isExist(UUID id);

    NotebookDto updateName(UUID id, String name);

    NotebookDto delete(UUID id);

    Long countNotebook(UUID userId);

    NotebookDto addNode(UUID notebookId, String parentNodeId, NotebookNode node);

    NotebookDto updateNode(UUID notebookId, String nodeId, String name, String content);

    NotebookDto deleteNode(UUID notebookId, String nodeId);

    NotebookNode findNode(UUID notebookId, String nodeId);
}
