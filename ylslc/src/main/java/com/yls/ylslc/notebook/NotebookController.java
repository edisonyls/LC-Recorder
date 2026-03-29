package com.yls.ylslc.notebook;

import com.yls.ylslc.config.response.Response;
import com.yls.ylslc.mappers.Mapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/notebook")
@CrossOrigin(origins = "*")
public class NotebookController {
    private final NotebookService notebookService;
    private final Mapper<NotebookEntity, NotebookDto> notebookMapper;

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
        if (!notebookService.isExist(id)) {
            return Response.failed(HttpStatus.NOT_FOUND, "Notebook not found!");
        }
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
            String imageId = notebookService.uploadImages(image, notebookId.toString(), nodeId);
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
            byte[] imageData = notebookService.getImage(notebookId.toString(), nodeId, imageId);
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
            notebookService.deleteImage(notebookId.toString(), nodeId, imageId);
            return Response.ok(true, "Image deleted successfully!");
        } catch (Exception e) {
            return Response.failed(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete image: " + e.getMessage());
        }
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
            Mapper<NotebookEntity, NotebookDto> notebookMapper) {
        this.notebookService = notebookService;
        this.notebookMapper = notebookMapper;
    }

}
