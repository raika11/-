package jmnet.moka.core.tps.mvc.sns.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.UUIDGenerator;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.common.utils.exception.FileFormatException;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.sns.SnsDeleteDTO;
import jmnet.moka.core.common.sns.SnsPublishDTO;
import jmnet.moka.core.common.sns.SnsTypeCode;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ArticleEscapeUtil;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.article.vo.ArticleDetailVO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.repository.CodeMgtRepository;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareMetaSearchDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSaveDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.dto.InstanceArticleSaveDTO;
import jmnet.moka.core.tps.mvc.sns.dto.InstantArticleSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsSharePK;
import jmnet.moka.core.tps.mvc.sns.service.ArticleSnsShareService;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
import jmnet.moka.core.tps.mvc.sns.vo.InstantArticleVO;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Length;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.util.StringUtils;

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
@Api(tags = {"SNS API"})
public class ArticleSnsShareRestController extends AbstractCommonController {

    private final ArticleSnsShareService articleSnsShareService;

    private final ArticleService articleService;

    private final FtpHelper ftpHelper;

    @Value("${pds.url}")
    private String pdsUrl;

    @Autowired
    private Environment env;

    @Value("${sns.facebook.token-code}")
    private String facebookTokenCode;

    @Autowired
    private CodeMgtRepository codeMgtRepository;

    @Autowired
    private RestTemplateHelper restTemplateHelper;

    @Value("${sns.facebook.api-url}")
    private String facebookApiUrl;

    @Value("${sns.facebook.page-id}")
    private String facebookPageId;

    public ArticleSnsShareRestController(ArticleSnsShareService articleSnsShareService, ArticleService articleService, FtpHelper ftpHelper) {
        this.articleSnsShareService = articleSnsShareService;
        this.articleService = articleService;
        this.ftpHelper = ftpHelper;
    }

