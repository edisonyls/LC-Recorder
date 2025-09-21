package com.yls.ylslc.notebook;

import com.yls.ylslc.mappers.Mapper;
import com.yls.ylslc.user.UserEntity;
import com.yls.ylslc.user.UserService;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
        // Delete associated image files if they exist
        String username = userService.getCurrentUser().getUsername();
        String sanitizedUsername = username.replaceAll("[^a-zA-Z0-9_-]", "_");
        
        NotebookEntity notebookEntity = notebookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));
        
        // Delete the entire notebook image directory (which contains all node subdirectories)
        Path imageFolderPath = Paths.get(
                System.getProperty("user.home"),
                "ylslc_images",
                "notebook_images",
                sanitizedUsername,
                id.toString());
        
        try {
            if (Files.exists(imageFolderPath)) {
                Files.walk(imageFolderPath)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete local image files for notebook: " + id, e);
        }
        
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

    @Override
    public String uploadImages(MultipartFile image, String notebookId, String nodeId) {
        String extension = FilenameUtils.getExtension(image.getOriginalFilename());
        String uuid = UUID.randomUUID().toString();
        String filename = uuid + "." + extension;
        String rawUsername = userService.getCurrentUser().getUsername();
        String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");

        String baseDir = System.getProperty("user.home") + "/ylslc_images/notebook_images";
        Path uploadDir = Paths.get(baseDir, username, notebookId, nodeId);
        try {
            Files.createDirectories(uploadDir);
            Path filePath = uploadDir.resolve(filename);
            image.transferTo(filePath.toFile());
            return filename;
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to save image", e);
        }
    }

    @Override
    public byte[] getImage(String notebookId, String nodeId, String imageId) {
        try {
            String rawUsername = userService.getCurrentUser().getUsername();
            String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");
            Path imagePath = Paths.get(System.getProperty("user.home") + "/ylslc_images/notebook_images", username,
                    notebookId, nodeId, imageId);
            return Files.readAllBytes(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image", e);
        }
    }

    @Override
    public void deleteImage(String notebookId, String nodeId, String imageId) {
        try {
            String rawUsername = userService.getCurrentUser().getUsername();
            String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");
            Path imagePath = Paths.get(System.getProperty("user.home") + "/ylslc_images/notebook_images", username,
                    notebookId, nodeId, imageId);
            Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image", e);
        }
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
