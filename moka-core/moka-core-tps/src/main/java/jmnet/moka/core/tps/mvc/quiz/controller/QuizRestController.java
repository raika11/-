package jmnet.moka.core.tps.mvc.quiz.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.UUIDGenerator;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.quiz.dto.QuestionDTO;
import jmnet.moka.core.tps.mvc.quiz.dto.QuizDTO;
import jmnet.moka.core.tps.mvc.quiz.dto.QuizDetailDTO;
import jmnet.moka.core.tps.mvc.quiz.dto.QuizQuestionSimpleDTO;
import jmnet.moka.core.tps.mvc.quiz.dto.QuizRelDTO;
import jmnet.moka.core.tps.mvc.quiz.dto.QuizSearchDTO;
import jmnet.moka.core.tps.mvc.quiz.entity.Question;
import jmnet.moka.core.tps.mvc.quiz.entity.Quiz;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizDetail;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizQuestionSimple;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizRel;
import jmnet.moka.core.tps.mvc.quiz.service.QuestionService;
import jmnet.moka.core.tps.mvc.quiz.service.QuizService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.controller
 * ClassName : QuizRestController
 * Created : 2021-01-18 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-18 16:15
 */
@RestController
@RequestMapping("/api/quizzes")
@Slf4j
@Api(tags = {"퀴즈 API"})
public class QuizRestController extends AbstractCommonController {

    private final QuizService quizService;

    private final QuestionService questionService;

    private final FtpHelper ftpHelper;

    @Value("${quiz.image.save.filepath}")
    private String quizImageSavepath;

    @Value("${image.url}")
    private String imageDomain;

    public QuizRestController(QuizService quizService, QuestionService questionService, FtpHelper ftpHelper) {
        this.quizService = quizService;
        this.questionService = questionService;
        this.ftpHelper = ftpHelper;
    }