    /**
     * SNS 공유 기사 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    @ApiOperation(value = "SNS 메타 목록 조회")
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
    @ApiOperation(value = "SNS 전송 기사 목록 조회(FB)")
    @GetMapping("/send-articles")
    public ResponseEntity<?> getArticleSnsShareSendList(@SearchParam ArticleSnsShareMetaSearchDTO search) {

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
     * SNS 상세 조회
     *
     * @param totalId 기사ID
     * @param snsType sns 유형
     * @return 검색 결과
     */
    @ApiOperation(value = "SNS 상세 조회")
    @GetMapping("/{totalId}")
    public ResponseEntity<?> getArticleSnsShare(
            @ApiParam("기사 ID") @PathVariable("totalId") @Min(value = 0, message = "{tps.article.error.min.totalId}") Long totalId,
            @ApiParam("SNS 유형") @RequestParam(value = "snsType", required = false)
            @Length(max = 2, message = "{tps.article-page.error.length.artTypes}") SnsTypeCode snsType)
            throws NoDataException {

        // 조회
        Optional<ArticleDetailVO> articleDetailInfo = articleService.findArticleDetailById(totalId);
        Optional<ArticleSnsShare> articleSnsShareInfo = articleSnsShareService.findArticleSnsShareById(totalId, snsType);

        ArticleDetailVO articleDetailVO = articleDetailInfo.orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
        ArticleSnsShare articleSnsShare = articleSnsShareInfo.orElse(new ArticleSnsShare());

        ResultMapDTO resultDto = new ResultMapDTO(HttpStatus.OK);
        resultDto.addBodyAttribute("article", articleDetailVO);
        resultDto.addBodyAttribute("snsShare", articleSnsShare);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param articleSnsShareSaveDTO 등록할 SNS정보
     * @return 등록된 SNS정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "SNS 메타 등록")
    @PostMapping(value = "/{totalId}", produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                                                                                                       MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postArticleSnsShare(
            @ApiParam("기사 ID") @PathVariable("totalId") @Pattern(regexp = "[0-9]{4}$", message = "{tps.sns.error.pattern.totalId}") Long totalId,
            @Valid ArticleSnsShareSaveDTO articleSnsShareSaveDTO,
            @ApiParam("이미지 파일") @RequestParam(value = "imgFile", required = false) MultipartFile imgFile)
            throws InvalidDataException, Exception {

        ArticleSnsShare articleSnsShare = modelMapper.map(articleSnsShareSaveDTO, ArticleSnsShare.class);
        articleSnsShare.setId(ArticleSnsSharePK
                .builder()
                .totalId(totalId)
                .snsType(articleSnsShareSaveDTO.getSnsType())
                .build());

        // html escape
        articleSnsShare = escapeHtml(articleSnsShare);

        // 기사 정보 없을 경우 에러 처리
        ArticleBasic articleBasic = articleService
                .findArticleBasicById(articleSnsShare
                        .getId()
                        .getTotalId())
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        articleSnsShare.setImgUrl(fileUpload(articleBasic, null, articleSnsShareSaveDTO
                .getSnsType()
                .getCode(), imgFile));

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
            log.error("[FAIL TO INSERT SNS]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.sns.error.save"), e);
        }
    }



    /**
     * 수정
     *
     * @param totalId                SNS아이디
     * @param articleSnsShareSaveDTO 수정할 SNS정보
     * @return 수정된 SNS정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "SNS 메타 수정")
    @PutMapping(value = "/{totalId}", produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                                                                                                      MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> putArticleSnsShare(
            @ApiParam("기사 ID") @PathVariable("totalId") @Pattern(regexp = "[0-9]{4}$", message = "{tps.sns.error.pattern.totalId}") Long totalId,
            @Valid ArticleSnsShareSaveDTO articleSnsShareSaveDTO,
            @ApiParam("이미지 파일") @RequestParam(value = "imgFile", required = false) MultipartFile imgFile)
            throws Exception {

        // ArticleSnsShareDTO -> ArticleSnsShare 변환
        ArticleSnsShare newArticleSnsShare = modelMapper.map(articleSnsShareSaveDTO, ArticleSnsShare.class);
        newArticleSnsShare.setId(ArticleSnsSharePK
                .builder()
                .totalId(totalId)
                .snsType(articleSnsShareSaveDTO.getSnsType())
                .build());

        // html escape
        newArticleSnsShare = escapeHtml(newArticleSnsShare);

        // 기사 정보 없을 경우 에러 처리
        ArticleBasic articleBasic = articleService
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

        ArticleSnsShare returnValue = null;
        if (oldArticleSnsShare.isPresent()) {
            returnValue = oldArticleSnsShare.get();
            returnValue.setArtKeyword(newArticleSnsShare.getArtKeyword());
            returnValue.setArtTitle(newArticleSnsShare.getArtTitle());
            returnValue.setArtSummary(newArticleSnsShare.getArtSummary());
            returnValue.setImgUrl(fileUpload(articleBasic, newArticleSnsShare.getImgUrl(), articleSnsShareSaveDTO
                    .getSnsType()
                    .getCode(), imgFile));
            returnValue.setSnsPostMsg(newArticleSnsShare.getSnsPostMsg());
            returnValue.setUsedYn(newArticleSnsShare.getUsedYn());
            returnValue.setReserveDt(newArticleSnsShare.getReserveDt());
            returnValue = articleSnsShareService.updateArticleSnsShare(returnValue);
        } else {
            newArticleSnsShare.setImgUrl(fileUpload(articleBasic, null, articleSnsShareSaveDTO
                    .getSnsType()
                    .getCode(), imgFile));
            returnValue = articleSnsShareService.insertArticleSnsShare(newArticleSnsShare);
        }

        //purge
        articleService.purge(articleBasic);

        // 결과리턴
        ArticleSnsShareDTO dto = modelMapper.map(returnValue, ArticleSnsShareDTO.class);
        ResultDTO<ArticleSnsShareDTO> resultDto = new ResultDTO<>(dto, msg("tps.sns.success.save"));

        // 액션 로그에 성공 로그 출력
        tpsLogger.success(ActionType.UPDATE);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 관련아이템이 있는지 확인한다
     *
     * @param totalId SNSID
     * @return 관련아이템 존재 여부
     */
    @ApiOperation(value = "SNS 동일 정보 존재 여부 확인")
    @GetMapping("/{totalId}/exists")
    public ResponseEntity<?> exists(
            @ApiParam("기사 ID") @PathVariable("totalId") @Min(value = 0, message = "{tps.article.error.min.totalId}") Long totalId,
            @ApiParam("SNS 유형") @RequestParam(value = "snsType", required = false)
            @Length(max = 2, message = "{tps.article-page.error.length.artTypes}") SnsTypeCode snsType) {

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
    @ApiOperation(value = "SNS 메타 삭제")
    @DeleteMapping("/{totalId}")
    public ResponseEntity<?> deleteArticleSnsShare(
            @ApiParam("기사 ID") @PathVariable("totalId") @Min(value = 0, message = "{tps.article.error.min.totalId}") Long totalId,
            @ApiParam("SNS 유형") @RequestParam(value = "snsType", required = false)
            @Length(max = 2, message = "{tps.article-page.error.length.artTypes}") SnsTypeCode snsType)
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
            log.error("[FAIL TO DELETE SNS] totalId: {} {}", totalId, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.sns.error.delete"), e);
        }
    }


    /**
     * SNS 게시
     *
     * @return 성공여부
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "SNS에 전송")
    @PostMapping("/publish")
    public ResponseEntity<?> postSnsSend(@Valid SnsPublishDTO snsPublish)
            throws InvalidDataException, Exception {

        try {

            String noContentMessage = msg("tps.common.error.no-data");
            ArticleBasic articleBasic = articleService
                    .findArticleBasicById(snsPublish.getTotalId())
                    .orElseThrow(() -> new NoDataException(noContentMessage));

            // service flag가 Y인 경우만 sns에 개시한다.
            if (McpString.isNo(articleBasic.getServiceFlag())) {
                throw new InvalidDataException(msg("tps.sns.error.save.no-service"));
            }

            ArticleSnsShare articleSnsShare = articleSnsShareService
                    .findArticleSnsShareById(snsPublish.getTotalId(), snsPublish.getSnsType())
                    .orElseThrow(() -> new NoDataException(noContentMessage));

            // 사용여부가 Y인 경우에만 sns에 개시한다.
            if (McpString.isNo(articleSnsShare.getUsedYn())) {
                throw new InvalidDataException(msg("tps.sns.error.save.no-used"));
            }

            boolean reserved = false;
            boolean success = true;
            String successMsg = "";

            if (snsPublish.getReserveDt() != null && McpDate.term(snsPublish.getReserveDt()) > 0) {
                reserved = true;
                String result = articleSnsShareService.reservePublishSnsArticleSnsShare(snsPublish);
                if (TpsConstants.SERVER_REFUSED.equals(result)) {
                    success = false;
                    successMsg = msg("tps.common.error.schedule-server.refused");
                } else {
                    ResultDTO<?> reserveResult = ResourceMapper
                            .getDefaultObjectMapper()
                            .readValue(result, ResultDTO.class);
                    success = reserveResult
                            .getHeader()
                            .isSuccess();
                    if (!success) {
                        successMsg = reserveResult
                                .getHeader()
                                .getMessage();
                    }
                }

            } else {
                articleSnsShareService.publishSnsArticleSnsShare(snsPublish);
            }
            if (McpString.isEmpty(successMsg)) {
                if (success) {
                    successMsg = reserved ? msg("tps.sns.success.save.feed-reserve") : msg("tps.sns.success.save.feed");
                } else {
                    successMsg = reserved ? msg("tps.sns.error.save.feed-reserve") : msg("tps.sns.error.save.feed");
                }
            }
            // 결과리턴

            ResultDTO<Boolean> resultDto = new ResultDTO<>(success, successMsg);


            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT, successMsg);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT FACEBOOK INSTANCE ARTICLE]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.sns.error.save.feed-reserve"), e);
        }
    }


    /**
     * SNS 게시 삭제
     *
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 SNS 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "SNS에 배포 된 기사 삭제")
    @DeleteMapping("/unpublish")
    public ResponseEntity<?> deleteSns(@Valid SnsDeleteDTO snsDelete)
            throws InvalidDataException, NoDataException, Exception {

        try {

            boolean reserved = false;
            boolean success = true;
            String successMsg = "";
            InvalidDataDTO invalidDataDTO = null;
            if (snsDelete.getReserveDt() != null && McpDate.term(snsDelete.getReserveDt()) > 0) {
                reserved = true;
                String result = articleSnsShareService.reserveDeleteSnsArticleSnsShare(snsDelete);
                if (TpsConstants.SERVER_REFUSED.equals(result)) {
                    success = false;
                    successMsg = msg("tps.common.error.schedule-server.refused");
                } else {
                    ResultDTO<?> reserveResult = ResourceMapper
                            .getDefaultObjectMapper()
                            .readValue(result, ResultDTO.class);


                    success = reserveResult
                            .getHeader()
                            .isSuccess();
                    if (!success) {
                        successMsg = reserveResult
                                .getHeader()
                                .getMessage();
                    }
                }
            } else {
                articleSnsShareService.deleteSnsArticleSnsShare(snsDelete);
            }

            if (McpString.isEmpty(successMsg)) {
                if (success) {
                    successMsg = reserved ? msg("tps.sns.success.delete.feed-reserve") : msg("tps.sns.success.delete.feed");
                } else {
                    successMsg = reserved ? msg("tps.sns.error.save.feed-reserve") : msg("tps.sns.error.delete.feed");
                }
            }

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE, successMsg);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(success, successMsg);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE SNS] totalId: {} {}", snsDelete.getTotalId(), e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.UPDATE, e.toString());
            throw new Exception(msg("tps.sns.error.delete"), e);
        }
    }

    /**
     * FB Instance Article 등록된 기사 제출
     *
     * @return 성공여부
     * @throws Exception 예외처리
     */
    @ApiOperation(value = "TB_FB_INSTANT_ARTICLE_LIST 테이블에 등록된 기사 제출")
    @GetMapping("/fb-instance-article/sync")
    public ResponseEntity<?> syncFbIA()
            throws Exception {
        // access-token
        CodeMgt tokenCode = codeMgtRepository
                .findByDtlCd(facebookTokenCode)
                .orElseThrow(() -> new NoDataException("Not Found Facebook Token"));
        // import 상태 체크
        List<InstantArticleVO> importingCheckList = articleSnsShareService.findFbInstantArticles(InstantArticleSearchDTO
                .builder()
                .sourceCode("1,3")
                .count(5L)
                .listType("C")
                .build());
        for (InstantArticleVO checkItem : importingCheckList) {
            Map result = getImportStatus(checkItem.getFbStatusId(), tokenCode.getCdNm());
            String importStatus = result
                    .get("status")
                    .toString();
            if ("SUCCESS".equals(result)) {
                checkItem.setCallbackMsg(importStatus);
                checkItem.setFbArtId(((Map) result.get("instant_article"))
                        .get("id")
                        .toString());
            } else if ("FAILED".equals(importStatus)) {
                checkItem.setCallbackMsg(StringUtils.concat(importStatus, " : ", ((List<Map<String, String>>) result.get("errors"))
                        .get(0)
                        .get("message")));
            }
            articleSnsShareService.saveFbInstantArticle(checkItem);
        }

        // Instance Articles 대기 상태 조회
        List<InstantArticleVO> returnValues = articleSnsShareService.findFbInstantArticles(InstantArticleSearchDTO
                .builder()
                .sourceCode("1,3")
                .count(5L)
                .listType("S")
                .build());

        // 게시, 수정 & 삭제
        for (InstantArticleVO instantArticle : returnValues) {
            switch (instantArticle.getIud()) {
                case "I":
                case "U":
                    // articleContents Html -> facebook instance articles - htmlSource
                    String htmlSource = transformArticle(articleService
                            .findArticleDetailById(instantArticle.getTotalId())
                            .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data"))));
                    SnsPublishDTO pubInfo = SnsPublishDTO
                            .builder()
                            .tokenCode(tokenCode.getCdNm())
                            .message(htmlSource)
                            .build();
                    // 게시 or 수정요청.
                    Map result = postInstanceArticle(pubInfo);
                    result.get("id");
                    // 게시 결과 저장
                    articleSnsShareService.saveFbInstantArticle(instantArticle
                            .toBuilder()
                            .fbArtId(result
                                    .get("id")
                                    .toString())
                            .build());
                    break;
                case "D":
                    if (!McpString.isNullOrEmpty(instantArticle.getFbArtId())) {
                        // 삭제 요청.
                        Map deleteResult = deleteInstantArticle(instantArticle.getFbArtId(), tokenCode.getCdNm());
                        if (!McpString.isNullOrEmpty(deleteResult.get("success"))) {
                            instantArticle.setSendDt(new Date());
                            instantArticle.setCallbackMsg("SUCCESS");
                        } else {
                            instantArticle.setSendDt(new Date());
                            instantArticle.setCallbackMsg("ERROR");
                        }
                        articleSnsShareService.saveFbInstantArticle(instantArticle);
                    }
                    break;
                default:
                    break;
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * FB Instance Article 등록
     *
     * @param instanceArticle 등록할 페이스북 article 정보
     * @return 성공여부
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "TB_FB_INSTANT_ARTICLE_LIST 테이블에 기사 등록")
    @PostMapping("/fb-instance-article")
    public ResponseEntity<?> postArticleSnsMetaFbIA(@Valid InstanceArticleSaveDTO instanceArticle)
            throws InvalidDataException, Exception {

        try {
            // insert

            int result = articleSnsShareService.insertFbInstanceArticle(modelMapper.map(instanceArticle, ArticleSnsShareItemVO.class));


            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(result > 0,
                    result > 0 ? msg("tps.sns.success.save.facebook-instance-article") : msg("tps.sns.error.save.facebook-instance-article"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT FACEBOOK INSTANCE ARTICLE]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.sns.error.save.facebook-instance-article"), e);
        }
    }

    private ArticleSnsShare escapeHtml(ArticleSnsShare articleSnsShare) {
        if (McpString.isNotEmpty(articleSnsShare.getArtTitle())) {
            articleSnsShare.setArtTitle(ArticleEscapeUtil.htmlEscape(articleSnsShare.getArtTitle()));
        }
        if (McpString.isNotEmpty(articleSnsShare.getArtSummary())) {
            articleSnsShare.setArtSummary(ArticleEscapeUtil.htmlEscape(articleSnsShare.getArtSummary()));
        }
        if (McpString.isNotEmpty(articleSnsShare.getSnsPostMsg())) {
            articleSnsShare.setSnsPostMsg(ArticleEscapeUtil.htmlEscape(articleSnsShare.getSnsPostMsg()));
        }
        return articleSnsShare;
    }

    private String fileUpload(ArticleBasic articleBasic, String imgUrl, String snsType, MultipartFile imgFile)
            throws FileFormatException, IOException {
        if (imgFile != null) {
            if (!ImageUtil.isAllowUploadImageFormat(imgFile)) {
                throw new FileFormatException();
            }
            String ext = ImageUtil.ext(imgFile);
            String saveFilePath = env.getProperty(snsType.toLowerCase() + ".save.filepath", "/news/FbMetaImage");
            String yearMonth = McpDate.dateStr(McpDate.now(), "yyyyMM");
            saveFilePath = saveFilePath + "/" + yearMonth;
            String filename = UUIDGenerator.uuid() + "." + ext;

            if (ftpHelper.upload(FtpHelper.PDS, filename, imgFile.getInputStream(), saveFilePath)) {
                return pdsUrl + saveFilePath + "/" + filename;
            } else {
                return McpString.isNotEmpty(imgUrl) ? imgUrl : pdsUrl + articleBasic.getArtThumb();
            }
        } else {
            return McpString.isNotEmpty(imgUrl) ? imgUrl : pdsUrl + articleBasic.getArtThumb();
        }
    }

    /**
     * 아티클 삭제 요청.
     *
     * @param facebookArticleId
     * @param accessToken
     * @return
     * @throws Exception
     */
    private Map deleteInstantArticle(String facebookArticleId, String accessToken)
            throws Exception {
        String instanceArticleUrl = String.format(facebookApiUrl + "/%s", facebookArticleId);
        // dumpy
        //        ResponseEntity<String> content = new ResponseEntity<>("{\n" + "  \"success\": true\n" + "}", HttpStatus.OK);

        ResponseEntity<String> content = restTemplateHelper.delete(instanceArticleUrl, MapBuilder
                .getInstance()
                .add("access_token", accessToken)
                .getMultiValueMap());

        String response = content.getBody();
        return ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 임포트 상태 체크.
     *
     * @param facebookStatusId
     * @param accessToken
     * @return
     * @throws Exception
     */
    private Map getImportStatus(String facebookStatusId, String accessToken)
            throws Exception {
        String instanceArticleUrl = String.format(facebookApiUrl + "/%s", facebookStatusId);
        // dumpy
        // 성공
        //        ResponseEntity<String> content = new ResponseEntity<>(
        //                "{\n" + "  \"html_source\": \"<!doctype html>...\",\n" + "  \"instant_article\": {\n" + "    \"id\": \"1234\",\n"
        //                        + "    \"html_source\": \"<!doctype html>...\",\n" + "    \"canonical_url\": \"http://...\"\n" + "  },\n"
        //                        + "  \"status\": \"SUCCESS\",\n" + "  \"id\": \"5678\"\n" + "}", HttpStatus.OK);
        // 실패
        //        ResponseEntity<String> content = new ResponseEntity<>(
        //                "{\n" + "  \"id\": \"1234\",\n" + "  \"status\": \"IN_PROGRESS\",\n" + "  \"errors\": [\n" + "    {\n"
        //                        + "      \"level\": \"ERROR\",\n"
        //                        + "      \"message\": \"Could not find the Canonical URL within the document: Specify a valid canonical URL using <link rel=\\\"canonical\\\" and href=\\\"canonical url\\\">\"\n"
        //                        + "    }\n" + "  ]\n" + "}", HttpStatus.OK);
        ResponseEntity<String> content = restTemplateHelper.get(instanceArticleUrl, MapBuilder
                .getInstance()
                .add("access_token", accessToken)
                .add("fields", "errors,html_source,instant_article,status")
                .getMultiValueMap());

        String response = content.getBody();
        return ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 인스턴트 아티클 게시 or 수정 요청.
     *
     * @param pubInfo
     * @return
     * @throws Exception
     */
    private Map postInstanceArticle(SnsPublishDTO pubInfo)
            throws Exception {
        String instanceArticleUrl = String.format(facebookApiUrl + "/%s/instant_articles", facebookPageId);
        // dummy
        // ResponseEntity<String> content = new ResponseEntity<String>("{ \"id\": 1231231231 }", HttpStatus.OK);
        ResponseEntity<String> content = restTemplateHelper.post(instanceArticleUrl, MapBuilder
                .getInstance()
                .add("access_token", pubInfo.getTokenCode())
                .add("html_source", pubInfo.getMessage())
                .add("published", true)
                .add("development_mode", false)
                .getMultiValueMap());

        String response = content.getBody();
        return ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<Map<String, Object>>() {
                });
    }

    private String transformArticle(ArticleDetailVO articleDetailVO) {
        String iaHtmlTemp = new StringBuilder()
                .append("<!doctype html>\n")
                .append("	<html lang=\"ko\" prefix=\"op: http://media.facebook.com/op#\">\n")
                .append("	<head><meta charset=\"utf-8\"></head>\n")
                .append("	<body>\n")
                .append("	<article>\n")
                .append("	<header></header>\n")
                .append("	</article>\n")
                .append("	</body>\n")
                .append("</html>\n")
                .toString();

        Document iahtmlDoc = Jsoup.parse(iaHtmlTemp, "", Parser.xmlParser());
        Element headNode = iahtmlDoc.selectFirst("head");
        Element articleHeaderNode = iahtmlDoc.selectFirst("header");
        Element articleNode = iahtmlDoc.selectFirst("article");
        headNode.appendChild(new Element("link")
                .attr("rel", "canonical")
                .attr("href", StringUtils.concat("https://mnews.joins.com/article/", articleDetailVO.getTotalId())));
        headNode.appendChild(new Element("title").text(articleDetailVO.getMobTitle()));

        // article > header
        if (!McpString.isNullOrEmpty(articleDetailVO.getMultiLinkMobile())) {
            articleHeaderNode.appendChild(new Element("figure").appendChild(new Element("img").attr("src", articleDetailVO.getMultiLinkMobile())));
        }
        articleHeaderNode.appendChild(new Element("h1").text(articleDetailVO.getMobTitle()));
        if (!McpString.isNullOrEmpty(articleDetailVO.getArtSubTitle())) {
            articleHeaderNode.appendChild(new Element("h2").text(articleDetailVO.getArtSubTitle()));
        }
        if (articleDetailVO.getCodes() != null && articleDetailVO
                .getCodes()
                .size() > 0) {
            articleHeaderNode.appendChild(new Element("h3")
                    .classNames(Set.of("op-kicker"))
                    .text(articleDetailVO
                            .getCodes()
                            .get(0)
                            .getServiceKorName()));
        }
        if (articleDetailVO.getReporters() != null && articleDetailVO
                .getReporters()
                .size() > 0) {
            articleHeaderNode.appendChild(new Element("address").text(StringUtils.join(articleDetailVO
                    .getReporters()
                    .stream()
                    .map(r -> r.getRepName())
                    .collect(Collectors.toList()), ",")));
        }
        SimpleDateFormat dt = new SimpleDateFormat("yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'");
        SimpleDateFormat simple = new SimpleDateFormat("yyyy'-'MM'-'dd HH':'mm':'ss");
        articleHeaderNode.appendChild(new Element("time")
                .classNames(Set.of("op-published"))
                .attr("dateTime", dt.format(articleDetailVO.getArtRegDt()))
                .text(simple.format(articleDetailVO.getArtRegDt())));
        if (articleDetailVO.getArtModDt() != null) {
            articleHeaderNode.appendChild(new Element("time")
                    .classNames(Set.of("op-modified"))
                    .attr("dateTime", dt.format(articleDetailVO.getArtModDt()))
                    .text(simple.format(articleDetailVO.getArtModDt())));
        }

        // article
        Document htmlDoc = Jsoup.parse(articleDetailVO.getArtContent(), "", Parser.xmlParser());
        List<Node> targetList = htmlDoc.childNodesCopy();
        htmlDoc.childNodes();
        for (Node nNode : targetList) {

            if (nNode instanceof TextNode) {
                if (articleNode
                        .childNodes()
                        .size() > 0 && "p".equals(articleNode
                        .children()
                        .last()
                        .nodeName())) {
                    articleNode
                            .children()
                            .last()
                            .text(articleNode
                                    .children()
                                    .last()
                                    .text() + ((TextNode) nNode).text());
                } else {
                    articleNode.appendChild(new Element("p").text(((TextNode) nNode).text()));
                }
            } else if (nNode instanceof Element) {
                Node transedNode = transformForFBIA(nNode);

                if (transedNode != null) {
                    if ("#text".equals(transedNode.nodeName())) {
                        if (articleNode
                                .childNodes()
                                .size() > 0 && "p".equals(articleNode
                                .children()
                                .last()
                                .nodeName())) {
                            articleNode
                                    .children()
                                    .last()
                                    .appendChild(transedNode);
                        } else {
                            articleNode.appendChild(new Element("p").text(((TextNode) nNode).text()));
                        }
                    } else if (articleNode
                            .childNodes()
                            .size() > 0 && "br".equals(articleNode
                            .children()
                            .last()
                            .nodeName())) {
                        articleNode.appendChild(new Element("p"));
                    } else if ("div".equals(transedNode.nodeName())) {
                        for (Node cNode : transedNode.childNodes()) {
                            articleNode.appendChild(cNode);
                        }
                    } else {
                        articleNode.appendChild(transedNode);
                    }
                }
            }
        }
        articleNode.appendChild(new Element("footer").appendChild(new Element("small").text("© 중앙일보")));
        return iahtmlDoc.html();
    }

    private Node transformForFBIA(Node node) {
        Element figureNode = null;
        Element elNode = (Element) node;
        String className = node.attr("class");

        if (className.contains("ab_photo")) {
            // 이미지
            figureNode = new Element("figure");
            figureNode.appendChild(elNode.selectFirst("div>img,div>a>img"));
            Element cNode = elNode.selectFirst("p.caption");
            if (cNode != null) {
                figureNode.appendChild(new Element("figcaption").text(cNode.text()));
            }
        } else if (className.contains("tag_vod")) {
            // 동영상
            figureNode = new Element("figure").classNames(Set.of("op-interactive"));
            String serviceId = node.attr("data-service");
            String dataId = node.attr("data-id");
            String caption = node.attr("data-caption");

            if ("ooyala".equals(serviceId)) {
                figureNode.appendChild(new Element("iframe")
                        .attr("width", "480")
                        .attr("height", "270")
                        .attr("src", StringUtils.concat("https://oya.joins.com/bc_iframe.html?ec=" + dataId.substring(0, dataId.indexOf("?")))));
            } else if ("ovp".equals(serviceId)) {
                figureNode.appendChild(new Element("iframe")
                        .attr("width", "480")
                        .attr("height", "270")
                        .attr("src", StringUtils.concat("https://oya.joins.com/bc_iframe.html?videoId=" + dataId.substring(0, dataId.indexOf("?")))));
            } else if ("navercast".equals(serviceId) || "kakaotv".equals(serviceId)) {
                figureNode.appendChild(new Element("iframe")
                        .attr("width", "480")
                        .attr("height", "270")
                        .attr("src", dataId));
            } else {
                figureNode.appendChild(new Element("iframe").attr("src", dataId));
            }

            if (!McpString.isNullOrEmpty(caption)) {
                figureNode.appendChild(new Element("figcaption").text(caption));
            }
        } else if (className.contains("tag_sns")) {
            // SNS 카드
            String serviceId = node.attr("data-service");
            String dataUrl = node.attr("data-url");
            // string dataType = node.GetAttributeValue("data-type", "");
            figureNode = new Element("figure").classNames(Set.of("op-interactive"));

            if ("facebook".equals(serviceId)) {
                Element embedTag = Jsoup.parse(String.format(
                        "<script async defer src=\"https://connect.facebook.net/ko_KR/sdk.js#xfbml=1&version=v3.2\" ></script><div class=\"fb-post\" data-href=\"%s\" data-width=\"500\" ></div>",
                        dataUrl), "", Parser.xmlParser());
                Element iframe = new Element("iframe");
                embedTag
                        .children()
                        .stream()
                        .forEach(iframe::appendChild);
                figureNode.appendChild(iframe);
            } else if ("twitter".equals(serviceId)) {
                Element embedTag = Jsoup.parse(String.format(
                        "<script async defer src=\"https://platform.twitter.com/widgets.js\" ></script><blockquote class=\"twitter-tweet\" lang=\"ko\"><a href=\"%s\"></a></blockquote>",
                        dataUrl), "", Parser.xmlParser());
                Element iframe = new Element("iframe");
                embedTag
                        .children()
                        .stream()
                        .forEach(iframe::appendChild);
                figureNode.appendChild(iframe);
            } else if ("instagram".equals(serviceId)) {
                Element embedTag = Jsoup.parse(String.format(
                        "<blockquote class=\"instagram-media\" data-instgrm-captioned data-instgrm-version=\"4\"><div style=\"padding:16px;\"><a href=\"%s\"></a></div></blockquote><script async defer src=\"https://platform.instagram.com/en_US/embeds.js\" ></script>",
                        dataUrl), "", Parser.xmlParser());
                Element iframe = new Element("iframe");
                embedTag
                        .children()
                        .stream()
                        .forEach(iframe::appendChild);
                figureNode.appendChild(iframe);
            } else if ("pinterest".equals(serviceId)) {
                Element embedTagScript = new Element("script")
                        .attr("async", "async")
                        .attr("defer", "defer")
                        .attr("src", "https://assets.pinterest.com/js/pinit.js");
                Element embedTagA = new Element("a")
                        .attr("data-pin-do", "embedPin")
                        .attr("href", dataUrl);
                figureNode.appendChild(new Element("iframe")
                        .appendChild(embedTagScript)
                        .appendChild(embedTagA));
            }
        } else if (className.contains("ab_related_article")) {
            // 관련기사
            var articlelinks = elNode.select("a");

            figureNode = new Element("ul")
                    .classNames(Set.of("op-related-articles"))
                    .attr("title", "관련기사");
            for (Element link : articlelinks
                    .stream()
                    .limit(3)
                    .collect(Collectors.toList())) {
                link.attr("href", link
                        .attr("href")
                        .replaceAll("//news", "//mnews"));
                figureNode
                        .appendChild(new Element("li"))
                        .appendChild(link);
            }
        } else if (className.contains("ab_map")) {
            // 지도
            figureNode = new Element("figure")
                    .classNames(Set.of("op-interactive"))
                    .appendChild(new Element("iframe"));
            figureNode
                    .selectFirst("iframe")
                    .appendChild(node);
        } else if (className.contains("tag_quotation")) {
            // 인용문
            figureNode = new Element("blockquote").text(elNode.text());
        } else if (className.contains("tag_interview")) {
            // 인터뷰
            Element qNode = elNode.selectFirst("div.tag_question");
            Element aNode = elNode.selectFirst("div.tag_answer");
            figureNode = new Element("p");

            if (qNode != null) {
                figureNode.appendChild(new Element("b").text(String.format("Q. %s ", qNode.text())));
            } else if (aNode != null) {
                figureNode.appendChild(new Element("i").text(String.format("A. %s ", aNode.text())));
            }
        } else if (className.contains("tag_photobundle")) {
            // 이미지 묶음
            Elements images = elNode.select("img");

            figureNode = new Element("figure").classNames(Set.of("op-slideshow"));

            for (Element img : images) {
                //                figureNode.appendChild(new Element("<figure></figure>"));
                figureNode.appendChild(new Element("figure").appendChild(img));
            }
        } else if (className.contains("ab_box_article")) {
            Element boxNode = elNode.selectFirst("div[class*=ab_box_inner]");
            Element boxContentsNode = boxNode.selectFirst("div[class*=ab_box_content]");
            Element titleNode = boxNode.selectFirst("div[class*=ab_box_title]");

            // dummy
            figureNode = new Element("div");

            if (titleNode != null) {
                figureNode.appendChild(new Element("h2").text(titleNode.text()));
            }

            for (Node cNode : boxContentsNode.childNodes()) {
                Node transedNode = transformForFBIA(cNode);
                if (transedNode != null) {
                    figureNode.appendChild(transedNode);
                }
            }
        } else if ("font".equals(node.nodeName())) {
            return new TextNode(elNode.text());
        } else if ("br".equals(node.nodeName())) {
            figureNode = elNode;
        } else if ("dim".equals(className)) {
            //do nothing
        } else {
            if (!McpString.isNullOrEmpty(elNode.text())) {
                figureNode = new Element("p").text(elNode.text());
            }
        }

        return (Node) figureNode;
    }
}
