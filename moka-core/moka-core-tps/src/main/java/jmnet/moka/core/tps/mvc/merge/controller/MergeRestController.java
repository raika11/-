package jmnet.moka.core.tps.mvc.merge.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageDTO;
import jmnet.moka.core.tps.mvc.merge.service.MergeService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Validated
@Slf4j
@RequestMapping("/api/merge")
@Api(tags = {"TMS Merge API"})
public class MergeRestController extends AbstractCommonController {

    private final MergeService mergeService;

    public MergeRestController(MergeService mergeService) {
        this.mergeService = mergeService;
    }

    /**
     * tems 문법검사
     *
     * @param request 요청
     * @param content tems소스
     * @return 랜더링된 결과
     * @throws Exception 예외
     */
    @ApiOperation(value = "tems 문법검사")
    @PostMapping(value = "/syntax")
    public ResponseEntity<?> postSyntax(@ApiParam(hidden=true) HttpServletRequest request, @ApiParam("tems 소스") String content)
            throws Exception {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        try {
            TemplateParserHelper.checkSyntax(content);
        } catch (TemplateParseException e) {
            String message = e.getMessage();
            String extra = Integer.toString(e.getLineNumber());
            invalidList.add(new InvalidDataDTO("content", message, extra));
            String validMessage = messageByLocale.get("tps.merge.error.syntax");
            log.error("[FAILED DUE TO AN ERROR IN GRAMMAR (TemplateParseException)]", e);
            tpsLogger.fail(ActionType.SELECT, message, true);
            throw new InvalidDataException(invalidList, validMessage);
        } catch (Exception e) {
            String message = e.getMessage();
            invalidList.add(new InvalidDataDTO("content", message));
            String validMessage = messageByLocale.get("tps.merge.error.syntax", request);
            log.error("[FAILED DUE TO AN ERROR IN GRAMMAR (TemplateParseException)]", e);
            tpsLogger.fail(ActionType.SELECT, message, true);
            throw new InvalidDataException(invalidList, validMessage);
        }

        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 페이지 미리보기
     *
     * @param request 요청
     * @param pageDto 페이지정보
     * @return 페이지 랜더링된 HTML소스
     * @throws Exception 예외
     */
    @ApiOperation(value = "페이지 미리보기")
    @PostMapping(value = "/previewPG", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postPreviewPG(@ApiParam(hidden=true) HttpServletRequest request, @ApiParam("페이지 정보(필수)") @RequestBody @Valid PageDTO pageDto)
            throws Exception {
        try {
            String html = mergeService.getMergePage(pageDto);
            ResultDTO<String> resultDto = new ResultDTO<String>(HttpStatus.OK, html);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] pageSeq: {} {}", pageDto.getPageSeq(), e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.page", request), e);
        }
    }

    /**
     * 컴포넌트 미리보기(스냅샷 생성)
     *
     * @param request          요청
     * @param areaSeq          편집영역seq
     * @param componentWorkSeq 작업중인 컴포넌트SEQ
     * @param principal        작업자
     * @param resourceYn       미리보기 리소스 포함여부
     * @return 컴포넌트 랜더링된 HTML소스
     * @throws Exception 예외
     */
    @ApiOperation(value = "컴포넌트 미리보기")
    @GetMapping(value = "/previewCP")
    public ResponseEntity<?> getPreviewCP(
            @ApiParam(hidden=true) HttpServletRequest request,
            @ApiParam("편집영역 일련번호(필수)") Long areaSeq,
            @ApiParam("컴포넌트워크 일련번호(필수)") Long componentWorkSeq,
            @ApiParam(hidden=true) Principal principal,
            @ApiParam("미리보기 리소스 포함여부(필수)") String resourceYn)
            throws Exception {
        try {
            String html = mergeService.getMergeComponentWork(areaSeq, componentWorkSeq, resourceYn, principal.getName());

            ResultDTO<String> resultDto = new ResultDTO<String>(HttpStatus.OK, html);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] componentWorkSeq: {} {}", componentWorkSeq, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.component", request), e);
        }
    }

    /**
     * 편집영역 미리보기
     *
     * @param areaSeq   편집영역seq
     * @param principal 작업자
     * @return 편집영역 랜더링된 HTML소스
     * @throws Exception 예외
     */
    @ApiOperation(value = "편집영역 미리보기")
    @GetMapping(value = "/previewArea")
    public ResponseEntity<?> getPreviewArea(
            @ApiParam(hidden=true) HttpServletRequest request,
            @ApiParam("편집영역 일련번호(필수)") Long areaSeq,
            @ApiParam(hidden=true) Principal principal)
            throws Exception {
        try {
            String html = mergeService.getMergeAreaWork(areaSeq, principal.getName());

            ResultDTO<String> resultDto = new ResultDTO<String>(HttpStatus.OK, html);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO MERGE] areaSeq: {} {}", areaSeq, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.area", request), e);
        }
    }

    /**
     * 기사페이지 미리보기
     *
     * @param request        요청
     * @param articlePageDto 기사페이지정보
     * @param totalId        기사키
     * @return 기사페이지 랜더링된 HTML소스
     * @throws Exception 예외
     */
    @ApiOperation(value = "기사페이지 미리보기")
    @PostMapping(value = "/previewAP/{totalId}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postPreviewAP(
            @ApiParam(hidden=true) HttpServletRequest request,
            @ApiParam("기사페이지 정보(필수)") @RequestBody @Valid ArticlePageDTO articlePageDto,
            @ApiParam("서비스기사키(필수)") @PathVariable("totalId") @Min(value = 0, message = "{tps.article.error.min.totalId}") Long totalId)
            throws Exception {
        try {
            String html = mergeService.getMergeArticlePage(articlePageDto, totalId);
            ResultDTO<String> resultDto = new ResultDTO<String>(HttpStatus.OK, html);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO MERGE] artPageSeq: {} {}", articlePageDto.getArtPageSeq(), e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO MERGE]", e, true);
            throw new Exception(messageByLocale.get("tps.merge.error.article-page", request), e);
        }
    }
}
