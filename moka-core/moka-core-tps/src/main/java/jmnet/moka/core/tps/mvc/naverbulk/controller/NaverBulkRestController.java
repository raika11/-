package jmnet.moka.core.tps.mvc.naverbulk.controller;

import io.swagger.annotations.ApiOperation;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.dto.ValidList;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkDTO;
import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkListDTO;
import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkSearchDTO;
import jmnet.moka.core.tps.mvc.naverbulk.entity.Article;
import jmnet.moka.core.tps.mvc.naverbulk.entity.ArticleList;
import jmnet.moka.core.tps.mvc.naverbulk.service.NaverBulkService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <pre>
 * 컬럼리스트
 * 2020. 11. 16. ssc 최초생성
 * RequestMapping 생성 규칙
 * RESTful 방식에 소문자만 허용하고 단어 사이 구분이 필요한 경우 '-' 사용
 * 메소드 생성 규칙
 * 네이버 벌크문구 목록 조회 : get{Target}List, HttpMethod = GET
 * 네이버 벌크문구 기사 목록 조회 : get{Target}List, HttpMethod = GET
 * 약물정보 조회 : get{Target}, HttpMethod = GET
 * 약물정보 수정 : put{Target}, HttpMethod = PUT
 * 네이버벌크문구 서비스 여부 저장 : post{Target}, HttpMethod = POST
 * 네이버 벌크 문구 기사 정보 저장  : post{Target}, HttpMethod = POST
 * 수정  : put{Target}, HttpMethod = PUT
 * </pre>
 *
 * @author ssc
 * @since 2020. 11. 16. 오후 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/naver-bulks")
public class NaverBulkRestController {

    private final NaverBulkService naverBulkService;

    private final CodeMgtService codeMgtService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final TpsLogger tpsLogger;

