package com.yls.ylslc.data_structure;

import com.yls.ylslc.config.response.Response;
import com.yls.ylslc.mappers.Mapper;
import com.yls.ylslc.user.UserService;
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
@RequestMapping(path = "api/data-structure")
@CrossOrigin(origins = { "https://ylslc.edisonyls.com", "http://localhost:3000" })
public class DataStructureController {
    private final DataStructureService dataStructureService;
    private final Mapper<DataStructureEntity, DataStructureDto> dataStructureMapper;
    private final UserService userService;

    @GetMapping
    public Response getDataStructures() {
        List<DataStructureEntity> dataStructureEntities = dataStructureService.getDataStructures();
        List<DataStructureDto> dataStructureDtos = dataStructureEntities.stream().map(dataStructureMapper::mapTo)
                .toList();
        return Response.ok(dataStructureDtos, "Data structure retrieved successfully!");
    }

    @PostMapping
    public Response createDataStructure(@RequestBody DataStructureDto dataStructureDto) {
        DataStructureEntity dataStructureEntity = dataStructureMapper.mapFrom(dataStructureDto);
        DataStructureEntity savedDataStructureEntity = dataStructureService.createDataStructure(dataStructureEntity);
        DataStructureDto savedDataStructureDto = dataStructureMapper.mapTo(savedDataStructureEntity);
        return Response.ok(savedDataStructureDto, "Data structure saved successfully!");
    }

    @PatchMapping(path = "/{id}")
    public Response updateDataStructureByName(@PathVariable("id") UUID id,
            @RequestBody Map<String, String> updateRequest) {
        String name = updateRequest.get("name");
        if (!dataStructureService.isExist(id)) {
            return Response.failed(HttpStatus.NOT_FOUND, "Data structure not found!");
        }
        DataStructureEntity updatedDataStructure = dataStructureService.updateName(id, name);
        DataStructureDto updatedDataStructureDto = dataStructureMapper.mapTo(updatedDataStructure);
        return Response.ok(updatedDataStructureDto, "Name for the data structure is updated successfully!");
    }

    @DeleteMapping(path = "/{id}")
    public Response deleteDataStructure(@PathVariable("id") UUID id) {
        DataStructureEntity dataStructureEntity = dataStructureService.delete(id);
        DataStructureDto deletedDataStructure = dataStructureMapper.mapTo(dataStructureEntity);
        return Response.ok(deletedDataStructure, deletedDataStructure.getName() + " deleted!");
    }

    @GetMapping(path = "/count-data-structure/{id}")
    public Response countDataStructure(@PathVariable("id") UUID id) {
        return Response.ok(dataStructureService.countDataStructure(id), "Count retrieved successfully!");
    }

    @PostMapping(path = "/{id}/node")
    public Response addNode(@PathVariable("id") UUID dataStructureId,
            @RequestParam(required = false) String parentNodeId,
            @RequestBody DataStructureNode node) {
        DataStructureEntity updated = dataStructureService.addNode(dataStructureId, parentNodeId, node);
        DataStructureDto updatedDto = dataStructureMapper.mapTo(updated);
        return Response.ok(updatedDto, "Node added successfully!");
    }

    @PutMapping(path = "/{id}/node/{nodeId}")
    public Response updateNode(@PathVariable("id") UUID dataStructureId,
            @PathVariable("nodeId") String nodeId,
            @RequestBody Map<String, String> updateRequest) {
        String name = updateRequest.get("name");
        String content = updateRequest.get("content");
        DataStructureEntity updated = dataStructureService.updateNode(dataStructureId, nodeId, name, content);
        DataStructureDto updatedDto = dataStructureMapper.mapTo(updated);
        return Response.ok(updatedDto, "Node updated successfully!");
    }

    @DeleteMapping(path = "/{id}/node/{nodeId}")
    public Response deleteNode(@PathVariable("id") UUID dataStructureId,
            @PathVariable("nodeId") String nodeId) {
        DataStructureEntity updated = dataStructureService.deleteNode(dataStructureId, nodeId);
        DataStructureDto updatedDto = dataStructureMapper.mapTo(updated);
        return Response.ok(updatedDto, "Node deleted successfully!");
    }

    @GetMapping(path = "/{id}/node/{nodeId}")
    public Response getNode(@PathVariable("id") UUID dataStructureId,
            @PathVariable("nodeId") String nodeId) {
        DataStructureNode node = dataStructureService.findNode(dataStructureId, nodeId);
        return Response.ok(node, "Node retrieved successfully!");
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "/{id}/node/{nodeId}/upload-image")
    public Response uploadNodeImage(@PathVariable("id") UUID dataStructureId,
            @PathVariable("nodeId") String nodeId,
            @RequestPart("image") MultipartFile image) {
        try {
            String imageId = uploadImage(image, dataStructureId.toString(), nodeId);
            return Response.ok(imageId, "Image saved successfully!");
        } catch (Exception e) {
            return Response.failed(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image: " + e.getMessage());
        }
    }

    @GetMapping(path = "/{id}/node/{nodeId}/image/{imageId}")
    public ResponseEntity<byte[]> getNodeImage(@PathVariable("id") UUID dataStructureId,
            @PathVariable("nodeId") String nodeId,
            @PathVariable("imageId") String imageId) {
        try {
            byte[] imageData = getImage(dataStructureId.toString(), nodeId, imageId);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(getMediaTypeForImageId(imageId));
            return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping(path = "/{id}/node/{nodeId}/image/{imageId}")
    public Response deleteNodeImage(@PathVariable("id") UUID dataStructureId,
            @PathVariable("nodeId") String nodeId,
            @PathVariable("imageId") String imageId) {
        try {
            boolean deleted = deleteImage(dataStructureId.toString(), nodeId, imageId);
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
    private String uploadImage(MultipartFile image, String dataStructureId, String nodeId) throws IOException {
        String originalImageName = image.getOriginalFilename();
        String fileExtension = "";

        if (originalImageName != null && originalImageName.contains(".")) {
            fileExtension = originalImageName.substring(originalImageName.lastIndexOf("."));
        }
        String imageId = UUID.randomUUID() + fileExtension;
        String rawUsername = userService.getCurrentUser().getUsername();
        String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");
        String baseDir = System.getProperty("user.home") + "/ylslc_images/data_structure_images";
        Path uploadDir = Paths.get(baseDir, username, dataStructureId, nodeId);

        Files.createDirectories(uploadDir);
        Path filePath = uploadDir.resolve(imageId);
        image.transferTo(filePath.toFile());
        return imageId;
    }

    private byte[] getImage(String dataStructureId, String nodeId, String imageId) throws IOException {
        String rawUsername = userService.getCurrentUser().getUsername();
        String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");
        String baseDir = System.getProperty("user.home") + "/ylslc_images/data_structure_images";
        Path imagePath = Paths.get(baseDir, username, dataStructureId, nodeId, imageId);
        return Files.readAllBytes(imagePath);
    }

    private boolean deleteImage(String dataStructureId, String nodeId, String imageId) throws IOException {
        String rawUsername = userService.getCurrentUser().getUsername();
        String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");
        String baseDir = System.getProperty("user.home") + "/ylslc_images/data_structure_images";
        Path imagePath = Paths.get(baseDir, username, dataStructureId, nodeId, imageId);
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

    public DataStructureController(DataStructureService dataStructureService,
            Mapper<DataStructureEntity, DataStructureDto> dataStructureMapper,
            UserService userService) {
        this.dataStructureService = dataStructureService;
        this.dataStructureMapper = dataStructureMapper;
        this.userService = userService;
    }

}
