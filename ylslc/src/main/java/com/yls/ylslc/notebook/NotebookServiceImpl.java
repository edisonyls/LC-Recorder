package com.yls.ylslc.notebook;

import com.yls.ylslc.user.UserEntity;
import com.yls.ylslc.user.UserService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class NotebookServiceImpl implements NotebookService {

    private final NotebookRepository notebookRepository;
    private final UserService userService;
    private final NotebookTreeService treeService;

    @Override
    public NotebookEntity createNotebook(NotebookEntity notebookEntity) {
        UserEntity userEntity = userService.getCurrentUser();
        notebookEntity.setUser(userEntity);
        return notebookRepository.save(notebookEntity);
    }

    @Override
    public List<NotebookEntity> getNotebooks() {
        UserEntity currentUser = userService.getCurrentUser();

        List<NotebookEntity> notebooks = notebookRepository.findByUser(currentUser);
        notebooks.sort(Comparator.comparing(NotebookEntity::getCreatedAt,
                Comparator.nullsLast(Comparator.reverseOrder())));
        return notebooks;
    }

    @Override
    public boolean isExist(UUID id) {
        return notebookRepository.existsById(id);
    }

    @Override
    public NotebookEntity updateName(UUID id, String name) {
        NotebookEntity notebookEntity = notebookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));
        notebookEntity.setName(name);
        return notebookRepository.save(notebookEntity);
    }

    @Override
    public NotebookEntity delete(UUID id) {
        NotebookEntity notebookEntity = notebookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));
        notebookRepository.deleteById(id);
        return notebookEntity;
    }

    @Override
    public Long countNotebook(UUID userId) {
        return notebookRepository.countNotebooksByUserId(userId);
    }

    @Override
    public NotebookEntity addNode(UUID notebookId, String parentNodeId, NotebookNode node) {
        NotebookEntity notebook = notebookRepository.findById(notebookId)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));

        if (parentNodeId == null || parentNodeId.isEmpty()) {
            treeService.addRootNode(notebook, node);
        } else {
            boolean added = treeService.addChildNode(notebook, parentNodeId, node);
            if (!added) {
                throw new RuntimeException("Parent node not found");
            }
        }

        return notebookRepository.save(notebook);
    }

    @Override
    public NotebookEntity updateNode(UUID notebookId, String nodeId, String name, String content) {
        NotebookEntity notebook = notebookRepository.findById(notebookId)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));

        boolean updated = treeService.updateNode(notebook, nodeId, name, content);
        if (!updated) {
            throw new RuntimeException("Node not found");
        }

        return notebookRepository.save(notebook);
    }

    @Override
    public NotebookEntity deleteNode(UUID notebookId, String nodeId) {
        NotebookEntity notebook = notebookRepository.findById(notebookId)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));

        boolean removed = treeService.removeNodeById(notebook, nodeId);
        if (!removed) {
            throw new RuntimeException("Node not found");
        }

        return notebookRepository.save(notebook);
    }

    @Override
    public NotebookNode findNode(UUID notebookId, String nodeId) {
        NotebookEntity notebook = notebookRepository.findById(notebookId)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));

        NotebookNode node = treeService.findNodeById(notebook, nodeId);
        if (node == null) {
            throw new RuntimeException("Node not found");
        }
        return node;
    }

    public NotebookServiceImpl(NotebookRepository notebookRepository,
            UserService userService,
            NotebookTreeService treeService) {
        this.notebookRepository = notebookRepository;
        this.userService = userService;
        this.treeService = treeService;
    }
}
