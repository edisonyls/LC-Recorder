package com.yls.ylslc.data_structure;

import com.yls.ylslc.user.UserEntity;
import com.yls.ylslc.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DataStructureServiceImpl implements DataStructureService {

    private final DataStructureRepository dataStructureRepository;
    private final UserService userService;
    private final DataStructureTreeService treeService;

    @Override
    public DataStructureEntity createDataStructure(DataStructureEntity dataStructureEntity) {
        UserEntity userEntity = userService.getCurrentUser();
        dataStructureEntity.setUser(userEntity);
        return dataStructureRepository.save(dataStructureEntity);

    }

    @Override
    public List<DataStructureEntity> getDataStructures() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<UserEntity> currentUser = userService.findOneByUsername(username);
        List<DataStructureEntity> dataStructures = currentUser
                .map(dataStructureRepository::findByUser)
                .orElse(Collections.emptyList());
        dataStructures.sort(Comparator.comparing(DataStructureEntity::getCreatedAt,
                Comparator.nullsLast(Comparator.naturalOrder())));
        return dataStructures;

    }

    @Override
    public boolean isExist(UUID id) {
        return dataStructureRepository.existsById(id);
    }

    @Override
    public DataStructureEntity updateName(UUID id, String name) {
        DataStructureEntity dataStructureEntity = dataStructureRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Data structure not found!"));
        dataStructureEntity.setName(name);
        return dataStructureRepository.save(dataStructureEntity);
    }

    @Override
    @Transactional
    public DataStructureEntity delete(UUID id) {
        DataStructureEntity dataStructureEntity = dataStructureRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Data structure not found!"));
        dataStructureRepository.deleteById(id);
        return dataStructureEntity;
    }

    @Override
    public Long countDataStructure(UUID userId) {
        return dataStructureRepository.countDataStructuresByUserId(userId);
    }

    @Override
    public DataStructureEntity addNode(UUID dataStructureId, String parentNodeId, DataStructureNode node) {
        DataStructureEntity dataStructure = dataStructureRepository.findById(dataStructureId)
                .orElseThrow(() -> new IllegalStateException("Data structure not found!"));

        if (parentNodeId == null) {
            treeService.addRootNode(dataStructure, node);
        } else {
            boolean added = treeService.addChildNode(dataStructure, parentNodeId, node);
            if (!added) {
                throw new IllegalStateException("Parent node not found!");
            }
        }

        return dataStructureRepository.save(dataStructure);
    }

    @Override
    public DataStructureEntity updateNode(UUID dataStructureId, String nodeId, String name, String content) {
        DataStructureEntity dataStructure = dataStructureRepository.findById(dataStructureId)
                .orElseThrow(() -> new IllegalStateException("Data structure not found!"));

        boolean updated = treeService.updateNode(dataStructure, nodeId, name, content);
        if (!updated) {
            throw new IllegalStateException("Node not found!");
        }

        return dataStructureRepository.save(dataStructure);
    }

    @Override
    public DataStructureEntity deleteNode(UUID dataStructureId, String nodeId) {
        DataStructureEntity dataStructure = dataStructureRepository.findById(dataStructureId)
                .orElseThrow(() -> new IllegalStateException("Data structure not found!"));

        boolean removed = treeService.removeNodeById(dataStructure, nodeId);
        if (!removed) {
            throw new IllegalStateException("Node not found!");
        }

        return dataStructureRepository.save(dataStructure);
    }

    @Override
    public DataStructureNode findNode(UUID dataStructureId, String nodeId) {
        DataStructureEntity dataStructure = dataStructureRepository.findById(dataStructureId)
                .orElseThrow(() -> new IllegalStateException("Data structure not found!"));

        DataStructureNode node = treeService.findNodeById(dataStructure, nodeId);
        if (node == null) {
            throw new IllegalStateException("Node not found!");
        }

        return node;
    }

    public DataStructureServiceImpl(DataStructureRepository dataStructureRepository,
            UserService userService,
            DataStructureTreeService treeService) {
        this.dataStructureRepository = dataStructureRepository;
        this.userService = userService;
        this.treeService = treeService;
    }
}
