package com.yls.ylslc.config.exception;
import com.yls.ylslc.config.response.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Response> handleHttpMessageNotReadableException(HttpMessageNotReadableException exc){
        Response error = new Response(
                HttpStatus.BAD_REQUEST.value(),
                "Invalid JSON format!",
                "The request body contains invalid JSON: " + exc.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(QuestionException.class)
    public ResponseEntity<Response> handleQuestionException(QuestionException exc){
        Response error = new Response(HttpStatus.NOT_FOUND.value(),
                "Question Exception Thrown!",
                exc.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response> handleApiNotFoundException(Exception exc){
        Response error = new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Server Error!",
                exc.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


