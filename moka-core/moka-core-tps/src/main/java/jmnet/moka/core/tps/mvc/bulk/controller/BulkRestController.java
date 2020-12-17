package jmnet.moka.core.tps.mvc.bulk.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.ValidList;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.article.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.bulk.dto.BulkArticleDTO;
import jmnet.moka.core.tps.mvc.bulk.dto.BulkDTO;
import jmnet.moka.core.tps.mvc.bulk.dto.BulkSaveDTO;
import jmnet.moka.core.tps.mvc.bulk.dto.BulkSearchDTO;
import jmnet.moka.core.tps.mvc.bulk.entity.Bulk;
import jmnet.moka.core.tps.mvc.bulk.entity.BulkArticle;
import jmnet.moka.core.tps.mvc.bulk.service.BulkService;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
 * <pre>
 * 벌크(네이버벌크문구 / 아티클핫클릭)
 * 2020. 11. 16. ssc 최초생성
 * RequestMapping 생성 규칙
 * RESTful 방식에 소문자만 허용하고 단어 사이 구분이 필요한 경우 '-' 사용
 * 메소드 생성 규칙
 *  벌크문구 목록 조회 : get{Target}List, HttpMethod = GET
 *  벌크문구 기사 목록 조회 : get{Target}List, HttpMethod = GET
 * 약물정보 조회 : get{Target}, HttpMethod = GET
 * 약물정보 수정 : put{Target}, HttpMethod = PUT
 * 벌크문구 서비스 여부 저장 : post{Target}, HttpMethod = POST
 *  벌크 문구 기사 정보 저장  : post{Target}, HttpMethod = POST
 * 수정  : put{Target}, HttpMethod = PUT
 * </pre>
 *
 * @author ssc
 * @since 2020. 11. 16. 오후 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/bulks")
@Api(tags = {"네이버벌크/핫클릭 API"})
public class BulkRestController extends AbstractCommonController {

    private final BulkService naverBulkService;

    private final CodeMgtService codeMgtService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final ArticleService articleService;

    private final TpsLogger tpsLogger;

    public BulkRestController(BulkService naverBulkService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger,
            CodeMgtService codeMgtService, ArticleService articleService) {
        this.codeMgtService = codeMgtService;
        this.naverBulkService = naverBulkService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
        this.articleService = articleService;
    }

    /**
     * 벌크문구/아티클핫클릭 목록 조회
     *
     * @param search 검색조건 : 클릭기사 그룹, 출처, 서비스여부,  조회시작일자, 조회종료일자,
     * @return 벌크문구목록
     */
    @ApiOperation(value = "벌크문구/아티클핫클릭 목록 조회")
    @GetMapping
    public ResponseEntity<?> getBulkList(@Valid @SearchParam BulkSearchDTO search) {

        ResultListDTO<BulkDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<Bulk> returnValue = naverBulkService.findAllBulkList(search);

        // 리턴값 설정
        List<BulkDTO> bulkList = modelMapper.map(returnValue.getContent(), BulkDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(bulkList);

        // 결과값 셋팅
        ResultDTO<ResultListDTO<BulkDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 벌크문구 기사 목록 조회
     *
     * @param request    요청
     * @param bulkartSeq 일련번호 (필수)
     * @return 벌크 문구 기사 목록
     * @throws NoDataException 벌크문구 기사 정보가 없음
     */
    @ApiOperation(value = "벌크문구 기사 목록 조회")
    @GetMapping("/{bulkartSeq}/articles")
    public ResponseEntity<?> getBulkList(HttpServletRequest request,
            @ApiParam("벌크 일련번호") @PathVariable("bulkartSeq") @Min(value = 0, message = "{tps.bulk.error.pattern.bulkartSeq}") Long bulkartSeq)
            throws Exception {

        ResultListDTO<BulkArticleDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        List<BulkArticle> returnValue = naverBulkService.findAllByBulkartSeq(bulkartSeq);


        // 리턴값 설정
        List<BulkArticleDTO> columnistList = modelMapper.map(returnValue, BulkArticleDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());

        returnValue
                .stream()
                .forEach(item -> {
                    columnistList
                            .get(returnValue.indexOf(item))
                            .setBulkartSeq(item
                                    .getId()
                                    .getBulkartSeq());
                    columnistList
                            .get(returnValue.indexOf(item))
                            .setOrdNo(item
                                    .getId()
                                    .getOrdNo());
                });

        resultListMessage.setList(columnistList);

        // 결과값 셋팅
        ResultDTO<ResultListDTO<BulkArticleDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 벌크문구 서비스 여부 저장
     *
     * @param bulkDTO 등록할 벌크문구 저장
     * @return 등록된 벌크문구 서비스여부
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "벌크 사용여부 수정")
    @PutMapping(value = "/{bulkartSeq}/used")
    public ResponseEntity<?> putBulkWordServiceYn(
            @ApiParam("벌크 일련번호") @PathVariable("bulkartSeq") @Min(value = 0, message = "{tps.bulk.error.pattern.bulkartSeq}") Long bulkartSeq,
            @Valid BulkDTO bulkDTO)
            throws InvalidDataException, Exception {

        // naverbulkDto -> naverbulk 변환
        Bulk newBulk = modelMapper.map(bulkDTO, Bulk.class);
        Bulk orgBulk = naverBulkService
                .findById(newBulk.getBulkartSeq())
                .orElseThrow(() -> {
                    return new NoDataException(msg("tps.bulk.error.no-data"));
                });

        // SourceCode check
        List<ArticleSource> articleSources = articleService.findAllBulkArticleSource();
        boolean isSourceCodeMatch = articleSources
                .stream()
                .anyMatch(articleSource -> articleSource
                        .getSourceCode()
                        .equals(newBulk.getSourceCode()));

        // status check
        if (!isSourceCodeMatch) {
            throw new Exception(msg("tps.bulk.error.pattern.sourceCode"));
        }

        // status check
        if (!MokaConstants.STATUS_SAVE.equals(bulkDTO.getStatus()) && !MokaConstants.STATUS_PUBLISH.equals(bulkDTO.getStatus())) {
            throw new Exception(msg("tps.bulk.error.pattern.status"));
        }

        try {

            // update
            naverBulkService.updateArticle(newBulk);

            // 결과리턴
            BulkDTO dto = modelMapper.map(newBulk, BulkDTO.class);
            String message = msg("tps.bulk.success.update");
            ResultDTO<BulkDTO> resultDto = new ResultDTO<>(dto, message);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE Article] seq: {} {}", bulkDTO.getBulkartSeq(), e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE Article]", e, true);
            throw new Exception(msg("tps.bulk.error.save"), e);
        }
    }

