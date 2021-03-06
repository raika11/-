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
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleHistorySearchDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleTitleDTO;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleComponentVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleHistoryVO;
import lombok.extern.slf4j.Slf4j;
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
@Api(tags = {"???????????? API"})
public class ArticleRestController extends AbstractCommonController {

    private final ArticleService articleService;

    public ArticleRestController(ArticleService articleService) {
        this.articleService = articleService;
    }

    /**
     * ????????? ??????????????????
     *
     * @param search ????????????
     * @return ????????? ????????????
     */
    @ApiOperation(value = "?????? ????????????(??????????????????)")
    @GetMapping("/service")
    public ResponseEntity<?> getServiceArticleList(@Valid @SearchParam ArticleSearchDTO search)
            throws Exception {

        //???????????? ????????????
        resetMasterCode(search);

        try {
            // ??????(mybatis)
            List<ArticleBasicVO> returnValue = articleService.findAllArticleBasicByService(search);

            // ????????? ??????
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
                // ???????????????
                search.setMasterCode(masterCode.substring(0, 2));
            } else if (masterCode.length() > 4 && masterCode
                    .substring(4)
                    .equals("000")) {
                // ???????????????
                search.setMasterCode(masterCode.substring(0, 4));
            }
        }
    }

    /**
     * ?????? ????????????
     *
     * @param totalId ?????????
     * @return ????????????
     * @throws NoDataException
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/{totalId}")
    public ResponseEntity<?> getArticle(@ApiParam("????????????????????????(??????)") @PathVariable("totalId") Long totalId)
            throws Exception {

        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        ArticleBasicDTO dto = modelMapper.map(articleBasic, ArticleBasicDTO.class);

        try {
            articleService.findArticleInfo(dto);

            ResultDTO<ArticleBasicDTO> resultDto = new ResultDTO<>(dto);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD ARTICLE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO LOAD ARTICLE]", e, true);
            throw new Exception(msg("tps.article.error.select"), e);
        }
    }

    @ApiOperation(value = "?????? ???????????? ??????/??????")
    @PutMapping("/{totalId}/edit-title")
    public ResponseEntity<?> putEditTitle(
            @ApiParam("????????????????????????(??????)") @PathVariable("totalId") @Min(value = 0, message = "{tps.article.error.min.totalId}") Long totalId,
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
     * ?????? ??????????????????
     *
     * @param search ????????????
     * @return ??????????????? ????????????
     */
    @ApiOperation(value = "?????? ?????? ????????????")
    @GetMapping("/bulk")
    public ResponseEntity<?> getBulkArticleList(@Valid @SearchParam ArticleSearchDTO search)
            throws Exception {

        //???????????? ????????????
        resetMasterCode(search);

        try {
            // ??????(mybatis)
            List<ArticleBasicVO> returnValue = articleService.findAllArticleBasicByBulkY(search);

            // ????????? ??????
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

    @ApiOperation(value = "????????? ??????????????? ??????")
    @GetMapping("/{totalId}/components/image")
    public ResponseEntity<?> getImageComponentList(@ApiParam("????????????????????????(??????)") @PathVariable("totalId") Long totalId)
            throws Exception {

        try {
            // ??????
            List<ArticleComponentVO> returnValue = articleService.findAllImageComponent(totalId);

            // ????????? ??????
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
     * ??????????????????
     *
     * @param search ????????????
     * @return ????????? ????????????
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping
    public ResponseEntity<?> getArticleList(@Valid @SearchParam ArticleSearchDTO search)
            throws Exception {

        //???????????? ????????????
        resetMasterCode(search);

        try {
            // ??????(mybatis)
            List<ArticleBasicVO> returnValue = articleService.findAllArticleBasic(search);

            // ????????? ??????
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
     * ???????????? ??????
     *
     * @param totalId ?????????
     * @return ??????????????????
     * @throws Exception ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @PostMapping("/{totalId}/delete")
    public ResponseEntity<?> postArticleDelete(@ApiParam("???????????????(??????)") @PathVariable("totalId") Long totalId)
            throws Exception {

        // ?????? ????????????
        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            // ????????? D??? ??????
            boolean insertOk = articleService.insertArticleIudWithTotalId(articleBasic, "D");

            String message = "";
            if (insertOk) {
                message = msg("tps.common.success.delete");
            } else {
                message = msg("tps.common.error.delete");
            }

            // ?????????????????? ??????
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
     * ???????????? ??????
     *
     * @param totalId ?????????
     * @return ??????????????????
     * @throws Exception ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @PostMapping("/{totalId}/stop")
    public ResponseEntity<?> postArticleStop(@ApiParam("???????????????(??????)") @PathVariable("totalId") Long totalId)
            throws Exception {

        // ?????? ????????????
        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            // ????????? E??? ??????
            boolean insertOk = articleService.insertArticleIudWithTotalId(articleBasic, "E");

            String message = "";
            if (insertOk) {
                message = msg("tps.article.success.stop");
            } else {
                message = msg("tps.article.error.stop");
            }

            // ?????????????????? ??????
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
     * ???????????? ????????????
     *
     * @param totalId ?????????
     * @param search  ????????????
     * @return ???????????? ??????
     * @throws NoDataException
     */
    @ApiOperation(value = "???????????? ????????????")
    @GetMapping("/{totalId}/histories")
    ResponseEntity<?> getArticleHistoryList(@ApiParam("????????????????????????(??????)") @PathVariable("totalId") Long totalId,
            @Valid @SearchParam ArticleHistorySearchDTO search)
            throws NoDataException {

        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        // ??????
        List<ArticleHistoryVO> returnValue = articleService.findAllArticleHistory(search);
        //        List<ArticleHistoryDTO> dtoList = modelMapper.map(returnValue.getContent(), ArticleHistoryDTO.TYPE);

        // ????????? ??????
        ResultListDTO<ArticleHistoryVO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(search.getTotal());
        resultListMessage.setList(returnValue);

        ResultDTO<ResultListDTO<ArticleHistoryVO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    //    /**
    //     * CDN??????
    //     *
    //     * @param totalId ?????????
    //     * @return ????????? URL
    //     * @throws NoDataException
    //     */
    //    @ApiOperation(value = "CDN ??????")
    //    @GetMapping("/{totalId}/cdn")
    //    ResponseEntity<?> postArticleCdn(@ApiParam("????????????????????????(??????)") @PathVariable("totalId") Long totalId)
    //            throws Exception {
    //
    //        ArticleBasic articleBasic = articleService
    //                .findArticleBasicById(totalId)
    //                .orElseThrow(() -> {
    //                    String message = msg("tps.common.error.no-data");
    //                    tpsLogger.fail(message, true);
    //                    return new NoDataException(message);
    //                });
    //
    //        try {
    //            CdnUploadResultDTO cdnResultDto = new CdnUploadResultDTO();
    //
    //            // cdn??????
    //            boolean sendOk = articleService.insertCdn(totalId, cdnResultDto);
    //            cdnResultDto.setSuccess(sendOk);
    //            String message = sendOk ? msg("tps.articles.success.cdn") : msg("tps.articles.error.cdn");
    //
    //            ResultDTO<CdnUploadResultDTO> resultDto = new ResultDTO<>(cdnResultDto, message);
    //            tpsLogger.success(ActionType.SELECT);
    //            return new ResponseEntity<>(resultDto, HttpStatus.OK);
    //        } catch (Exception e) {
    //            log.error("[FAIL CDN]", e);
    //            tpsLogger.error(ActionType.SELECT, "[FAIL CDN]", e, true);
    //            throw new Exception(msg("tps.articles.error.cdn"), e);
    //        }
    //    }

    @ApiOperation("????????????")
    @PutMapping(value = "/{totalId}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<?> putArticle(@ApiParam(value = "????????????????????????(??????)", required = true) @PathVariable("totalId") Long totalId,
            @ApiParam("????????? ??????(??????,?????????,??????,????????????,??????????????????,????????????)") @RequestBody @Valid ArticleBasicUpdateDTO updateDto)
            throws Exception {

        // ?????? ????????????
        ArticleBasic articleBasic = articleService
                .findArticleBasicById(totalId)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            // ??????
            boolean insertOk = articleService.insertArticleIud(articleBasic, updateDto);

            String message = "";
            if (insertOk) {
                message = msg("tps.common.success.insert");
            } else {
                message = msg("tps.common.error.insert");
            }

            // ???????????? ??????
            ArticleBasic articleBasicNew = articleService
                    .findArticleBasicById(totalId)
                    .orElseThrow(() -> {
                        tpsLogger.fail(msg("tps.common.error.no-data"), true);
                        return new NoDataException(msg("tps.common.error.no-data"));
                    });
            ArticleBasicDTO dto = modelMapper.map(articleBasicNew, ArticleBasicDTO.class);
            articleService.findArticleInfo(dto);

            // purge
            articleService.purge(articleBasic);

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
