/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan. 
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna. 
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus. 
 * Vestibulum commodo. Ut rhoncus gravida arcu. 
 */

package jmnet.moka.core.tps.mvc.articlepage.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageDTO;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageSearchDTO;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePage;
import jmnet.moka.core.tps.mvc.articlepage.service.ArticlePageService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.page.dto.ParentPageDTO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: 기사페이지
 *
 * @author ohtah
 * @since 2020. 11. 14.
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/article-pages")
public class ArticlePageController {
    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PurgeHelper purgeHelper;

    @Autowired
    private TpsLogger tpsLogger;

    @Autowired
    private ArticlePageService articlePageService;

    /**
     * 기사페이지 목록조회
     *
     * @param search 검색조건
     * @return 기사페이지 목록
     */
    @ApiOperation(value = "기사페이지 목록조회")
    @GetMapping
    public ResponseEntity<?> getArticlePageList(@Valid @SearchParam ArticlePageSearchDTO search) {
        // 조회
        Page<ArticlePage> returnValue = articlePageService.findAllArticlePage(search, search.getPageable());

        // 리턴값 설정
        ResultListDTO<ArticlePageDTO> resultListMessage = new ResultListDTO<ArticlePageDTO>();
        List<ArticlePageDTO> dtoList = modelMapper.map(returnValue.getContent(), ArticlePageDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ArticlePageDTO>> resultDto = new ResultDTO<ResultListDTO<ArticlePageDTO>>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 기사페이지 상세조회
     *
     * @param artPageSeq 기사페이지아이디 (필수)
     * @return 기사페이지정보
     * @throws NoDataException      데이타없음
     * @throws InvalidDataException 데이타유효성오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "기사페이지 상세조회")
    @GetMapping("/{artPageSeq}")
    public ResponseEntity<?> getArticlePage(@PathVariable("artPageSeq") @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}") Long artPageSeq)
        throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(artPageSeq, null, ActionType.SELECT);

        ArticlePage page = articlePageService.findArticlePageBySeq(artPageSeq)
            .orElseThrow(() -> {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(message, true);
                return new NoDataException(message);
            });

        ArticlePageDTO dto = modelMapper.map(page, ArticlePageDTO.class);
        ResultDTO<ArticlePageDTO> resultDto = new ResultDTO<ArticlePageDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 기사페이지정보 유효성 검사
     *
     * @param artPageSeq 기사페이지 순번. 0이면 등록일때 유효성 검사
     * @param articlePageDTO 기사페이지정보
     * @param actionType 동작유형
     * @throws InvalidDataException 유효성예외
     * @throws Exception 기타예외
     */
    private void validData(Long artPageSeq, ArticlePageDTO articlePageDTO, ActionType actionType)
        throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (articlePageDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (artPageSeq > 0 && !artPageSeq.equals(articlePageDTO.getArtPageSeq())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                invalidList.add(new InvalidDataDTO("matchId", message));
                tpsLogger.fail(actionType, message, true);
            }

            // 문법검사
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
                String validMessage = messageByLocale.get("tps.common.error.invalidContent");
                throw new InvalidDataException(invalidList, validMessage);
            }
        }
    }

    /**
     * 기사페이지 등록
     *
     * @param articlePageDTO   등록할 기사페이지정보
     * @return 등록된 기사페이지정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "기사페이지 등록")
    @PostMapping(headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postArticlePage(@RequestBody @Valid ArticlePageDTO articlePageDTO)
        throws InvalidDataException, Exception {

        if (McpString.isEmpty(articlePageDTO.getArtPageBody())) {
            articlePageDTO.setArtPageBody("");
        }

        // 데이타유효성검사.
        validData((long) 0, articlePageDTO, ActionType.INSERT);


        ArticlePage articlePage = modelMapper.map(articlePageDTO, ArticlePage.class);

        try {
            // 등록
            ArticlePage returnValue = articlePageService.insertArticlePage(articlePage);

            // 결과리턴
            ArticlePageDTO dto = modelMapper.map(returnValue, ArticlePageDTO.class);

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<ArticlePageDTO> resultDto = new ResultDTO<ArticlePageDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT ARTICLE PAGE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT ARTICLE PAGE]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.insert"), e);
        }

    }

    /**
     * 기사페이지 수정
     *
     * @param artPageSeq   페이지번호
     * @return 수정된 페이지정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "기사페이지 수정")
    @PutMapping(value = "/{artPageSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putPage(@PathVariable("artPageSeq") @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}") Long artPageSeq,
        @RequestBody @Valid ArticlePageDTO articlePageDTO)
        throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validData(artPageSeq, articlePageDTO, ActionType.UPDATE);

        // 수정
        ArticlePage newPage = modelMapper.map(articlePageDTO, ArticlePage.class);
        articlePageService.findArticlePageBySeq(artPageSeq)
            .orElseThrow(() -> {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(ActionType.UPDATE, message, true);
                return new NoDataException(message);
            });

        try {
            ArticlePage returnValue = articlePageService.updateArticlePage(newPage);

            // 페이지 퍼지. 성공실패여부는 리턴하지 않는다.
            purgeHelper.purgeTms(returnValue.getDomain()
                .getDomainId(), MokaConstants.ITEM_ARTICLE_PAGE, returnValue.getArtPageSeq());

            // 결과리턴
            ArticlePageDTO dto = modelMapper.map(returnValue, ArticlePageDTO.class);

            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<ArticlePageDTO> resultDto = new ResultDTO<ArticlePageDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE ARTICLE PAGE] seq: {} {}", artPageSeq, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE ARTICLE  PAGE]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.update"), e);
        }
    }

    /**
     * 기사페이지 삭제
     *
     * @param artPageSeq   삭제 할 기사페이지순번 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      페이지정보 없음 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "기사페이지 삭제")
    @DeleteMapping("/{artPageSeq}")
    public ResponseEntity<?> deletePage(@PathVariable("artPageSeq") @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}") Long artPageSeq
        )
        throws InvalidDataException, NoDataException, Exception {

        // 1.1 아이디체크
        validData(artPageSeq, null, ActionType.DELETE);

        // 1.2. 데이타 존재여부 검사
        ArticlePage page = articlePageService.findArticlePageBySeq(artPageSeq)
            .orElseThrow(() -> {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(ActionType.DELETE, message, true);
                return new NoDataException(message);
            });

        try {
            // 2. 삭제
            articlePageService.deleteArticlePage(page);

            // 3. 결과리턴
            String message = messageByLocale.get("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE ARTICLE PAGE] seq: {} {}", artPageSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE ARTICLE PAGE]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.delete"), e);
        }
    }
}
