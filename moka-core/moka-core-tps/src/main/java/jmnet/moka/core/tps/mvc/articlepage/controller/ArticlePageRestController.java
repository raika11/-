/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.articlepage.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageDTO;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageSearchDTO;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePage;
import jmnet.moka.core.tps.mvc.articlepage.service.ArticlePageService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Length;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: ???????????????
 *
 * @author ohtah
 * @since 2020. 11. 14.
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/article-pages")
@Api(tags = {"??????????????? API"})
public class ArticlePageRestController extends AbstractCommonController {
    private final PurgeHelper purgeHelper;

    private final ArticlePageService articlePageService;

    private final ArticleService articleService;

    public ArticlePageRestController(MessageByLocale messageByLocale, ModelMapper modelMapper, PurgeHelper purgeHelper, TpsLogger tpsLogger,
            ArticlePageService articlePageService, ArticleService articleService) {
        this.messageByLocale = messageByLocale;
        this.modelMapper = modelMapper;
        this.purgeHelper = purgeHelper;
        this.tpsLogger = tpsLogger;
        this.articlePageService = articlePageService;
        this.articleService = articleService;
    }

    /**
     * ??????????????? ????????????
     *
     * @param search ????????????
     * @return ??????????????? ??????
     */
    @ApiOperation(value = "??????????????? ????????????")
    @GetMapping
    public ResponseEntity<?> getArticlePageList(@Valid @SearchParam ArticlePageSearchDTO search) {
        // ??????
        Page<ArticlePage> returnValue = articlePageService.findAllArticlePage(search, search.getPageable());

        // ????????? ??????
        ResultListDTO<ArticlePageDTO> resultListMessage = new ResultListDTO<>();
        List<ArticlePageDTO> dtoList = modelMapper.map(returnValue.getContent(), ArticlePageDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ArticlePageDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????????????? ????????????
     *
     * @param artPageSeq ???????????????????????? (??????)
     * @return ?????????????????????
     * @throws NoDataException      ???????????????
     * @throws InvalidDataException ????????????????????????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "??????????????? ????????????")
    @GetMapping("/{artPageSeq}")
    public ResponseEntity<?> getArticlePage(
            @ApiParam("??????????????? ????????????") @PathVariable("artPageSeq") @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}") Long artPageSeq)
            throws NoDataException, InvalidDataException, Exception {

        // ????????????????????????.
        validData(artPageSeq, null, ActionType.SELECT);

        ArticlePage articlePage = articlePageService
                .findArticlePageBySeq(artPageSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        ArticlePageDTO dto = modelMapper.map(articlePage, ArticlePageDTO.class);

        Long totalId = this.getTotalId(dto.getArtTypes());
        dto.setPreviewTotalId(totalId);

        ResultDTO<ArticlePageDTO> resultDto = new ResultDTO<>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ????????????????????? ????????? ??????
     *
     * @param artPageSeq     ??????????????? ??????. 0?????? ???????????? ????????? ??????
     * @param articlePageDTO ?????????????????????
     * @param actionType     ????????????
     * @throws InvalidDataException ???????????????
     * @throws Exception            ????????????
     */
    private void validData(Long artPageSeq, ArticlePageDTO articlePageDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<>();

        if (articlePageDTO != null) {
            // url id??? json??? id??? ???????????? ??????
            if (artPageSeq > 0 && !artPageSeq.equals(articlePageDTO.getArtPageSeq())) {
                String message = msg("tps.common.error.no-data");
                invalidList.add(new InvalidDataDTO("matchId", message));
                tpsLogger.fail(actionType, message, true);
            }

            if (actionType == ActionType.INSERT && articlePageService.existArtTypes(articlePageDTO
                    .getDomain()
                    .getDomainId(), articlePageDTO.getArtTypes(), artPageSeq)) {
                String message = msg("tps.article-page.error.duplicate.artTypes");
                invalidList.add(new InvalidDataDTO("artPageBody", message));
            }

            // ????????????
            try {
                TemplateParserHelper.checkSyntax(articlePageDTO.getArtPageBody());
            } catch (TemplateParseException e) {
                String message = e.getMessage();
                String extra = Integer.toString(e.getLineNumber());
                invalidList.add(new InvalidDataDTO("artPageBody", message, extra));
                tpsLogger.fail(actionType, message, true);
            } catch (Exception e) {
                String message = e.getMessage();
                invalidList.add(new InvalidDataDTO("artPageBody", message));
                tpsLogger.fail(actionType, message, true);
            }

            if (invalidList.size() > 0) {
                String validMessage = msg("tps.common.error.invalidContent");
                throw new InvalidDataException(invalidList, validMessage);
            }
        }
    }

    /**
     * ??????????????? ??????
     *
     * @param articlePageDTO ????????? ?????????????????????
     * @return ????????? ?????????????????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "??????????????? ??????")
    @PostMapping(headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postArticlePage(@ApiParam("??????????????? ??????") @RequestBody @Valid ArticlePageDTO articlePageDTO)
            throws InvalidDataException, Exception {

        if (McpString.isEmpty(articlePageDTO.getArtPageBody())) {
            articlePageDTO.setArtPageBody("");
        }

        // ????????????????????????.
        validData((long) 0, articlePageDTO, ActionType.INSERT);


        ArticlePage articlePage = modelMapper.map(articlePageDTO, ArticlePage.class);

        try {
            // ??????
            ArticlePage returnValue = articlePageService.insertArticlePage(articlePage);

            // ????????????
            ArticlePageDTO dto = modelMapper.map(returnValue, ArticlePageDTO.class);

            Long totalId = this.getTotalId(dto.getArtTypes());
            dto.setPreviewTotalId(totalId);



            String message = msg("tps.common.success.insert");
            ResultDTO<ArticlePageDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT ARTICLE PAGE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT ARTICLE PAGE]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }

    }

    /**
     * ??????????????? ????????? ??????
     *
     * @param artTypes ????????????
     * @return ?????????
     */
    private Long getTotalId(String artTypes) {
        String artType = TpsConstants.DEFAULT_ART_TYPE;
        if (McpString.isNotEmpty(artTypes)) {
            String[] artTypeList = artTypes.split(",");
            artType = artTypeList[0];
        }
        Long totalId = articleService.findLastestArticleBasicByArtType(artType);
        return totalId;
    }

    /**
     * ??????????????? ??????
     *
     * @param artPageSeq ???????????????
     * @return ????????? ???????????????
     * @throws InvalidDataException ????????? ???????????????
     * @throws NoDataException      ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "??????????????? ??????")
    @PutMapping(value = "/{artPageSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putPage(@ApiParam("??????????????? ????????????(??????)") @PathVariable("artPageSeq")
    @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}") Long artPageSeq,
            @ApiParam("??????????????? ??????") @RequestBody @Valid ArticlePageDTO articlePageDTO)
            throws InvalidDataException, NoDataException, Exception {

        // ????????????????????????.
        validData(artPageSeq, articlePageDTO, ActionType.UPDATE);

        // ??????
        ArticlePage newPage = modelMapper.map(articlePageDTO, ArticlePage.class);
        articlePageService
                .findArticlePageBySeq(artPageSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });

        try {
            ArticlePage returnValue = articlePageService.updateArticlePage(newPage);

            // ????????????
            ArticlePageDTO dto = modelMapper.map(returnValue, ArticlePageDTO.class);

            // purge ??????!!  ????????????????????? ???????????? ?????????.
            purge(dto);

            Long totalId = this.getTotalId(dto.getArtTypes());
            dto.setPreviewTotalId(totalId);

            String message = msg("tps.common.success.update");
            ResultDTO<ArticlePageDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE ARTICLE PAGE] seq: {} {}", artPageSeq, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE ARTICLE  PAGE]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    /**
     * ??????????????? ??????
     *
     * @param artPageSeq ?????? ??? ????????????????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ??????????????? ?????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "??????????????? ??????")
    @DeleteMapping("/{artPageSeq}")
    public ResponseEntity<?> deletePage(@ApiParam("??????????????? ????????????(??????)") @PathVariable("artPageSeq")
    @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}") Long artPageSeq)
            throws InvalidDataException, NoDataException, Exception {

        // 1.1 ???????????????
        validData(artPageSeq, null, ActionType.DELETE);

        // 1.2. ????????? ???????????? ??????
        ArticlePage page = articlePageService
                .findArticlePageBySeq(artPageSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        try {
            ArticlePageDTO dto = modelMapper.map(page, ArticlePageDTO.class);

            // 2. ??????
            articlePageService.deleteArticlePage(page);

            // purge ??????!!  ????????????????????? ???????????? ?????????.
            purge(dto);

            // 3. ????????????
            String message = msg("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE ARTICLE PAGE] seq: {} {}", artPageSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE ARTICLE PAGE]", e, true);
            throw new Exception(msg("tps.common.error.delete"), e);
        }
    }

    /**
     * ?????? ?????? ?????? ??????
     *
     * @param search domainId, artType
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ?????? ?????? ?????? ??????")
    @GetMapping("/exists-type")
    public ResponseEntity<?> existsArtType(@Valid @SearchParam ArticlePageSearchDTO search,
            @ApiParam(value = "?????? ??????????????? ????????????", required = false) @RequestParam(value = "artPageSeq", required = false) Long artPageSeq) {

        boolean duplicated = articlePageService.existArtTypes(search.getDomainId(), search.getArtTypes(), artPageSeq);
        String message = "";
        if (duplicated) {
            message = msg("tps.article-page.error.duplicate.artTypes");
        }
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated, message);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ?????? ?????? ?????? ??????
     *
     * @param artTypes ?????? ??????
     * @return ?????? ??????
     */
    @ApiOperation(value = "??????????????? ?????? ??????ID ??????")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "artTypes", value = "?????? ??????", required = true, dataType = "String", paramType = "query", defaultValue = TpsConstants.DEFAULT_ART_TYPE)})
    @GetMapping("/preview-totalid")
    public ResponseEntity<?> getPreviewTotalId(
            @RequestParam("artTypes") @Length(max = 24, message = "{tps.article-page.error.length.artTypes}") String artTypes) {

        Long totalId = this.getTotalId(artTypes);
        ResultDTO<Long> resultDTO = new ResultDTO<>(totalId);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * tms????????? ???????????????????????? ????????????. ??????????????? ???????????? ???????????????????????? ??????????????? ?????????.
     *
     * @param returnValDTO ?????????????????????
     * @return ?????????????????????
     */
    private String purge(ArticlePageDTO returnValDTO) {

        String returnValue = "";
        String retTemplate = purgeHelper.tmsPurge(Collections.singletonList(returnValDTO.toArticlePageItem()));
        if (McpString.isNotEmpty(retTemplate)) {
            log.error("[FAIL TO PURGE ARTICLE_PAGE] artPageSeq: {} {}", returnValDTO.getArtPageSeq(), retTemplate);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO PURGE ARTICLE_PAGE]", true);
            returnValue = String.join("\r\n", retTemplate);
        }

        return returnValue;
    }
}
