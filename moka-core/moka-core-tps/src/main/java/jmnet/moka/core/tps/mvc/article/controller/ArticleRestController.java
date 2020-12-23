package jmnet.moka.core.tps.mvc.article.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleTitleDTO;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleComponentVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Article Rest Controller
 *
 * @author jeon0525
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/articles")
@Api(tags = {"기사 API"})
public class ArticleRestController extends AbstractCommonController {

    private final ArticleService articleService;

    public ArticleRestController(ArticleService articleService) {
        this.articleService = articleService;
    }

    /**
     * 서비스 기사목록조회
     *
     * @param search 검색조건
     * @return 서비스 기사목록
     */
    @ApiOperation(value = "기사 목록조회")
    @GetMapping
    public ResponseEntity<?> getArticleList(@Valid @SearchParam ArticleSearchDTO search)
            throws Exception {

        //분류코드 검색설정
        resetMasterCode(search);

        try {
            // 조회(mybatis)
            List<ArticleBasicVO> returnValue = articleService.findAllArticleBasic(search);

            // 리턴값 설정
            ResultListDTO<ArticleBasicVO> resultListMessage = new ResultListDTO<>();
            resultListMessage.setTotalCnt(search.getTotal());
            resultListMessage.setList(returnValue);

            ResultDTO<ResultListDTO<ArticleBasicVO>> resultDto = new ResultDTO<>(resultListMessage);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD ARTICLE BASIC]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD ARTICLE BASIC]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    private void resetMasterCode(ArticleSearchDTO search) {
        if (search.getMasterCode() != null && McpString.isNotEmpty(search.getMasterCode())) {
            String masterCode = search.getMasterCode();

            if (masterCode.length() > 2 && masterCode
                    .substring(2)
                    .equals("00000")) {
                // 대분류검색
                search.setMasterCode(masterCode.substring(0, 2));
            } else if (masterCode.length() > 4 && masterCode
                    .substring(4)
                    .equals("000")) {
                // 중분류검색
                search.setMasterCode(masterCode.substring(0, 4));
            }
        }
    }

    /**
     * 기사 상세조회
     *
     * @param totalId 기사키
     * @return 기사정보
     * @throws NoDataException
     */
    @ApiOperation(value = "기사 상세조회")
    @GetMapping("/{totalId}")
    public ResponseEntity<?> getArticle(@ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") Long totalId)
            throws NoDataException {

        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        ArticleBasicDTO dto = modelMapper.map(articleBasic, ArticleBasicDTO.class);
        ResultDTO<ArticleBasicDTO> resultDto = new ResultDTO<>(dto);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "기사 편집제목 등록/수정")
    @PutMapping("/{totalId}/edit-title")
    public ResponseEntity<?> putEditTitle(
            @ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") @Min(value = 0, message = "{tps.article.error.min.totalId}") Long totalId,
            @Valid ArticleTitleDTO articleTitleDTO)
            throws Exception {
        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });
        try {
            articleService.saveArticleTitle(articleBasic, articleTitleDTO);

            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, msg("tps.article.success.edittitle.save"));
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT ARTICLE EDIT TITLE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT ARTICLE EDIT TITLE]", e, true);
            throw new Exception(msg("tps.article.error.edittitle.save"), e);
        }
    }

    /**
     * 벌크 기사목록조회
     *
     * @param search 검색조건
     * @return 네이버채널 기사목록
     */
    @ApiOperation(value = "벌크 기사 목록조회")
    @GetMapping("/bulk")
    public ResponseEntity<?> getBulkArticleList(@Valid @SearchParam ArticleSearchDTO search)
            throws Exception {

        //분류코드 검색설정
        resetMasterCode(search);

        try {
            // 조회(mybatis)
            List<ArticleBasicVO> returnValue = articleService.findAllArticleBasicByBulkY(search);

            // 리턴값 설정
            ResultListDTO<ArticleBasicVO> resultListMessage = new ResultListDTO<>();
            resultListMessage.setTotalCnt(search.getTotal());
            resultListMessage.setList(returnValue);

            ResultDTO<ResultListDTO<ArticleBasicVO>> resultDto = new ResultDTO<>(resultListMessage);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD ARTICLE BASIC]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD ARTICLE BASIC]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    @ApiOperation(value = "기사내 이미지목록 조회")
    @GetMapping("/{totalId}/components/image")
    public ResponseEntity<?> getImageComponentList(@ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") Long totalId)
            throws Exception {

        try {
            // 조회
            List<ArticleComponentVO> returnValue = articleService.findAllImageComponent(totalId);

            // 리턴값 설정
            List<ArticleComponentVO> dtoList = modelMapper.map(returnValue, ArticleComponentVO.TYPE);
            ResultListDTO<ArticleComponentVO> resultListMessage = new ResultListDTO<>();
            resultListMessage.setTotalCnt(dtoList.size());
            resultListMessage.setList(dtoList);

            ResultDTO<ResultListDTO<ArticleComponentVO>> resultDto = new ResultDTO<>(resultListMessage);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD IMAGE COMPONENT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD IMAGE COMPONENT", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

}
