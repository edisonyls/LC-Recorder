package com.yls.ylslc.mappers;

import com.yls.ylslc.notebook.NotebookDto;
import com.yls.ylslc.notebook.NotebookEntity;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class NotebookMapperImpl implements Mapper<NotebookEntity, NotebookDto> {

    private final ModelMapper modelMapper;

    public NotebookMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public NotebookDto mapTo(NotebookEntity notebookEntity) {
        return modelMapper.map(notebookEntity, NotebookDto.class);
    }

    @Override
    public NotebookEntity mapFrom(NotebookDto notebookDto) {
        NotebookEntity notebookEntity = modelMapper.map(notebookDto, NotebookEntity.class);
        if (notebookEntity.getContentTree() == null) {
            notebookEntity.setContentTree(new ArrayList<>());
        }
        return notebookEntity;
    }
}
