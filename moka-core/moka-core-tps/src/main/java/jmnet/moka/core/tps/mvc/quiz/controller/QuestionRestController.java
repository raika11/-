package jmnet.moka.core.tps.mvc.quiz.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.quiz.dto.QuestionDTO;
import jmnet.moka.core.tps.mvc.quiz.entity.Question;
import jmnet.moka.core.tps.mvc.quiz.service.QuestionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.controller
 * ClassName : QuestionRestController
 * Created : 2021-01-18 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-18 16:15
 */
@RestController
@RequestMapping("/api/quizzes/questions")
@Slf4j
@Api(tags = {"퀴즈 API"})
public class QuestionRestController extends AbstractCommonController {

    private final QuestionService questionService;

    public QuestionRestController(QuestionService questionService) {
        this.questionService = questionService;
    }



    /**
     * 질문 목록 조회
     *
     * @param search 검색조건
     * @return 질문 목록
     */
    @ApiOperation(value = "질문 목록 조회")
    @GetMapping
    public ResponseEntity<?> getQuestionList(@SearchParam SearchDTO search) {

        ResultListDTO<QuestionDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<Question> returnValue = questionService.findAllQuestion(search);

        // 리턴값 설정
        List<QuestionDTO> questionList = modelMapper.map(returnValue.getContent(), QuestionDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(questionList);


        ResultDTO<ResultListDTO<QuestionDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



}
