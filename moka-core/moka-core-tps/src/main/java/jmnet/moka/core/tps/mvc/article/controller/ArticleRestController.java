package jmnet.moka.core.tps.mvc.article.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleHistoryDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleTitleDTO;
import jmnet.moka.core.tps.mvc.article.dto.CdnUploadResultDTO;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.entity.ArticleHistory;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleComponentVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
@Api(tags = {"등록기사 API"})
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
    @ApiOperation(value = "기사 목록조회(페이지편집용)")
    @GetMapping("/service")
    public ResponseEntity<?> getServiceArticleList(@Valid @SearchParam ArticleSearchDTO search)
            throws Exception {

        //분류코드 검색설정
        resetMasterCode(search);

        try {
            // 조회(mybatis)
            List<ArticleBasicVO> returnValue = articleService.findAllArticleBasicByService(search);

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

        articleService.findArticleInfo(dto);

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

    /**
     * 기사목록조회
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

    /**
     * 등록기사 삭제
     *
     * @param totalId 기사키
     * @return 등록기사정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "등록기사 삭제")
    @PostMapping("/{totalId}/delete")
    public ResponseEntity<?> postArticleDelete(@ApiParam("기사아이디(필수)") @PathVariable("totalId") Long totalId)
            throws Exception {

        // 기사 상세조회
        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            // 삭제는 D로 등록
            boolean insertOk = articleService.insertArticleIudWithTotalId(articleBasic, "D");

            String message = "";
            if (insertOk) {
                message = msg("tps.common.success.delete");
            } else {
                message = msg("tps.common.error.delete");
            }

            // 수신기사정보 조회
            ArticleBasicDTO dto = modelMapper.map(articleBasic, ArticleBasicDTO.class);
            articleService.findArticleInfo(dto);

            ResultDTO<ArticleBasicDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO ARTICE_IUD INSERT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO ARTICE_IUD INSERT]", e, true);
            throw new Exception(msg("tps.common.error.delete"), e);
        }
    }

    /**
     * 등록기사 중지
     *
     * @param totalId 기사키
     * @return 등록기사정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "등록기사 중지")
    @PostMapping("/{totalId}/stop")
    public ResponseEntity<?> postArticleStop(@ApiParam("기사아이디(필수)") @PathVariable("totalId") Long totalId)
            throws Exception {

        // 기사 상세조회
        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            // 삭제는 D로 등록
            boolean insertOk = articleService.insertArticleIudWithTotalId(articleBasic, "E");

            String message = "";
            if (insertOk) {
                message = msg("ttps.article.success.stop");
            } else {
                message = msg("tps.article.error.stop");
            }

            // 수신기사정보 조회
            ArticleBasicDTO dto = modelMapper.map(articleBasic, ArticleBasicDTO.class);
            articleService.findArticleInfo(dto);

            ResultDTO<ArticleBasicDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO ARTICE_IUD INSERT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO ARTICE_IUD INSERT]", e, true);
            throw new Exception(msg("tps.article.error.stop"), e);
        }
    }

    /**
     * 히스토리 목록조회
     *
     * @param totalId 기사키
     * @param search  검색조건
     * @return 히스토리 목록
     * @throws NoDataException
     */
    @ApiOperation(value = "히스토리 목록조회")
    @GetMapping("/{totalId}/histories")
    ResponseEntity<?> getArticleHistoryList(@ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") Long totalId, @Valid @SearchParam SearchDTO search)
            throws NoDataException {

        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        // 조회
        Page<ArticleHistory> returnValue = articleService.findAllArticleHistory(totalId, search);
        List<ArticleHistoryDTO> dtoList = modelMapper.map(returnValue.getContent(), ArticleHistoryDTO.TYPE);

        // 리턴값 설정
        ResultListDTO<ArticleHistoryDTO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ArticleHistoryDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * CDN등록
     *
     * @param totalId 기사키
     * @return 등록된 URL
     * @throws NoDataException
     */
    @ApiOperation(value = "CDN 등록")
    @GetMapping("/{totalId}/cdn")
    ResponseEntity<?> postArticleCdn(@ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") Long totalId)
            throws Exception {

        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            CdnUploadResultDTO cdnResultDto = new CdnUploadResultDTO();

            // cdn등록
            boolean sendOk = articleService.insertCdn(totalId, cdnResultDto);
            cdnResultDto.setSuccess(sendOk);
            String message = sendOk ? msg("tps.articles.success.cdn") : msg("tps.articles.error.cdn");

            ResultDTO<CdnUploadResultDTO> resultDto = new ResultDTO<>(cdnResultDto, message);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL CDN]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL CDN]", e, true);
            throw new Exception(msg("tps.articles.error.cdn"), e);
        }
    }

    @ApiOperation("기사수정")
    @PutMapping(value = "/{totalId}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<?> putArticle(@ApiParam("서비스기사아이디(필수)") @PathVariable("totalId") Long totalId,
            @ApiParam("수정할 정보(제목,본문,기자목록,분류코드목록,태그목록)") @RequestBody @Valid ArticleBasicUpdateDTO updateDto)
            throws Exception {

        // 기사 상세조회
        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            // 수정
            boolean insertOk = articleService.insertArticleIud(articleBasic, updateDto);

            String message = "";
            if (insertOk) {
                message = msg("tps.common.success.insert");
            } else {
                message = msg("tps.common.error.insert");
            }

            // 수신기사정보 조회
            ArticleBasicDTO dto = modelMapper.map(articleBasic, ArticleBasicDTO.class);
            articleService.findArticleInfo(dto);

            ResultDTO<ArticleBasicDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO RCV_ARTICE_IUD INSERT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO RCV_ARTICE_IUD INSERT]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }
}
