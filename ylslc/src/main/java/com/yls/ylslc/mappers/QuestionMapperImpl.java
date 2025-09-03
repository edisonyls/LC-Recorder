package com.yls.ylslc.mappers;

import com.yls.ylslc.question.QuestionDto;
import com.yls.ylslc.question.QuestionEntity;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class QuestionMapperImpl implements Mapper<QuestionEntity, QuestionDto>{

    private final ModelMapper modelMapper;

    public QuestionMapperImpl(ModelMapper modelMapper){
        this.modelMapper = modelMapper;
    }

    @Override
    public QuestionEntity mapFrom(QuestionDto questionDto) {
        QuestionEntity questionEntity = modelMapper.map(questionDto, QuestionEntity.class);
        
        if (questionDto.getSolutions() != null) {
            questionEntity.setSolutions(new ArrayList<>(questionDto.getSolutions()));
        } else {
            questionEntity.setSolutions(new ArrayList<>());
        }
        
        return questionEntity;
    }
    
    @Override
    public QuestionDto mapTo(QuestionEntity questionEntity) {
        QuestionDto questionDto = modelMapper.map(questionEntity, QuestionDto.class);
        
        if (questionEntity.getSolutions() != null) {
            questionDto.setSolutions(new ArrayList<>(questionEntity.getSolutions()));
        } else {
            questionDto.setSolutions(new ArrayList<>());
        }
        
        return questionDto;
    }
}
