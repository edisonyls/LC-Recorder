package com.yls.ylslc.node;

import com.yls.ylslc.config.response.Response;
import com.yls.ylslc.mappers.Mapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/node")
@CrossOrigin(origins = { "https://ylslc.edisonyls.com", "http://localhost:3000" })
public class NodeController {
    private final NodeService nodeService;
    private final Mapper<NodeEntity, NodeDto> nodeMapper;

    @PostMapping(path = "/{id}")
    public Response createNode(@PathVariable("id") UUID dataStructureId, @RequestBody NodeDto nodeDto) {
        NodeEntity nodeEntity = nodeMapper.mapFrom(nodeDto);
        NodeEntity savedNodeEntity = nodeService.createNode(dataStructureId, nodeEntity);
        NodeDto savedNodeDto = nodeMapper.mapTo(savedNodeEntity);
        return Response.ok(savedNodeDto, "Node created successfully!");
    }

    @PatchMapping(path = "/{id}")
    public Response updateNodeByName(@PathVariable("id") Long id, @RequestBody Map<String, String> updateRequest) {
        String name = updateRequest.get("name");
        if (!nodeService.isExist(id)) {
            return Response.failed(HttpStatus.NOT_FOUND, "Node not found!");
        }
        NodeEntity nodeEntity = nodeService.updateName(id, name);
        NodeDto updatedNode = nodeMapper.mapTo(nodeEntity);
        return Response.ok(updatedNode, "Node name is updated successfully");
    }

    @PatchMapping(path = "content/{id}")
    public Response updateNodeByContent(@PathVariable("id") Long id, @RequestBody Map<String, String> updateRequest) {
        String content = updateRequest.get("content");
        if (!nodeService.isExist(id)) {
            return Response.failed(HttpStatus.NOT_FOUND, "Node not found!");
        }
        NodeEntity nodeEntity = nodeService.updateContent(id, content);
        NodeDto updatedNode = nodeMapper.mapTo(nodeEntity);
        return Response.ok(updatedNode, "Node content is updated successfully!");
    }

    @DeleteMapping(path = "/{id}")
    public Response deleteNode(@PathVariable("id") Long id) {
        NodeEntity nodeEntity = nodeService.delete(id);
        NodeDto deletedNode = nodeMapper.mapTo(nodeEntity);
        return Response.ok(deletedNode, deletedNode.getName() + (" deleted successfully!"));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "upload-image")
    public Response uploadContentImages(@RequestPart("image") MultipartFile image,
            @RequestPart("nodeId") String nodeId) {
        String imageId = nodeService.uploadImages(image, nodeId);
        return Response.ok(imageId, "Image saved successfully!");
    }

    @GetMapping("image/{nodeName}/{imageId}")
    public ResponseEntity<byte[]> getContentImage(@PathVariable String nodeName, @PathVariable String imageId) {
        byte[] imageData = nodeService.getImage(nodeName, imageId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(getMediaTypeForImageId(imageId));

        return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
    }

    @DeleteMapping("image/{nodeId}/{imageId}")
    public Response deleteImage(@PathVariable String nodeId, @PathVariable String imageId) {
        Boolean deleted = nodeService.deleteImage(nodeId, imageId);
        if (deleted) {
            return Response.ok(true, "Image deleted successfully!");
        } else {
            return Response.failed(HttpStatus.BAD_REQUEST, "Image deleted unsuccessfully!");
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

    public NodeController(NodeService nodeService, Mapper<NodeEntity, NodeDto> nodeMapper) {
        this.nodeService = nodeService;
        this.nodeMapper = nodeMapper;
    }
}
