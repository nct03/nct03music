package com.nctcompany.nct03.exception;

import com.nctcompany.nct03.dto.error.ErrorDetails;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;
import java.util.List;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(DuplicateResourceException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    @ResponseBody
    public ErrorDetails handleDuplicateResourceException(HttpServletRequest request, DuplicateResourceException ex){
        logger.error(ex.getMessage(), ex);

        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setTimestamp(new Date());
        errorDetails.setStatus(HttpStatus.CONFLICT.value());
        errorDetails.setPath(request.getServletPath());
        errorDetails.addError(ex.getMessage());

        return errorDetails;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorDetails handleResourceNotFoundException(HttpServletRequest request, ResourceNotFoundException ex){
        logger.error(ex.getMessage(), ex);

        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setTimestamp(new Date());
        errorDetails.setStatus(HttpStatus.NOT_FOUND.value());
        errorDetails.setPath(request.getServletPath());
        errorDetails.addError(ex.getMessage());

        return errorDetails;
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDetails handleBadRequestException(HttpServletRequest request, BadRequestException ex){
        logger.error(ex.getMessage(), ex);

        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setTimestamp(new Date());
        errorDetails.setStatus(HttpStatus.BAD_REQUEST.value());
        errorDetails.setPath(request.getServletPath());
        errorDetails.addError(ex.getMessage());

        return errorDetails;
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        logger.error(ex.getMessage(), ex);

        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setTimestamp(new Date());
        errorDetails.setStatus(HttpStatus.BAD_REQUEST.value());
        errorDetails.setPath(request.getContextPath());

        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        fieldErrors.forEach(fieldError -> {
            errorDetails.addError(fieldError.getDefaultMessage());
        });
        return new ResponseEntity<>(errorDetails, headers, status);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorDetails handleGenericException(HttpServletRequest request, Exception ex){
        logger.error(ex.getMessage(), ex);

        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setTimestamp(new Date());
        errorDetails.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorDetails.setPath(request.getServletPath());
        errorDetails.addError(ex.getMessage());

        return errorDetails;
    }
}