    @ApiOperation(value = "벌크 재전송")
    @PutMapping(value = "/{bulkartSeq}/resend")
    public ResponseEntity<?> putResend(
            @ApiParam("벌크 일련번호") @PathVariable("bulkartSeq") @Min(value = 0, message = "{tps.bulk.error.pattern.bulkartSeq}") Long bulkartSeq)
            throws InvalidDataException, Exception {

        Bulk bulk = naverBulkService
                .findById(bulkartSeq)
                .orElseThrow(() -> {
                    return new NoDataException(msg("tps.bulk.error.no-data"));
                });

        try {
            // update
            bulk.setBulkSendYn(MokaConstants.YES);
            bulk.setSendDt(McpDate.now());

            naverBulkService.updateArticle(bulk);

            // 결과리턴
            BulkDTO dto = modelMapper.map(bulk, BulkDTO.class);
            String message = msg("tps.bulk.success.update");
            ResultDTO<BulkDTO> resultDto = new ResultDTO<>(dto, message);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE BULK RESEND] seq: {} {}", bulkartSeq, e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE BULK RESEND]", e, true);
            throw new Exception(msg("tps.bulk.error.save"), e);
        }
    }

    /**
     * 벌크문구기사 저장
     *
     * @param bulkSave  벌트 등록 정보
     * @param validList 벌크문구목록데이터
     * @return 등록된 벌크문구기사
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     * @
     */
    @ApiOperation(value = "벌크문구 및 벌크기사정보저장")
    @PostMapping
    public ResponseEntity<?> postBulk(@Valid BulkSaveDTO bulkSave, @ApiParam("벌크 기사 목록") @RequestBody @Valid ValidList<BulkArticleDTO> validList)
            throws InvalidDataException, Exception {

        try {
            // bulkartDiv check
            if (!MokaConstants.CLICKART_DIV_H.equals(bulkSave.getBulkartDiv()) && !MokaConstants.CLICKART_DIV_N.equals(bulkSave.getBulkartDiv())) {
                //           tpsLogger.fail(ActionType.UPDATE, message, true);
                throw new Exception(msg("tps.bulk.error.pattern.bulkartDiv"));
            }

            // SourceCode check
            if (!MokaConstants.STATUS_SAVE.equals(bulkSave.getStatus()) && !MokaConstants.STATUS_PUBLISH.equals(bulkSave.getStatus())) {
                //           tpsLogger.fail(ActionType.UPDATE, message, true);
                throw new Exception(msg("tps.bulk.error.pattern.status"));
            }

            List<ArticleSource> articleSources = articleService.findAllBulkArticleSource();
            boolean isSourceCodeMatch = articleSources
                    .stream()
                    .anyMatch(articleSource -> articleSource
                            .getSourceCode()
                            .equals(bulkSave.getSourceCode()));

            // status check
            if (!isSourceCodeMatch) {
                //            tpsLogger.fail(ActionType.UPDATE, message, true);
                throw new Exception(msg("tps.bulk.error.pattern.sourceCode"));
            }

            List<BulkArticleDTO> list = validList.getList();
            if (list.size() > 0) {
                // insert
                Bulk returnValue = naverBulkService.insertBulk(modelMapper.map(bulkSave, Bulk.class), list);

                // 결과리턴
                BulkDTO dto = modelMapper.map(returnValue, BulkDTO.class);
                ResultDTO<BulkDTO> resultDto = new ResultDTO<>(dto);

                // 액션 로그에 성공 로그 출력
                tpsLogger.success(ActionType.INSERT);
                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            } else {
                throw new Exception(msg("tps.bulk.error.save"));
            }

        } catch (Exception e) {
            log.error("[FAIL TO INSERT]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.bulk.error.save"), e);
        }
    }

}
