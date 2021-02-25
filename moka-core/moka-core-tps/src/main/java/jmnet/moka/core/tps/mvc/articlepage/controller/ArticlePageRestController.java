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
 * Description: 기사페이지
 *
 * @author ohtah
 * @since 2020. 11. 14.
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/article-pages")
@Api(tags = {"기사페이지 API"})
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
        ResultListDTO<ArticlePageDTO> resultListMessage = new ResultListDTO<>();
        List<ArticlePageDTO> dtoList = modelMapper.map(returnValue.getContent(), ArticlePageDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ArticlePageDTO>> resultDto = new ResultDTO<>(resultListMessage);
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
    public ResponseEntity<?> getArticlePage(
            @ApiParam("기사페이지 일련번호") @PathVariable("artPageSeq") @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}") Long artPageSeq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(artPageSeq, null, ActionType.SELECT);

        ArticlePage articlePage = articlePageService
                .findArticlePageBySeq(artPageSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        ArticlePageDTO dto = modelMapper.map(articlePage, ArticlePageDTO.class);

        Long totalId = articleService.findLastestArticleBasicByArtType(dto.getArtType());
        dto.setPreviewTotalId(totalId);

        ResultDTO<ArticlePageDTO> resultDto = new ResultDTO<>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 기사페이지정보 유효성 검사
     *
     * @param artPageSeq     기사페이지 순번. 0이면 등록일때 유효성 검사
     * @param articlePageDTO 기사페이지정보
     * @param actionType     동작유형
     * @throws InvalidDataException 유효성예외
     * @throws Exception            기타예외
     */
    private void validData(Long artPageSeq, ArticlePageDTO articlePageDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<>();

        if (articlePageDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (artPageSeq > 0 && !artPageSeq.equals(articlePageDTO.getArtPageSeq())) {
                String message = msg("tps.common.error.no-data");
                invalidList.add(new InvalidDataDTO("matchId", message));
                tpsLogger.fail(actionType, message, true);
            }

            if (actionType == ActionType.INSERT && articlePageService.existArtType(articlePageDTO
                    .getDomain()
                    .getDomainId(), articlePageDTO.getArtType(), artPageSeq)) {
                String message = msg("tps.article-page.error.duplicate.artType");
                invalidList.add(new InvalidDataDTO("artPageBody", message));
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
                String validMessage = msg("tps.common.error.invalidContent");
                throw new InvalidDataException(invalidList, validMessage);
            }
        }
    }

    /**
     * 기사페이지 등록
     *
     * @param articlePageDTO 등록할 기사페이지정보
     * @return 등록된 기사페이지정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "기사페이지 등록")
    @PostMapping(headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postArticlePage(@ApiParam("기사페이지 정보") @RequestBody @Valid ArticlePageDTO articlePageDTO)
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

            Long totalId = articleService.findLastestArticleBasicByArtType(dto.getArtType());
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
     * 기사페이지 수정
     *
     * @param artPageSeq 페이지번호
     * @return 수정된 페이지정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "기사페이지 수정")
    @PutMapping(value = "/{artPageSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putPage(@ApiParam("기사페이지 일련번호(필수)") @PathVariable("artPageSeq")
    @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}") Long artPageSeq,
            @ApiParam("기사페이지 정보") @RequestBody @Valid ArticlePageDTO articlePageDTO)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validData(artPageSeq, articlePageDTO, ActionType.UPDATE);

        // 수정
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

            // 결과리턴
            ArticlePageDTO dto = modelMapper.map(returnValue, ArticlePageDTO.class);

            // purge 날림!!  성공실패여부는 리턴하지 않는다.
            purge(dto);

            Long totalId = articleService.findLastestArticleBasicByArtType(dto.getArtType());
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
     * 기사페이지 삭제
     *
     * @param artPageSeq 삭제 할 기사페이지순번 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      페이지정보 없음 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "기사페이지 삭제")
    @DeleteMapping("/{artPageSeq}")
    public ResponseEntity<?> deletePage(@ApiParam("기사페이지 일련번호(필수)") @PathVariable("artPageSeq")
    @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}") Long artPageSeq)
            throws InvalidDataException, NoDataException, Exception {

        // 1.1 아이디체크
        validData(artPageSeq, null, ActionType.DELETE);

        // 1.2. 데이타 존재여부 검사
        ArticlePage page = articlePageService
                .findArticlePageBySeq(artPageSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        try {
            ArticlePageDTO dto = modelMapper.map(page, ArticlePageDTO.class);

            // 2. 삭제
            articlePageService.deleteArticlePage(page);

            // purge 날림!!  성공실패여부는 리턴하지 않는다.
            purge(dto);

            // 3. 결과리턴
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
     * 기사 유형 중복 체크
     *
     * @param search domainId, artType
     * @return 중복 여부
     */
    @ApiOperation(value = "동일 기사 유형 존재 여부")
    @GetMapping("/exists-type")
    public ResponseEntity<?> existsArtType(@Valid @SearchParam ArticlePageSearchDTO search,
            @ApiParam(value = "제외 기사페이지 일련번호", required = false) @RequestParam(value = "artPageSeq", required = false) Long artPageSeq) {

        boolean duplicated = articlePageService.existArtType(search.getDomainId(), search.getArtType(), artPageSeq);
        String message = "";
        if (duplicated) {
            message = msg("tps.article-page.error.duplicate.artType");
        }
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated, message);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 기사 유형 중복 체크
     *
     * @param artType 기사 유형
     * @return 중복 여부
     */
    @ApiOperation(value = "미리보기용 최근 기사ID 조회")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "artType", value = "기사 유형", required = true, dataType = "String", paramType = "query", defaultValue = "B")})
    @GetMapping("/preview-totalid")
    public ResponseEntity<?> getPreviewTotalId(
            @RequestParam("artType") @Length(max = 24, message = "{tps.article-page.error.length.artType}") String artType) {

        Long totalId = articleService.findLastestArticleBasicByArtType(artType);
        ResultDTO<Long> resultDTO = new ResultDTO<>(totalId);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * tms서버의 기사페이지정보를 갱신한다. 기사타입에 해당하는 모든기사페이지를 갱신하지는 않는다.
     *
     * @param returnValDTO 기사페이지정보
     * @return 갱신오류메세지
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
