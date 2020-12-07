package jmnet.moka.core.tps.mvc.sns.controller;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.article.vo.ArticleDetailVO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.service.ArticleSnsShareService;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.controller
 * ClassName : ArticleSnsShareController
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 11:15
 */
@Slf4j
@RestController
@RequestMapping("/api/sns")
public class ArticleSnsShareController extends AbstractCommonController {

    private final ArticleSnsShareService articleSnsShareService;

    private final ArticleService articleService;

    public ArticleSnsShareController(ArticleSnsShareService articleSnsShareService, ArticleService articleService) {
        this.articleSnsShareService = articleSnsShareService;
        this.articleService = articleService;
    }

    /**
     * SNS 공유 기사 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    @ApiOperation(value = "SNS 전송 기사 목록 조회(FB)")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "searchType", value = "검색조건<br>all:전체<br>artTitle:제목<br>totalId:기사ID", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "keyword", value = "검색어", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "page", value = "페이지수", dataType = "int", paramType = "query", defaultValue = SearchDTO.DEFAULT_PAGE + ""),
            @ApiImplicitParam(name = "size", value = "페이지당 목록수", dataType = "int", paramType = "query", defaultValue = SearchDTO.DEFAULT_SIZE + ""),
            @ApiImplicitParam(name = "useTotal", value = "페이징처리여부", dataType = "String", paramType = "query", defaultValue = MokaConstants.YES)})
    @GetMapping
    public ResponseEntity<?> getArticleSnsShareList(@SearchParam ArticleSnsShareSearchDTO search) {

        ResultListDTO<ArticleSnsShareItemVO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<ArticleSnsShareItemVO> returnValue = articleSnsShareService.findAllSendArticle(search);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(returnValue.getContent());

        ResultDTO<ResultListDTO<ArticleSnsShareItemVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * SNS 공유 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    @ApiOperation(value = "SNS 메타 목록 조회")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "searchType", value = "검색조건<br>all:전체<br>artTitle:제목<br>totalId:기사ID", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "keyword", value = "검색어", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "page", value = "페이지수", dataType = "int", paramType = "query", defaultValue = SearchDTO.DEFAULT_PAGE + ""),
            @ApiImplicitParam(name = "size", value = "페이지당 목록수", dataType = "int", paramType = "query", defaultValue = SearchDTO.DEFAULT_SIZE + ""),
            @ApiImplicitParam(name = "useTotal", value = "페이징처리여부", dataType = "String", paramType = "query", defaultValue = MokaConstants.YES)})
    @GetMapping("/send-articles")
    public ResponseEntity<?> getArticleSnsShareSendList(@SearchParam ArticleSnsShareSearchDTO search) {

        ResultListDTO<ArticleSnsShareDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<ArticleSnsShare> returnValue = articleSnsShareService.findAllArticleSnsShare(search);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(modelMapper.map(returnValue.getContent(), ArticleSnsShareDTO.TYPE));

        ResultDTO<ResultListDTO<ArticleSnsShareDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



    /**
     * SNS 공유 목록 조회
     *
     * @param totalId 기사ID
     * @param snsType sns 유형
     * @return 검색 결과
     */
    @ApiOperation(value = "SNS 상세 조회")
    @ApiImplicitParams({@ApiImplicitParam(name = "totalId", value = "기사ID", required = true, dataType = "int", paramType = "path", defaultValue =
            SearchDTO.DEFAULT_SIZE + ""), @ApiImplicitParam(name = "snsType", value = "SNS유형", dataType = "String")})
    @GetMapping("/{totalId}")
    public ResponseEntity<?> getArticleSnsShare(@PathVariable("totalId") @Min(value = 0, message = "{tps.article.error.min.totalId}") Long totalId,
            @RequestParam(value = "snsType", required = false) @Length(max = 2, message = "{tps.article-page.error.length.artType}") String snsType)
            throws NoDataException {

        // 조회
        Optional<ArticleDetailVO> articleDetailInfo = articleService.findArticleDetailById(totalId);
        Optional<ArticleSnsShare> articleSnsShareInfo = articleSnsShareService.findArticleSnsShareById(totalId, snsType);

        ArticleDetailVO articleDetailVO = articleDetailInfo.orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
        ArticleSnsShare articleSnsShare = articleSnsShareInfo.orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        ResultMapDTO resultDto = new ResultMapDTO(HttpStatus.OK);
        resultDto.addBodyAttribute("article", articleDetailVO);
        resultDto.addBodyAttribute("snsShare", articleSnsShare);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param articleSnsShareDTO 등록할 SNS정보
     * @return 등록된 SNS정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "SNS 등록")
    @PostMapping
    public ResponseEntity<?> postArticleSnsShare(@Valid ArticleSnsShareDTO articleSnsShareDTO)
            throws InvalidDataException, Exception {


        ArticleSnsShare articleSnsShare = modelMapper.map(articleSnsShareDTO, ArticleSnsShare.class);

        // 기사 정보 없을 경우 에러 처리
        articleService
                .findArticleBasicById(articleSnsShare
                        .getId()
                        .getTotalId())
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            // insert
            ArticleSnsShare returnValue = articleSnsShareService.insertArticleSnsShare(articleSnsShare);


            // 결과리턴
            ArticleSnsShareDTO dto = modelMapper.map(returnValue, ArticleSnsShareDTO.class);
            ResultDTO<ArticleSnsShareDTO> resultDto = new ResultDTO<>(dto, msg("tps.sns.success.save"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT DOMAIN]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.sns.error.save"), e);
        }
    }