    /**
     * 퀴즈목록조회
     *
     * @param search 검색조건
     * @return 퀴즈목록
     */
    @ApiOperation(value = "퀴즈 목록 조회")
    @GetMapping
    public ResponseEntity<?> getQuizList(@SearchParam QuizSearchDTO search) {

        ResultListDTO<QuizDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<Quiz> returnValue = quizService.findAllQuiz(search);

        // 리턴값 설정
        List<QuizDTO> quizList = modelMapper.map(returnValue.getContent(), QuizDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(quizList);


        ResultDTO<ResultListDTO<QuizDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 퀴즈 질문 목록조회
     *
     * @param search 검색조건
     * @return 퀴즈목록
     */
    @ApiOperation(value = "퀴즈 질문 목록 조회")
    @GetMapping("/questions")
    public ResponseEntity<?> getQuizQuestionList(@SearchParam SearchDTO search) {

        ResultListDTO<QuizQuestionSimpleDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<QuizQuestionSimple> returnValue = quizService.findAllQuizQuestion(search);

        // 리턴값 설정
        List<QuizQuestionSimpleDTO> quizList = modelMapper.map(returnValue.getContent(), QuizQuestionSimpleDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(quizList);


        ResultDTO<ResultListDTO<QuizQuestionSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 질문 상세 조회
     *
     * @param questionSeq 질문 일련번호
     * @return 질문 상세
     */
    @ApiOperation(value = "질문 상세 조회")
    @GetMapping("/questions/questionSeq}")
    public ResponseEntity<?> getQuestion(
            @ApiParam("질문일련번호") @PathVariable("questionSeq") @Min(value = 1, message = "{tps.quiz-question.error.questionSeq}") Long questionSeq)
            throws Exception {

        ResultListDTO<QuestionDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Question returnValue = questionService
                .findQuestionBySeq(questionSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        // 리턴값 설정
        QuestionDTO question = modelMapper.map(returnValue, QuestionDTO.class);

        ResultDTO<QuestionDTO> resultDto = new ResultDTO<>(question);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



    /**
     * 퀴즈정보 조회
     *
     * @param request 요청
     * @param quizSeq 퀴즈일련번호 (필수)
     * @return 퀴즈정보
     * @throws NoDataException 퀴즈 정보가 없음
     */
    @ApiOperation(value = "퀴즈 조회")
    @GetMapping("/{quizSeq}")
    public ResponseEntity<?> getQuiz(HttpServletRequest request,
            @ApiParam("퀴즈코드") @PathVariable("quizSeq") @Size(min = 1, message = "{tps.quiz.error.pattern.quizSeq}") Long quizSeq)
            throws NoDataException {

        String message = msg("tps.common.error.no-data", request);
        QuizDetail quiz = quizService
                .findQuizDetailBySeq(quizSeq)
                .orElseThrow(() -> new NoDataException(message));
        List<Question> questions = new ArrayList<>();

        if (quiz.getQuizQuestions() != null && quiz
                .getQuizQuestions()
                .size() > 0) {
            quiz
                    .getQuizQuestions()
                    .forEach(quizQuestion -> questions.add(quizQuestion.getQuestion()));

        }

        QuizDetailDTO dto = modelMapper.map(quiz, QuizDetailDTO.class);
        dto.setQuestions(modelMapper.map(questions, QuestionDTO.TYPE));

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<QuizDetailDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * 등록
     *
     * @param request 요청
     * @param quizDTO 등록할 퀴즈정보
     * @return 등록된 퀴즈정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "퀴즈 등록")
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postQuiz(HttpServletRequest request, @Valid QuizDetailDTO quizDTO)
            throws InvalidDataException, Exception {

        // QuizDTO -> Quiz 변환


        try {
            List<String> fileUploadMessages = saveUploadImage(quizDTO);
            QuizDetail quiz = modelMapper.map(quizDTO, QuizDetail.class);
            // 문항부터 저장하고, 퀴즈 등록 트랜잭션 처리
            List<Question> questions = modelMapper.map(quizDTO.getQuestions(), new TypeReference<List<Question>>() {
            }.getType());
            List<Question> newQuestions = questionService.insertAllQuestion(questions);

            QuizDetail returnValue = quizService.insertQuizDetail(quiz, newQuestions);

            // 결과리턴
            QuizDetailDTO dto = modelMapper.map(returnValue, QuizDetailDTO.class);
            dto.setQuestions(modelMapper.map(newQuestions, QuestionDTO.TYPE));

            StringBuilder resultMessage = new StringBuilder(msg("tps.common.success.insert"));

            if (fileUploadMessages.size() > 0) {
                resultMessage.append(McpString.toCommaDelimitedString(fileUploadMessages.toArray(new String[0])));
            }

            ResultDTO<QuizDetailDTO> resultDto = new ResultDTO<>(dto, resultMessage.toString());

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT QUIZ]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.quiz.error.save", request), e);
        }
    }

    /**
     * 관련 자료 등록
     *
     * @param quizRelDTOs 등록할 관련자료
     * @return 등록된 퀴즈정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "퀴즈 관련 자료 등록")
    @PostMapping(value = "/{quizSeq}/rels", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postQuizRels(
            @ApiParam("퀴즈코드") @PathVariable("quizSeq") @Min(value = 1, message = "{tps.quiz.error.pattern.quizSeq}") Long quizSeq,
            List<@Valid QuizRelDTO> quizRelDTOs)
            throws InvalidDataException, Exception {

        try {
            String message = msg("tps.common.error.no-data");
            quizService
                    .findQuizBySeq(quizSeq)
                    .orElseThrow(() -> new NoDataException(message));

            // 문항부터 저장하고, 퀴즈 등록 트랜잭션 처리
            List<QuizRel> quizRels = modelMapper.map(quizRelDTOs, new TypeReference<List<QuizRel>>() {
            }.getType());

            quizRels = quizService.insertQuizRels(quizSeq, quizRels);

            // 결과리턴
            List<QuizDetailDTO> dtoList = modelMapper.map(quizRels, QuizRelDTO.TYPE);

            ResultDTO<List<QuizDetailDTO>> resultDto = new ResultDTO<>(dtoList, msg("tps.quiz.success.save"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT QUIZ RELACTIONS]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.quiz.error.save"), e);
        }
    }

    /**
     * 수정
     *
     * @param quizSeq 퀴즈일련번호
     * @param quizDTO 수정할 퀴즈정보
     * @return 수정된 퀴즈정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "퀴즈 수정")
    @PutMapping(value = "/{quizSeq}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> putQuiz(
            @ApiParam("퀴즈코드") @PathVariable("quizSeq") @Min(value = 1, message = "{tps.quiz.error.pattern.quizSeq}") Long quizSeq,
            @Valid QuizDetailDTO quizDTO)
            throws Exception {

        // QuizDTO -> Quiz 변환
        String infoMessage = msg("tps.common.error.no-data");

        // 오리진 데이터 조회
        quizService
                .findQuizBySeq(quizSeq)
                .orElseThrow(() -> new NoDataException(infoMessage));

        try {
            List<String> fileUploadMessages = saveUploadImage(quizDTO);

            QuizDetail newQuiz = modelMapper.map(quizDTO, QuizDetail.class);
            newQuiz.setQuizSeq(quizSeq);

            List<Question> questions = modelMapper.map(quizDTO.getQuestions(), new TypeReference<List<Question>>() {
            }.getType());
            List<Question> newQuestions = questionService.updateAllQuestion(questions);

            // update
            QuizDetail returnValue = quizService.updateQuizDetail(newQuiz, newQuestions);

            // 결과리턴
            QuizDetailDTO dto = modelMapper.map(returnValue, QuizDetailDTO.class);
            dto.setQuestions(modelMapper.map(newQuestions, QuestionDTO.TYPE));

            StringBuilder resultMessage = new StringBuilder(msg("tps.common.success.update"));

            if (fileUploadMessages.size() > 0) {
                resultMessage.append(McpString.toCommaDelimitedString(fileUploadMessages.toArray(new String[0])));
            }

            ResultDTO<QuizDetailDTO> resultDto = new ResultDTO<>(dto, resultMessage.toString());

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);


            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE QUIZ]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.quiz.error.save"), e);
        }
    }

    /**
     * 퀴즈 관련 자료 수정
     *
     * @param quizRelDTOs 등록할 관련자료
     * @return 등록된 퀴즈정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "퀴즈 관련 자료 수정")
    @PutMapping(value = "/{quizSeq}/rels", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> putQuizRels(
            @ApiParam("퀴즈코드") @PathVariable("quizSeq") @Min(value = 1, message = "{tps.quiz.error.pattern.quizSeq}") Long quizSeq,
            List<@Valid QuizRelDTO> quizRelDTOs)
            throws InvalidDataException, Exception {

        try {
            String message = msg("tps.common.error.no-data");
            quizService
                    .findQuizBySeq(quizSeq)
                    .orElseThrow(() -> new NoDataException(message));

            // 문항부터 저장하고, 퀴즈 등록 트랜잭션 처리
            List<QuizRel> quizRels = modelMapper.map(quizRelDTOs, new TypeReference<List<QuizRel>>() {
            }.getType());

            quizRels = quizService.updateQuizRels(quizSeq, quizRels);

            // 결과리턴
            List<QuizDetailDTO> dtoList = modelMapper.map(quizRels, QuizRelDTO.TYPE);

            ResultDTO<List<QuizDetailDTO>> resultDto = new ResultDTO<>(dtoList, msg("tps.quiz.success.save"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE QUIZ RELACTIONS]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.quiz.error.save"), e);
        }
    }


    /**
     * 삭제
     *
     * @param request 요청
     * @param quizSeq 삭제 할 퀴즈일련번호 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 퀴즈 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "퀴즈 삭제")
    @DeleteMapping("/{quizSeq}")
    public ResponseEntity<?> deleteQuiz(HttpServletRequest request,
            @ApiParam("퀴즈코드") @PathVariable("quizSeq") @Size(min = 1, message = "{tps.quiz.error.pattern.quizSeq}") Long quizSeq)
            throws InvalidDataException, NoDataException, Exception {


        // 퀴즈 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data", request);
        Quiz quiz = quizService
                .findQuizBySeq(quizSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // 삭제
            quizService.deleteQuiz(quiz);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE QUIZ] quizSeq: {} {}", quizSeq, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.quiz.error.delete", request), e);
        }
    }

    /**
     * 본문에 첨부되는 이미지 업로드
     *
     * @return 등록된 게시판정보
     */
    private List<String> saveUploadImage(QuizDetailDTO quizDetail)
            throws InvalidDataException, IOException {

        List<String> uploadMessages = new ArrayList<>();
        if (quizDetail.getImgFile() != null) {
            if (!ImageUtil.isImage(quizDetail.getImgFile())) {
                throw new InvalidDataException(msg("tps.quiz.error.file-ext", quizDetail
                        .getImgFile()
                        .getOriginalFilename()));
            }

            String ext = McpFile.getExtension(quizDetail
                    .getImgFile()
                    .getOriginalFilename());
            String filename = UUIDGenerator.uuid() + "." + ext;
            String yearMonth = McpDate.dateStr(McpDate.now(), "yyyy/MM/dd");
            String saveFilePath = String.format(quizImageSavepath, yearMonth);
            String imageUrl = imageDomain;

            if (ftpHelper.upload(FtpHelper.IMAGES, filename, quizDetail
                    .getImgFile()
                    .getInputStream(), saveFilePath)) {
                imageUrl = imageUrl + saveFilePath + "/" + filename;
                quizDetail.setImgUrl(imageUrl);
            } else {
                uploadMessages.add(msg("tps.quiz.error.upload"));
            }
        }

        List<QuestionDTO> questions = quizDetail.getQuestions();
        if (questions != null && questions.size() > 0) {
            for (QuestionDTO questionDTO : questions) {
                if (questionDTO.getImgFile() != null) {
                    if (!ImageUtil.isImage(questionDTO.getImgFile())) {
                        uploadMessages.add(msg("tps.quiz.error.file-ext", questionDTO
                                .getImgFile()
                                .getOriginalFilename()));
                    }

                    String ext = McpFile.getExtension(questionDTO
                            .getImgFile()
                            .getOriginalFilename());
                    String filename = UUIDGenerator.uuid() + "." + ext;
                    String yearMonth = McpDate.dateStr(McpDate.now(), "yyyy/MM/dd");
                    String saveFilePath = String.format(quizImageSavepath, yearMonth);
                    String imageUrl = imageDomain;

                    if (ftpHelper.upload(FtpHelper.IMAGES, filename, questionDTO
                            .getImgFile()
                            .getInputStream(), saveFilePath)) {
                        imageUrl = imageUrl + saveFilePath + "/" + filename;
                        questionDTO.setImgUrl(imageUrl);
                    } else {
                        uploadMessages.add(msg("tps.quiz-question.error.upload", filename));
                    }
                }
            }
        }

        // 액션 로그에 성공 로그 출력
        tpsLogger.success(ActionType.UPLOAD);

        return uploadMessages;
    }
}
