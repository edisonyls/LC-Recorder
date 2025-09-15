package com.yls.ylslc.mappers;

import com.yls.ylslc.data_structure.DataStructureDto;
import com.yls.ylslc.data_structure.DataStructureEntity;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class DataStructureMapperImpl implements Mapper<DataStructureEntity, DataStructureDto> {

    private final ModelMapper modelMapper;

    public DataStructureMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public DataStructureDto mapTo(DataStructureEntity dataStructureEntity) {
        return modelMapper.map(dataStructureEntity, DataStructureDto.class);
    }

    @Override
    public DataStructureEntity mapFrom(DataStructureDto dataStructureDto) {
        DataStructureEntity dataStructureEntity = modelMapper.map(dataStructureDto, DataStructureEntity.class);
        if (dataStructureEntity.getContentTree() == null) {
            dataStructureEntity.setContentTree(new ArrayList<>());
        }
        return dataStructureEntity;
    }
}
