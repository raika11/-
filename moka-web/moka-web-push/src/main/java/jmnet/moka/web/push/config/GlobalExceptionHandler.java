/**
 * msp-tps GlobalExceptionHandler.java 2019. 11. 29. 오후 2:41:30 ssc
 */
package jmnet.moka.web.push.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.exception.FileFormatException;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.util.ResponseUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/**
 * <pre>
 *
 * 2019. 11. 29. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2019. 11. 29. 오후 2:41:30
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @Autowired
    private MessageByLocale messageByLocale;

    /**
     * <pre>
     * 처리 안된 예외 처리
     * </pre>
     *
     * @param request  요청
     * @param response 응답
     * @param ex       예외
     * @throws IOException 예외
     */
    @ExceptionHandler({Exception.class, MokaException.class})
    public Object defaultException(HttpServletRequest request, HttpServletResponse response, Exception ex)
            throws IOException {
        log.error("[defaultException] ", ex);
        if (ex.getCause() != null && ex
                .getCause()
                .getClass()
                .equals(IOException.class)) {
            return null;
        } else {
            String acceptHeader = request.getHeader(HttpHeaders.ACCEPT);
            String message = McpString.isNullOrEmpty(ex.getMessage()) ? messageByLocale.get("common.error", request) : ex.getMessage();
            return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_SERVER_ERROR, message);
        }
    }

    /**
     * <pre>
     * org.springframework.validation.BindException 에러 처리
     * </pre>
     *
     * @param request  HttpServletRequest
     * @param response HttpServletResponse
     * @param ex       org.springframework.validation.BindException
     */
    @ExceptionHandler(value = {BindException.class})
    public ResponseEntity<?> handleBindException(HttpServletRequest request, HttpServletResponse response, BindException ex) {
        log.error("[validation BindException] ", ex);

        if (ex.getFieldErrorCount() > 0) {
            String message = messageByLocale.get("common.error.invalidContent", request);
            List<InvalidDataDTO> invalidList = new ArrayList<>();
            for (FieldError err : ex.getFieldErrors()) {
                invalidList.add(new InvalidDataDTO(err.getField(), err.getDefaultMessage()));
            }

            ResultListDTO<InvalidDataDTO> resultInvalidList = new ResultListDTO<>();
            resultInvalidList.setTotalCnt(invalidList.size());
            resultInvalidList.setList(invalidList);

            return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_INVALID_DATA, message, resultInvalidList);
        } else {
            return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_INVALID_DATA, ex.getMessage());
        }
    }

    @ExceptionHandler(value = {ConstraintViolationException.class})
    public ResponseEntity<?> handleConstraintViolationException(HttpServletRequest request, HttpServletResponse response,
            ConstraintViolationException ex) {
        log.error("[validation ConstraintViolationException] ", ex);

        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        if (violations.size() > 0) {
            String message = messageByLocale.get("common.error.invalidContent", request);
            List<InvalidDataDTO> invalidList = new ArrayList<>();
            for (ConstraintViolation<?> violation : violations) {

                String messageProp = violation.getMessage();
                String argMessage = messageProp
                        .replaceAll("\\{", "")
                        .replaceAll("\\}", "");

                String argName = "id";
                String[] splitted = argMessage.split("\\.");
                if (splitted.length > 0) {
                    argName = splitted[splitted.length - 1];
                }

                invalidList.add(new InvalidDataDTO(argName, messageByLocale.get(argMessage, request)));
            }

            ResultListDTO<InvalidDataDTO> resultInvalidList = new ResultListDTO<>();
            resultInvalidList.setTotalCnt(invalidList.size());
            resultInvalidList.setList(invalidList);

            return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_INVALID_DATA, message, resultInvalidList);
        } else {
            return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_INVALID_DATA, ex.getMessage());
        }

    }

    /**
     * <pre>
     * org.springframework.web.bind.MethodArgumentNotValidException 에러 처리
     * </pre>
     *
     * @param request  HttpServletRequest
     * @param response HttpServletResponse
     * @param ex       org.springframework.web.bind.MethodArgumentNotValidException
     */
    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    public ResponseEntity<?> handleMethodArgumentNotValidException(HttpServletRequest request, HttpServletResponse response,
            MethodArgumentNotValidException ex) {
        log.error("[MethodArgumentNotValidException] ", ex);

        BindingResult bindingResult = ex.getBindingResult();
        if (bindingResult.getFieldErrorCount() > 0) {
            String message = messageByLocale.get("common.error.invalidContent", request);
            List<InvalidDataDTO> invalidList = new ArrayList<>();
            for (FieldError err : bindingResult.getFieldErrors()) {
                invalidList.add(new InvalidDataDTO(err.getField(), err.getDefaultMessage()));
            }

            ResultListDTO<InvalidDataDTO> resultInvalidList = new ResultListDTO<>();
            resultInvalidList.setTotalCnt(invalidList.size());
            resultInvalidList.setList(invalidList);

            return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_INVALID_DATA, message, resultInvalidList);
        } else {
            return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_BAD_REQUEST, ex.getMessage());
        }

    }

    /**
     * <pre>
     * org.springframework.web.method.annotation.MethodArgumentTypeMismatchException 에러 처리
     * </pre>
     *
     * @param request  HttpServletRequest
     * @param response HttpServletResponse
     * @param ex       MethodArgumentTypeMismatchException
     */
    @ExceptionHandler(value = {MethodArgumentTypeMismatchException.class})
    public ResponseEntity<?> handleMethodArgumentTypeMismatchException(HttpServletRequest request, HttpServletResponse response,
            MethodArgumentTypeMismatchException ex) {
        log.error("[MethodArgumentNotValidException] ", ex);

        String message = messageByLocale.get("common.error.invalidUrl", request);
        return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_BAD_REQUEST, message);
    }

    /**
     * <pre>
     * 데이타가 없을경우 예외 처리(ajax통신에러만 처리함)
     * </pre>
     *
     * @param request  요청
     * @param response 응답
     * @param ex       NoContentException예외
     */
    @ExceptionHandler(NoDataException.class)
    public ResponseEntity<?> noDataException(HttpServletRequest request, HttpServletResponse response, NoDataException ex) {

        log.error("[NoContentException] ", ex);
        return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_NO_DATA, ex.getMessage());
    }

    /**
     * <pre>
     * 데이타가 유효하지 않을경우 예외처리(ajax통신에러만 처리함)
     * </pre>
     *
     * @param request  요청
     * @param response 응답
     * @param ex       InValidContentException예외
     */
    @ExceptionHandler(InvalidDataException.class)
    public ResponseEntity<?> invalidDataException(HttpServletRequest request, HttpServletResponse response, InvalidDataException ex) {

        log.error("[invalidContentException] ", ex);

        List<InvalidDataDTO> invalidList = ex.getInvalidList();
        if (invalidList != null && invalidList.size() > 0) {
            ResultListDTO<InvalidDataDTO> resultInvalidList = new ResultListDTO<>();
            resultInvalidList.setTotalCnt(invalidList.size());
            resultInvalidList.setList(invalidList);

            return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_INVALID_DATA, ex.getMessage(), resultInvalidList);
        } else {
            return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_BAD_REQUEST, ex.getMessage());
        }
    }

    /**
     * <pre>
     * 파일 예외 처리(ajax통신에러만 처리함)
     * </pre>
     *
     * @param request  요청
     * @param response 응답
     * @param ex       NoContentException예외
     */
    @ExceptionHandler(IOException.class)
    public ResponseEntity<?> ioException(HttpServletRequest request, HttpServletResponse response, IOException ex) {

        log.error("[IOException] ", ex);

        String message = "입출력에 오류가 있습니다. " + ex.getMessage();
        return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_FILE_ERROR, message);
    }

    /**
     * <pre>
     * 파일 형식 오류
     * </pre>
     *
     * @param request  요청
     * @param response 응답
     * @param ex       NoContentException예외
     */
    @ExceptionHandler(FileFormatException.class)
    public ResponseEntity<?> fileFormatException(HttpServletRequest request, HttpServletResponse response, FileFormatException ex) {

        log.error("[FileFormatException] ", ex);

        String message = "파일 형식 오류입니다.";
        return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_FILE_ERROR, message);
    }

    /**
     * <pre>
     * TMS 에러 처리 (ajax통신에러만 처리함)
     * </pre>
     *
     * @param request  요청
     * @param response 응답
     * @param ex       TemplateParseException예외
     */
    @ExceptionHandler(TemplateParseException.class)
    public ResponseEntity<?> templateParseException(HttpServletRequest request, HttpServletResponse response, TemplateParseException ex) {

        log.error("[TemplateParseException] ", ex);

        String message = messageByLocale.get("common.error.invalid.syntax", request);

        List<InvalidDataDTO> invalidList = new ArrayList<>();
        invalidList.add(new InvalidDataDTO("syntax", TemplateParseException.ErrorMessage.getMessage(ex.getErrorCode()),
                Integer.toString(ex.getLineNumber())));

        ResultListDTO<InvalidDataDTO> resultInvalidList = new ResultListDTO<>();
        resultInvalidList.setTotalCnt(invalidList.size());
        resultInvalidList.setList(invalidList);

        return ResponseUtil.getErrorResponseEntity(response, MokaConstants.HEADER_INVALID_DATA, message, resultInvalidList);

    }

}
