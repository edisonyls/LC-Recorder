package com.yls.ylslc.question;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

// @Service and @Component is the same, but we want to specify that
// this is a service component
public interface QuestionService {
    
    Page<QuestionDto> getQuestionDtosByUser(Pageable pageable, Sort sort);

    QuestionEntity createQuestion(QuestionEntity questionEntity);

    Optional<QuestionDto> findOne(UUID id, String username);

    void delete(UUID id);

    boolean isExist(UUID id);

    QuestionDto partialUpdate(UUID id, QuestionEntity questionEntity);

    String uploadImages(MultipartFile image, String questionNumber);

    byte[] getImage(Integer questionNumber, String imageId);

    void deleteImage(Integer questionNumber, String imageId);

    QuestionDto getQuestionById(UUID id);

    QuestionDto updateStar(UUID id);
    
    Page<QuestionDto> searchQuestionDtos(String searchQuery, Pageable pageable);

    public Map<String, Object> getQuestionStats(UUID userId);
    
    Integer getQuestionNumber(UUID id);
}
