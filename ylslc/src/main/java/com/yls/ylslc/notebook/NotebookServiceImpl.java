package com.yls.ylslc.notebook;

import com.yls.ylslc.mappers.Mapper;
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
    private final Mapper<NotebookEntity, NotebookDto> notebookMapper;

    @Override
    public NotebookDto createNotebook(NotebookEntity notebookEntity) {
        UserEntity userEntity = userService.getCurrentUser();
        notebookEntity.setUser(userEntity);
        NotebookEntity savedEntity = notebookRepository.save(notebookEntity);
        return notebookMapper.mapTo(savedEntity);
    }

    @Override
    public List<NotebookDto> getNotebooks() {
        UserEntity currentUser = userService.getCurrentUser();

        List<NotebookEntity> notebooks = notebookRepository.findByUser(currentUser);
        notebooks.sort(Comparator.comparing(NotebookEntity::getCreatedAt,
                Comparator.nullsLast(Comparator.reverseOrder())));
        return notebooks.stream()
                .map(notebookMapper::mapTo)
                .toList();
    }

    @Override
    public boolean isExist(UUID id) {
        return notebookRepository.existsById(id);
    }

    @Override
    public NotebookDto updateName(UUID id, String name) {
        NotebookEntity notebookEntity = notebookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));
        notebookEntity.setName(name);
        NotebookEntity savedEntity = notebookRepository.save(notebookEntity);
        return notebookMapper.mapTo(savedEntity);
    }

    @Override
    public NotebookDto delete(UUID id) {
        NotebookEntity notebookEntity = notebookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));
        NotebookDto deletedDto = notebookMapper.mapTo(notebookEntity);
        notebookRepository.deleteById(id);
        return deletedDto;
    }

    @Override
    public Long countNotebook(UUID userId) {
        return notebookRepository.countNotebooksByUserId(userId);
    }

    @Override
    public NotebookDto addNode(UUID notebookId, String parentNodeId, NotebookNode node) {
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

        NotebookEntity savedEntity = notebookRepository.save(notebook);
        return notebookMapper.mapTo(savedEntity);
    }

    @Override
    public NotebookDto updateNode(UUID notebookId, String nodeId, String name, String content) {
        NotebookEntity notebook = notebookRepository.findById(notebookId)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));

        boolean updated = treeService.updateNode(notebook, nodeId, name, content);
        if (!updated) {
            throw new RuntimeException("Node not found");
        }

        NotebookEntity savedEntity = notebookRepository.save(notebook);
        return notebookMapper.mapTo(savedEntity);
    }

    @Override
    public NotebookDto deleteNode(UUID notebookId, String nodeId) {
        NotebookEntity notebook = notebookRepository.findById(notebookId)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));

        boolean removed = treeService.removeNodeById(notebook, nodeId);
        if (!removed) {
            throw new RuntimeException("Node not found");
        }

        NotebookEntity savedEntity = notebookRepository.save(notebook);
        return notebookMapper.mapTo(savedEntity);
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
            NotebookTreeService treeService,
            Mapper<NotebookEntity, NotebookDto> notebookMapper) {
        this.notebookRepository = notebookRepository;
        this.userService = userService;
        this.treeService = treeService;
        this.notebookMapper = notebookMapper;
    }
}
