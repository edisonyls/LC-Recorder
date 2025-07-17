package com.yls.ylslc.data_structure;

import com.yls.ylslc.config.response.Response;
import com.yls.ylslc.mappers.Mapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/data-structure")
@CrossOrigin(origins = { "https://ylslc.edisonyls.com", "http://localhost:3000" })
public class DataStructureController {
    private final DataStructureService dataStructureService;
    private final Mapper<DataStructureEntity, DataStructureDto> dataStructureMapper;

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

    public DataStructureController(DataStructureService dataStructureService,
            Mapper<DataStructureEntity, DataStructureDto> dataStructureMapper) {
        this.dataStructureService = dataStructureService;
        this.dataStructureMapper = dataStructureMapper;
    }

}