    public NaverBulkRestController(NaverBulkService naverBulkService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger, CodeMgtService codeMgtService) {
        this.codeMgtService = codeMgtService;
        this.naverBulkService = naverBulkService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * 네이버 벌크문구 목록 조회
     *
     * @param search 검색조건 : 클릭기사 그룹, 출처, 서비스여부,  조회시작일자, 조회종료일자,
     * @return 네이버벌크문구목록
     */
    @ApiOperation(value = "네이버 벌크문구 목록 조회")
    @GetMapping
    public ResponseEntity<?> getNaverBulkList(@Valid @SearchParam NaverBulkSearchDTO search) {

        ResultListDTO<NaverBulkDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<Article> returnValue = naverBulkService.findAllNaverBulkList(search);

        // 리턴값 설정
        List<NaverBulkDTO> bulkList = modelMapper.map(returnValue.getContent(), NaverBulkDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(bulkList);

        // 결과값 셋팅
        ResultDTO<ResultListDTO<NaverBulkDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 네이버 벌크문구 기사 목록 조회
     *
     * @param request  요청
     * @param clickartSeq 일련번호 (필수)
     * @return 네이버 벌크 문구 기사 목록
     * @throws NoDataException 네이버 벌크문구 기사 정보가 없음
     */
    @ApiOperation(value = "네이버 벌크문구 기사 목록 조회")
    @GetMapping("/news-list/{clickartSeq}")
    public ResponseEntity<?> getNaverBulkList(HttpServletRequest request
            , @PathVariable("clickartSeq") @Min(value = 0, message = "{tps.naver-bulk.error.pattern.clickartSeq}") Long clickartSeq)
            throws Exception {

        ResultListDTO<NaverBulkListDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        List<ArticleList> returnValue = naverBulkService.findAllByClickartSeq(clickartSeq);


        // 리턴값 설정
        List<NaverBulkListDTO> columnistList = modelMapper.map(returnValue, NaverBulkListDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());

        returnValue.stream().forEach(
                item -> {
                    columnistList.get(returnValue.indexOf(item)).setClickartSeq(item.getId().getClickartSeq());
                    columnistList.get(returnValue.indexOf(item)).setOrdNo(item.getId().getOrdNo());
                }
        );

        resultListMessage.setList(columnistList);

        // 결과값 셋팅
        ResultDTO<ResultListDTO<NaverBulkListDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 네이버벌크문구 서비스 여부 저장
     *
     * @param naverBulkDTO 등록할 네이버벌크문구 저장
     * @return 등록된 네이버벌크문구 서비스여부
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "컬럼리스트 수정")
    @PutMapping(value = "/{clickartSeq}")
    public ResponseEntity<?> putNaverBulkWordServiceYn(
            @PathVariable("clickartSeq") @Min(value = 0, message = "{tps.naver-bulk.error.pattern.clickartSeq}") Long clickartSeq,
            @Valid NaverBulkDTO naverBulkDTO
    )throws InvalidDataException, Exception {

        // naverbulkDto -> naverbulk 변환
        Article newArticle = modelMapper.map(naverBulkDTO, Article.class);
        Article orgArticle = naverBulkService.findById(newArticle.getClickartSeq()).orElseThrow(() -> {
            return new NoDataException(messageByLocale.get("tps.naver-bulk.error.no-data"));
        });

        // SourceCode check
        if(!MokaConstants.SOURCE_CODE_60.equals(naverBulkDTO.getSourceCode())
            && !MokaConstants.SOURCE_CODE_3.equals(naverBulkDTO.getSourceCode())){
            throw new Exception(messageByLocale.get("tps.naver-bulk.error.pattern.sourceCode"));
        }

        // status check
        if(!MokaConstants.STATUS_SAVE.equals(naverBulkDTO.getStatus())
                && !MokaConstants.STATUS_PUBLISH.equals(naverBulkDTO.getStatus())){
            throw new Exception(messageByLocale.get("tps.naver-bulk.error.pattern.status"));
        }

        try {

            // update
            naverBulkService.updateArticle(newArticle);

            // 결과리턴
            NaverBulkDTO dto = modelMapper.map(newArticle, NaverBulkDTO.class);
            String message = messageByLocale.get("tps.naver-bulk.success.update");
            ResultDTO<NaverBulkDTO> resultDto = new ResultDTO<>(dto, message);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE Article] seq: {} {}", naverBulkDTO.getClickartSeq(),  e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE Article]", e, true);
            throw new Exception(messageByLocale.get("tps.naver-bulk.error.save"), e);
        }
    }

    /**
     * 네이버벌크문구기사 저장
     * @param request             요청
     * @param clickartDiv         source 벌크문구구분
     * @param sourceCode          source 소스코드
     * @param status              source 상태코드
     * @param validList       네이버벌크문구목록데이터
     * @return 등록된 네이버벌크문구기사
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "네이버벌크문구기사정보저장")
    @PostMapping(value="/news-info{clickartDiv}/content/{sourceCode}/naver/{status}"
            , headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postNaverBulkNewsInfo(
            HttpServletRequest request
//            , @NotNull(message = "{tps.naver-bulk.error.notnull.clickartDiv}") String clickartDiv
//            , @NotNull(message = "{tps.naver-bulk.error.notnull.sourceCode}") String sourceCode
//            , @NotNull(message = "{tps.naver-bulk.error.notnull.status}") String status
            , @PathVariable("clickartDiv") @NotNull(message = "{tps.naver-bulk.error.notnull.clickartDiv}") String clickartDiv
            , @PathVariable("sourceCode") @NotNull(message = "{tps.naver-bulk.error.notnull.sourceCode}") String sourceCode
            , @PathVariable("status") @NotNull(message = "{tps.naver-bulk.error.notnull.status}") String status
            , @RequestBody @Valid ValidList<NaverBulkListDTO> validList)
            throws InvalidDataException, Exception {

        try {

            // clickartDiv check
            if(!MokaConstants.CLICKART_DIV_H.equals(clickartDiv)
                    && !MokaConstants.CLICKART_DIV_N.equals(clickartDiv)){
//           tpsLogger.fail(ActionType.UPDATE, message, true);
                throw new Exception(messageByLocale.get("tps.naver-bulk.error.pattern.clickartDiv"));
            }

            // SourceCode check
            if(!MokaConstants.STATUS_SAVE.equals(status)
                    && !MokaConstants.STATUS_PUBLISH.equals(status)){
//           tpsLogger.fail(ActionType.UPDATE, message, true);
                throw new Exception(messageByLocale.get("tps.naver-bulk.error.pattern.status"));
            }

            // status check
            if(!MokaConstants.SOURCE_CODE_60.equals(sourceCode)
                    && !MokaConstants.SOURCE_CODE_3.equals(sourceCode)){
//            tpsLogger.fail(ActionType.UPDATE, message, true);
                throw new Exception(messageByLocale.get("tps.naver-bulk.error.pattern.sourceCode"));
            }

            List<NaverBulkListDTO> list = validList.getList();
            if (list.size() > 0) {
                // insert
                Article returnValue = naverBulkService.insertNaverBulk(list, clickartDiv, sourceCode, status);

                // 결과리턴
                NaverBulkDTO dto = modelMapper.map(returnValue, NaverBulkDTO.class);
                ResultDTO<NaverBulkDTO> resultDto = new ResultDTO<>(dto);

                // 액션 로그에 성공 로그 출력
                tpsLogger.success(ActionType.INSERT);
                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            }else{
                throw new Exception(messageByLocale.get("tps.naver-bulk.error.save", request));
            }

        } catch (Exception e) {
            log.error("[FAIL TO INSERT]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(messageByLocale.get("tps.naver-bulk.error.save"), e);
        }
    }


}