    /**
     * 수정
     *
     * @param totalId            SNS아이디
     * @param articleSnsShareDTO 수정할 SNS정보
     * @return 수정된 SNS정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "SNS 수정")
    @PutMapping("/{totalId}")
    public ResponseEntity<?> putArticleSnsShare(
            @PathVariable("totalId") @Pattern(regexp = "[0-9]{4}$", message = "{tps.sns.error.pattern.totalId}") String totalId,
            @Valid ArticleSnsShareDTO articleSnsShareDTO)
            throws Exception {

        // ArticleSnsShareDTO -> ArticleSnsShare 변환
        ArticleSnsShare newArticleSnsShare = modelMapper.map(articleSnsShareDTO, ArticleSnsShare.class);

        // 기사 정보 없을 경우 에러 처리
        articleService
                .findArticleBasicById(newArticleSnsShare
                        .getId()
                        .getTotalId())
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        // 오리진 데이터 조회
        Optional<ArticleSnsShare> oldArticleSnsShare = articleSnsShareService.findArticleSnsShareById(newArticleSnsShare.getId());

        try {
            ArticleSnsShare returnValue = oldArticleSnsShare.isPresent()
                    ? articleSnsShareService.updateArticleSnsShare(newArticleSnsShare)
                    : articleSnsShareService.insertArticleSnsShare(newArticleSnsShare);

            // 결과리턴
            ArticleSnsShareDTO dto = modelMapper.map(returnValue, ArticleSnsShareDTO.class);
            ResultDTO<ArticleSnsShareDTO> resultDto = new ResultDTO<>(dto, msg("tps.sns.success.save"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE DOMAIN]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.sns.error.save"), e);
        }
    }

    /**
     * 관련아이템이 있는지 확인한다
     *
     * @param totalId SNSID
     * @return 관련아이템 존재 여부
     */
    @ApiOperation(value = "SNS 동일 정보 존재 여부 확인")
    @GetMapping("/{totalId}/exists")
    public ResponseEntity<?> exists(@PathVariable("totalId") @Min(value = 0, message = "{tps.article.error.min.totalId}") Long totalId,
            @RequestParam(value = "snsType", required = false) @Length(max = 2, message = "{tps.article-page.error.length.artType}") String snsType) {

        String message = msg("tps.common.success.exists");
        Optional<ArticleSnsShare> articleSnsShare = articleSnsShareService.findArticleSnsShareById(totalId, snsType);

        // 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<>(articleSnsShare.isPresent(), articleSnsShare.isPresent() ? message : "");
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 삭제
     *
     * @param totalId 삭제 할 SNS아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 SNS 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "SNS 삭제")
    @DeleteMapping("/{totalId}")
    public ResponseEntity<?> deleteArticleSnsShare(@PathVariable("totalId") @Min(value = 0, message = "{tps.article.error.min.totalId}") Long totalId,
            @RequestParam(value = "snsType", required = false) @Length(max = 2, message = "{tps.article-page.error.length.artType}") String snsType)
            throws InvalidDataException, NoDataException, Exception {


        // SNS 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data");
        ArticleSnsShare articleSnsShare = articleSnsShareService
                .findArticleSnsShareById(totalId, snsType)
                .orElseThrow(() -> new NoDataException(noContentMessage));



        try {
            // 삭제
            articleSnsShareService.deleteArticleSnsShare(articleSnsShare);


            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.sns.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE DOMAIN] totalId: {} {}", totalId, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.sns.error.delete"), e);
        }
    }
}
