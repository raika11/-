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
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ImageUtil;
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
@Api(tags = {"?????? API"})
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
     * ??????????????????
     *
     * @param search ????????????
     * @return ????????????
     */
    @ApiOperation(value = "?????? ?????? ??????")
    @GetMapping
    public ResponseEntity<?> getQuizList(@SearchParam QuizSearchDTO search) {

        ResultListDTO<QuizDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<Quiz> returnValue = quizService.findAllQuiz(search);

        // ????????? ??????
        List<QuizDTO> quizList = modelMapper.map(returnValue.getContent(), QuizDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(quizList);


        ResultDTO<ResultListDTO<QuizDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ?????? ????????????
     *
     * @param search ????????????
     * @return ????????????
     */
    @ApiOperation(value = "?????? ?????? ?????? ??????")
    @GetMapping("/questions")
    public ResponseEntity<?> getQuizQuestionList(@SearchParam SearchDTO search) {

        ResultListDTO<QuizQuestionSimpleDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<QuizQuestionSimple> returnValue = quizService.findAllQuizQuestion(search);

        // ????????? ??????
        List<QuizQuestionSimpleDTO> quizList = modelMapper.map(returnValue.getContent(), QuizQuestionSimpleDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(quizList);


        ResultDTO<ResultListDTO<QuizQuestionSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ?????? ??????
     *
     * @param questionSeq ?????? ????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ?????? ??????")
    @GetMapping("/questions/{questionSeq}")
    public ResponseEntity<?> getQuestion(
            @ApiParam("??????????????????") @PathVariable("questionSeq") @Min(value = 1, message = "{tps.quiz-question.error.questionSeq}") Long questionSeq)
            throws Exception {

        ResultListDTO<QuestionDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        Question returnValue = questionService
                .findQuestionBySeq(questionSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        // ????????? ??????
        QuestionDTO question = modelMapper.map(returnValue, QuestionDTO.class);

        ResultDTO<QuestionDTO> resultDto = new ResultDTO<>(question);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



    /**
     * ???????????? ??????
     *
     * @param request ??????
     * @param quizSeq ?????????????????? (??????)
     * @return ????????????
     * @throws NoDataException ?????? ????????? ??????
     */
    @ApiOperation(value = "?????? ??????")
    @GetMapping("/{quizSeq}")
    public ResponseEntity<?> getQuiz(HttpServletRequest request,
            @ApiParam("????????????") @PathVariable("quizSeq") @Size(min = 1, message = "{tps.quiz.error.pattern.quizSeq}") Long quizSeq)
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
     * ??????
     *
     * @param request ??????
     * @param quizDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "?????? ??????")
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postQuiz(HttpServletRequest request, @Valid QuizDetailDTO quizDTO)
            throws InvalidDataException, Exception {

        // QuizDTO -> Quiz ??????


        try {
            List<String> fileUploadMessages = saveUploadImage(quizDTO);
            QuizDetail quiz = modelMapper.map(quizDTO, QuizDetail.class);
            // ???????????? ????????????, ?????? ?????? ???????????? ??????
            List<Question> questions = modelMapper.map(quizDTO.getQuestions(), new TypeReference<List<Question>>() {
            }.getType());
            List<Question> newQuestions = questionService.insertAllQuestion(questions);

            QuizDetail returnValue = quizService.insertQuizDetail(quiz, newQuestions);

            // ????????????
            QuizDetailDTO dto = modelMapper.map(returnValue, QuizDetailDTO.class);
            dto.setQuestions(modelMapper.map(newQuestions, QuestionDTO.TYPE));

            StringBuilder resultMessage = new StringBuilder(msg("tps.common.success.insert"));

            if (fileUploadMessages.size() > 0) {
                resultMessage.append(McpString.toCommaDelimitedString(fileUploadMessages.toArray(new String[0])));
            }

            ResultDTO<QuizDetailDTO> resultDto = new ResultDTO<>(dto, resultMessage.toString());

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT QUIZ]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.quiz.error.save", request), e);
        }
    }

    /**
     * ?????? ?????? ??????
     *
     * @param quizRelDTOs ????????? ????????????
     * @return ????????? ????????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "?????? ?????? ?????? ??????")
    @PostMapping(value = "/{quizSeq}/rels", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postQuizRels(
            @ApiParam("????????????") @PathVariable("quizSeq") @Min(value = 1, message = "{tps.quiz.error.pattern.quizSeq}") Long quizSeq,
            List<@Valid QuizRelDTO> quizRelDTOs)
            throws InvalidDataException, Exception {

        try {
            String message = msg("tps.common.error.no-data");
            quizService
                    .findQuizBySeq(quizSeq)
                    .orElseThrow(() -> new NoDataException(message));

            // ???????????? ????????????, ?????? ?????? ???????????? ??????
            List<QuizRel> quizRels = modelMapper.map(quizRelDTOs, new TypeReference<List<QuizRel>>() {
            }.getType());

            quizRels = quizService.insertQuizRels(quizSeq, quizRels);

            // ????????????
            List<QuizDetailDTO> dtoList = modelMapper.map(quizRels, QuizRelDTO.TYPE);

            ResultDTO<List<QuizDetailDTO>> resultDto = new ResultDTO<>(dtoList, msg("tps.quiz.success.save"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT QUIZ RELACTIONS]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.quiz.error.save"), e);
        }
    }

    /**
     * ??????
     *
     * @param quizSeq ??????????????????
     * @param quizDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "?????? ??????")
    @PutMapping(value = "/{quizSeq}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> putQuiz(
            @ApiParam("????????????") @PathVariable("quizSeq") @Min(value = 1, message = "{tps.quiz.error.pattern.quizSeq}") Long quizSeq,
            @Valid QuizDetailDTO quizDTO)
            throws Exception {

        // QuizDTO -> Quiz ??????
        String infoMessage = msg("tps.common.error.no-data");

        // ????????? ????????? ??????
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

            // ????????????
            QuizDetailDTO dto = modelMapper.map(returnValue, QuizDetailDTO.class);
            dto.setQuestions(modelMapper.map(newQuestions, QuestionDTO.TYPE));

            StringBuilder resultMessage = new StringBuilder(msg("tps.common.success.update"));

            if (fileUploadMessages.size() > 0) {
                resultMessage.append(McpString.toCommaDelimitedString(fileUploadMessages.toArray(new String[0])));
            }

            ResultDTO<QuizDetailDTO> resultDto = new ResultDTO<>(dto, resultMessage.toString());

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.UPDATE);


            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE QUIZ]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.quiz.error.save"), e);
        }
    }

    /**
     * ?????? ?????? ?????? ??????
     *
     * @param quizRelDTOs ????????? ????????????
     * @return ????????? ????????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "?????? ?????? ?????? ??????")
    @PutMapping(value = "/{quizSeq}/rels", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> putQuizRels(
            @ApiParam("????????????") @PathVariable("quizSeq") @Min(value = 1, message = "{tps.quiz.error.pattern.quizSeq}") Long quizSeq,
            List<@Valid QuizRelDTO> quizRelDTOs)
            throws InvalidDataException, Exception {

        try {
            String message = msg("tps.common.error.no-data");
            quizService
                    .findQuizBySeq(quizSeq)
                    .orElseThrow(() -> new NoDataException(message));

            // ???????????? ????????????, ?????? ?????? ???????????? ??????
            List<QuizRel> quizRels = modelMapper.map(quizRelDTOs, new TypeReference<List<QuizRel>>() {
            }.getType());

            quizRels = quizService.updateQuizRels(quizSeq, quizRels);

            // ????????????
            List<QuizDetailDTO> dtoList = modelMapper.map(quizRels, QuizRelDTO.TYPE);

            ResultDTO<List<QuizDetailDTO>> resultDto = new ResultDTO<>(dtoList, msg("tps.quiz.success.save"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE QUIZ RELACTIONS]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.quiz.error.save"), e);
        }
    }


    /**
     * ??????
     *
     * @param request ??????
     * @param quizSeq ?????? ??? ?????????????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? ?????? ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "?????? ??????")
    @DeleteMapping("/{quizSeq}")
    public ResponseEntity<?> deleteQuiz(HttpServletRequest request,
            @ApiParam("????????????") @PathVariable("quizSeq") @Size(min = 1, message = "{tps.quiz.error.pattern.quizSeq}") Long quizSeq)
            throws InvalidDataException, NoDataException, Exception {


        // ?????? ????????? ??????
        String noContentMessage = msg("tps.common.error.no-data", request);
        Quiz quiz = quizService
                .findQuizBySeq(quizSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // ??????
            quizService.deleteQuiz(quiz);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.DELETE);

            // ????????????
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE QUIZ] quizSeq: {} {}", quizSeq, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.quiz.error.delete", request), e);
        }
    }

    /**
     * ????????? ???????????? ????????? ?????????
     *
     * @return ????????? ???????????????
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

        // ?????? ????????? ?????? ?????? ??????
        tpsLogger.success(ActionType.UPLOAD);

        return uploadMessages;
    }
}
