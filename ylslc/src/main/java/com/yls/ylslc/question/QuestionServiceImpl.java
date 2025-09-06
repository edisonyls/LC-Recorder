package com.yls.ylslc.question;

import com.yls.ylslc.mappers.Mapper;
import com.yls.ylslc.user.UserEntity;
import com.yls.ylslc.user.UserService;
import jakarta.transaction.Transactional;
import org.apache.commons.io.FilenameUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;
    private final UserService userService;
    private final Mapper<QuestionEntity, QuestionDto> questionMapper;

    public QuestionServiceImpl(QuestionRepository theQuestionRepository,
            UserService theUserService,
            Mapper<QuestionEntity, QuestionDto> questionMapper) {
        this.questionRepository = theQuestionRepository;
        this.userService = theUserService;
        this.questionMapper = questionMapper;
    }

    public Page<QuestionEntity> searchQuestions(String searchQuery, Pageable pageable) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<UserEntity> currentUser = userService.findOneByUsername(username);
        return currentUser
                .map(user -> questionRepository.searchByTitleOrNumber(user, searchQuery, pageable))
                .orElse(Page.empty());
    }

    @Override
    public Page<QuestionEntity> getQuestionsByUser(Pageable pageable, Sort sort) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<UserEntity> currentUser = userService.findOneByUsername(username);
        return currentUser
                .map(user -> questionRepository.findByUser(user,
                        PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort)))
                .orElse(Page.empty());
    }

    @Override
    @Transactional
    public Page<QuestionDto> getQuestionDtosByUser(Pageable pageable, Sort sort) {
        Page<QuestionEntity> questionPage = getQuestionsByUser(pageable, sort);
        return questionPage.map(questionMapper::mapTo);
    }

    @Override
    @Transactional
    public Page<QuestionDto> searchQuestionDtos(String searchQuery, Pageable pageable) {
        Page<QuestionEntity> questionPage = searchQuestions(searchQuery, pageable);
        return questionPage.map(questionMapper::mapTo);
    }

    @Override
    public QuestionEntity createQuestion(QuestionEntity questionEntity) {
        UserEntity userEntity = userService.getCurrentUser();
        questionEntity.setUser(userEntity);
        return questionRepository.save(questionEntity);
    }

    @Override
    public Optional<QuestionEntity> findOne(UUID id, String username) {
        return questionRepository.findByIdAndUsername(id, username);
    }

    @Override
    public void delete(UUID id) {
        // delete bucket if exist
        String username = userService.getCurrentUser().getUsername();
        String sanitizedUsername = username.replaceAll("[^a-zA-Z0-9_-]", "_");
        QuestionEntity question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        Path imageFolderPath = Paths.get(
                System.getProperty("user.home"),
                "ylslc_images",
                "solution_images",
                sanitizedUsername,
                String.valueOf(question.getNumber()));
        try {
            if (Files.exists(imageFolderPath)) {
                Files.walk(imageFolderPath)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete local image files for question: " + id, e);
        }
        questionRepository.deleteById(id);
    }

    @Override
    public boolean isExist(UUID id) {
        return questionRepository.existsById(id);
    }

    @Override
    @Transactional
    public QuestionEntity partialUpdate(UUID id, QuestionEntity questionEntity) {
        return questionRepository.findById(id).map(existingQuestion -> {
            Optional.ofNullable(questionEntity.getNumber()).ifPresent(existingQuestion::setNumber);
            Optional.ofNullable(questionEntity.getTitle()).ifPresent(existingQuestion::setTitle);
            Optional.ofNullable(questionEntity.getDifficulty()).ifPresent(existingQuestion::setDifficulty);
            Optional.ofNullable(questionEntity.getDateOfCompletion()).ifPresent(existingQuestion::setDateOfCompletion);
            Optional.ofNullable(questionEntity.getSuccess()).ifPresent(existingQuestion::setSuccess);
            Optional.ofNullable(questionEntity.getAttempts()).ifPresent(existingQuestion::setAttempts);
            Optional.ofNullable(questionEntity.getTimeOfCompletion()).ifPresent(existingQuestion::setTimeOfCompletion);
            Optional.ofNullable(questionEntity.getStar()).ifPresent(existingQuestion::setStar);
            Optional.ofNullable(questionEntity.getReasonOfFail()).ifPresent(existingQuestion::setReasonOfFail);
            if (questionEntity.getSolutions() != null) {
                existingQuestion.setSolutions(new ArrayList<>(questionEntity.getSolutions()));
            }
            
            return questionRepository.save(existingQuestion);
        }).orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Override
    public String uploadImages(MultipartFile image, String questionNumber) {
        String extension = FilenameUtils.getExtension(image.getOriginalFilename());
        String uuid = UUID.randomUUID().toString();
        String filename = uuid + "." + extension;
        String rawUsername = userService.getCurrentUser().getUsername();
        String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");

        String baseDir = System.getProperty("user.home") + "/ylslc_images/solution_images";
        Path uploadDir = Paths.get(baseDir, username, questionNumber);
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
    public byte[] getImage(Integer questionNumber, String imageId) {
        try {
            String rawUsername = userService.getCurrentUser().getUsername();
            String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");
            Path imagePath = Paths.get(System.getProperty("user.home") + "/ylslc_images/solution_images", username,
                    String.valueOf(questionNumber), imageId);
            return Files.readAllBytes(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image", e);
        }
    }

    @Override
    public void deleteImage(Integer questionNumber, String imageId) {
        try {
            String rawUsername = userService.getCurrentUser().getUsername();
            String username = rawUsername.replaceAll("[^a-zA-Z0-9_-]", "_");
            Path imagePath = Paths.get(System.getProperty("user.home") + "/ylslc_images/solution_images", username,
                    String.valueOf(questionNumber), imageId);
            Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image", e);
        }
    }

    @Override
    public QuestionEntity getQuestionById(UUID id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
    }

    @Override
    public QuestionEntity updateStar(UUID id) {
        return questionRepository.findById(id).map(question -> {
            Boolean currentStar = question.getStar();
            if (currentStar == null) {
                question.setStar(true);
            } else {
                question.setStar(!currentStar);
            }
            return questionRepository.save(question);
        }).orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Override
    public Map<String, Object> getQuestionStats(UUID userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("difficultyDistribution", questionRepository.findDifficultyDistributionByUserId(userId));
        stats.put("createdAtStats", questionRepository.findCreatedAtDistributionByUserId(userId));
        stats.put("successDistribution", questionRepository.findSuccessDistributionByUserId(userId));
        stats.put("starredCount", questionRepository.countStarredQuestionsByUserId(userId));
        stats.put("questionCount", questionRepository.countQuestionsByUserId(userId));
        stats.put("averageTimeOfCompletion", questionRepository.findAverageTimeOfCompletionByDifficulty(userId));
        return stats;
    }
}
