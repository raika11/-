package jmnet.moka.core.tps.mvc.sns.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.UUIDGenerator;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.common.utils.exception.FileFormatException;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.sns.SnsDeleteDTO;
import jmnet.moka.core.common.sns.SnsPublishDTO;
import jmnet.moka.core.common.sns.SnsTypeCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ArticleEscapeUtil;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.article.vo.ArticleDetailVO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareMetaSearchDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSaveDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.dto.InstanceArticleSaveDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsSharePK;
import jmnet.moka.core.tps.mvc.sns.service.ArticleSnsShareService;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Length;
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
            @Length(max = 2, message = "{tps.article-page.error.length.artType}") SnsTypeCode snsType)
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
            @Length(max = 2, message = "{tps.article-page.error.length.artType}") SnsTypeCode snsType) {

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
            @Length(max = 2, message = "{tps.article-page.error.length.artType}") SnsTypeCode snsType)
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
            articleService
                    .findArticleBasicById(snsPublish.getTotalId())
                    .orElseThrow(() -> new NoDataException(noContentMessage));

            boolean reserved = false;
            if (snsPublish.getReserveDt() != null && McpDate.term(snsPublish.getReserveDt()) > 0) {
                reserved = true;
                articleSnsShareService.reservePublishSnsArticleSnsShare(snsPublish);
            } else {
                articleSnsShareService.publishSnsArticleSnsShare(snsPublish);
            }
            String successMsg = reserved ? msg("tps.sns.success.save.feed-reserve") : msg("tps.sns.success.save.facebook-instance-article");
            // 결과리턴

            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, successMsg);


            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT, successMsg);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT FACEBOOK INSTANCE ARTICLE]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.sns.error.save.facebook-instance-article"), e);
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
            if (snsDelete.getReserveDt() != null && McpDate.term(snsDelete.getReserveDt()) > 0) {
                reserved = true;
                articleSnsShareService.reserveDeleteSnsArticleSnsShare(snsDelete);
            } else {
                articleSnsShareService.deleteSnsArticleSnsShare(snsDelete);
            }

            String successMsg = reserved ? msg("tps.sns.success.delete.feed-reserve") : msg("tps.sns.success.delete.facebook-instance-article");

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE, successMsg);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, successMsg);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE SNS] totalId: {} {}", snsDelete.getTotalId(), e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.UPDATE, e.toString());
            throw new Exception(msg("tps.sns.error.delete"), e);
        }
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
}
