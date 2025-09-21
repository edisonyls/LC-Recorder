package com.yls.ylslc.notebook;

import com.yls.ylslc.config.response.Response;
import com.yls.ylslc.user.UserService;
import com.yls.ylslc.mappers.Mapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/notebook")
@CrossOrigin(origins = "*")
public class NotebookController {
    private final NotebookService notebookService;
    private final Mapper<NotebookEntity, NotebookDto> notebookMapper;
    private final UserService userService;

    @GetMapping
    public Response getNotebooks() {
        List<NotebookDto> notebookDtos = notebookService.getNotebooks();
        return Response.ok(notebookDtos, "Notebooks retrieved successfully!");
    }

    @PostMapping
    public Response createNotebook(@RequestBody NotebookDto notebookDto) {
        NotebookEntity notebookEntity = notebookMapper.mapFrom(notebookDto);
        NotebookDto savedNotebookDto = notebookService.createNotebook(notebookEntity);
        return Response.ok(savedNotebookDto, "Notebook saved successfully!");
    }

    @PatchMapping(path = "/{id}")
    public Response updateNotebookByName(@PathVariable("id") UUID id,
            @RequestBody Map<String, String> updateRequest) {
        String name = updateRequest.get("name");
        if (!notebookService.isExist(id)) {
            return Response.failed(HttpStatus.NOT_FOUND, "Notebook not found!");
        }
        NotebookDto updatedNotebookDto = notebookService.updateName(id, name);
        return Response.ok(updatedNotebookDto, "Name for the notebook is updated successfully!");
    }

    @DeleteMapping(path = "/{id}")
    public Response deleteNotebook(@PathVariable("id") UUID id) {
        NotebookDto deletedNotebook = notebookService.delete(id);
        return Response.ok(deletedNotebook, deletedNotebook.getName() + " deleted!");
    }

    @GetMapping(path = "/count-notebook/{id}")
    public Response countNotebook(@PathVariable("id") UUID id) {
        return Response.ok(notebookService.countNotebook(id), "Count retrieved successfully!");
    }

    @PostMapping(path = "/{id}/node")
    public Response addNode(@PathVariable("id") UUID notebookId,
            @RequestParam(required = false) String parentNodeId,
            @RequestBody NotebookNode node) {
        NotebookDto updatedDto = notebookService.addNode(notebookId, parentNodeId, node);
        return Response.ok(updatedDto, "Node added successfully!");
    }

    @PutMapping(path = "/{id}/node/{nodeId}")
    public Response updateNode(@PathVariable("id") UUID notebookId,
            @PathVariable("nodeId") String nodeId,
            @RequestBody Map<String, String> updateRequest) {
        String name = updateRequest.get("name");
        String content = updateRequest.get("content");
        NotebookDto updatedDto = notebookService.updateNode(notebookId, nodeId, name, content);
        return Response.ok(updatedDto, "Node updated successfully!");
    }

    @DeleteMapping(path = "/{id}/node/{nodeId}")
    public Response deleteNode(@PathVariable("id") UUID notebookId,
            @PathVariable("nodeId") String nodeId) {
        NotebookDto updatedDto = notebookService.deleteNode(notebookId, nodeId);
        return Response.ok(updatedDto, "Node deleted successfully!");
    }

    @GetMapping(path = "/{id}/node/{nodeId}")
    public Response getNode(@PathVariable("id") UUID notebookId,
            @PathVariable("nodeId") String nodeId) {
        NotebookNode node = notebookService.findNode(notebookId, nodeId);
        return Response.ok(node, "Node retrieved successfully!");
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "/{id}/node/{nodeId}/upload-image")
    public Response uploadNodeImage(@PathVariable("id") UUID notebookId,
            @PathVariable("nodeId") String nodeId,
            @RequestPart("image") MultipartFile image) {
        try {
            String imageId = uploadImage(image, notebookId.toString(), nodeId);
            return Response.ok(imageId, "Image saved successfully!");
        } catch (Exception e) {
            return Response.failed(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image: " + e.getMessage());
        }
    }

    @GetMapping(path = "/{id}/node/{nodeId}/image/{imageId}")
    public ResponseEntity<byte[]> getNodeImage(@PathVariable("id") UUID notebookId,
            @PathVariable("nodeId") String nodeId,
            @PathVariable("imageId") String imageId) {
        try {
            byte[] imageData = getImage(notebookId.toString(), nodeId, imageId);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(getMediaTypeForImageId(imageId));
            return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping(path = "/{id}/node/{nodeId}/image/{imageId}")
    public Response deleteNodeImage(@PathVariable("id") UUID notebookId,
            @PathVariable("nodeId") String nodeId,
            @PathVariable("imageId") String imageId) {
        try {
            boolean deleted = deleteImage(notebookId.toString(), nodeId, imageId);
            if (deleted) {
                return Response.ok(true, "Image deleted successfully!");
            } else {
                return Response.failed(HttpStatus.NOT_FOUND, "Image not found!");
            }
        } catch (Exception e) {
            return Response.failed(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete image: " + e.getMessage());
        }
    }

    // Helper methods for image management
    private String uploadImage(MultipartFile image, String notebookId, String nodeId) throws IOException {
        String originalImageName = image.getOriginalFilename();
        String fileExtension = "";

        if (originalImageName != null && originalImageName.contains(".")) {
            fileExtension = originalImageName.substring(originalImageName.lastIndexOf("."));
        }
        String imageId = UUID.randomUUID() + fileExtension;
        String rawUsername = userService.getCurrentUser().getUsername();
        String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");
        String baseDir = System.getProperty("user.home") + "/ylslc_images/notebook_images";
        Path uploadDir = Paths.get(baseDir, username, notebookId, nodeId);

        Files.createDirectories(uploadDir);
        Path filePath = uploadDir.resolve(imageId);
        image.transferTo(filePath.toFile());
        return imageId;
    }

    private byte[] getImage(String notebookId, String nodeId, String imageId) throws IOException {
        String rawUsername = userService.getCurrentUser().getUsername();
        String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");
        String baseDir = System.getProperty("user.home") + "/ylslc_images/notebook_images";
        Path imagePath = Paths.get(baseDir, username, notebookId, nodeId, imageId);
        return Files.readAllBytes(imagePath);
    }

    private boolean deleteImage(String notebookId, String nodeId, String imageId) throws IOException {
        String rawUsername = userService.getCurrentUser().getUsername();
        String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");
        String baseDir = System.getProperty("user.home") + "/ylslc_images/notebook_images";
        Path imagePath = Paths.get(baseDir, username, notebookId, nodeId, imageId);
        return Files.deleteIfExists(imagePath);
    }

    private MediaType getMediaTypeForImageId(String imageId) {
        if (imageId.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        } else if (imageId.endsWith(".jpg") || imageId.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        } else {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }

    public NotebookController(NotebookService notebookService,
            Mapper<NotebookEntity, NotebookDto> notebookMapper,
            UserService userService) {
        this.notebookService = notebookService;
        this.notebookMapper = notebookMapper;
        this.userService = userService;
    }

}
