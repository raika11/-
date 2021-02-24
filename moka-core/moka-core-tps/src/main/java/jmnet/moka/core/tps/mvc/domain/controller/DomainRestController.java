package jmnet.moka.core.tps.mvc.domain.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.helper.ApiCodeHelper;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.relation.service.RelationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * 도메인
 * 2020. 1. 8. ssc 최초생성
 * RequestMapping 생성 규칙
 * RESTful 방식에 소문자만 허용하고 단어 사이 구분이 필요한 경우 '-' 사용
 * 메소드 생성 규칙
 * 목록 조회 : get{Target}List, HttpMethod = GET
 * 조회 : get{Target}, HttpMethod = GET
 * 등록  : post{Target}, HttpMethod = POST
 * 수정  : put{Target}, HttpMethod = PUT
 * 삭제  : delete{Target}, HttpMethod = DELETE
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 8. 오후 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/domains")
@Api(tags = {"도메인 API"})
public class DomainRestController extends AbstractCommonController {

    private final DomainService domainService;

    private final CodeMgtService codeMgtService;

    private final RelationService relationService;

    private final ApiCodeHelper apiCodeHelper;

    private final PurgeHelper purgeHelper;

    public DomainRestController(DomainService domainService, CodeMgtService codeMgtService, RelationService relationService,
            ApiCodeHelper apiCodeHelper, PurgeHelper purgeHelper) {
        this.domainService = domainService;
        this.codeMgtService = codeMgtService;
        this.relationService = relationService;
        this.apiCodeHelper = apiCodeHelper;
        this.purgeHelper = purgeHelper;
    }

    /**
     * 도메인목록조회
     *
     * @param search 검색조건
     * @return 도메인목록
     */
    @ApiOperation(value = "도메인 목록 조회")
    @GetMapping
    public ResponseEntity<?> getDomainList(@SearchParam SearchDTO search) {

        // 조회
        Page<Domain> returnValue = domainService.findAllDomain(search);

        // 리턴값 설정
        ResultListDTO<DomainDTO> resultListMessage = new ResultListDTO<>();
        List<DomainDTO> domainDtoList = modelMapper.map(returnValue.getContent(), DomainDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(domainDtoList);

        ResultDTO<ResultListDTO<DomainDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 도메인정보 조회
     *
     * @param domainId 도메인아이디 (필수)
     * @return 도메인정보
     * @throws NoDataException 도메인 정보가 없음
     */
    @ApiOperation(value = "도메인 조회")
    @GetMapping("/{domainId}")
    public ResponseEntity<?> getDomain(@ApiParam("도메인 ID(필수)") @PathVariable("domainId")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId)
            throws NoDataException {

        String message = msg("tps.domain.error.no-data");
        Domain domain = domainService
                .findDomainById(domainId)
                .orElseThrow(() -> new NoDataException(message));

        DomainDTO dto = modelMapper.map(domain, DomainDTO.class);

        // apiHost, apiPath -> apiCodeId
        List<CodeMgt> codeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
        String apiCodeId = apiCodeHelper.getDataApiCode(codeMgts, dto.getApiHost(), dto.getApiPath());
        if (apiCodeId != null) {
            dto.setApiCodeId(apiCodeId);
        }

        tpsLogger.success(ActionType.SELECT, true);

        ResultDTO<DomainDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 도메인 중복 아이디 체크
     *
     * @param domainId 도메인아이디
     * @return 중복 여부
     */
    @ApiOperation(value = "동일 아이디 존재 여부")
    @GetMapping("/{domainId}/exists")
    public ResponseEntity<?> duplicateCheckId(@ApiParam("도메인 ID(필수)") @PathVariable("domainId")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId) {

        boolean duplicated = domainService.isDuplicatedId(domainId);
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param request   요청
     * @param domainDTO 등록할 도메인정보
     * @return 등록된 도메인정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "도메인 등록")
    @PostMapping
    public ResponseEntity<?> postDomain(@ApiParam(hidden = true) HttpServletRequest request, @Valid DomainDTO domainDTO)
            throws InvalidDataException, Exception {

        // DomainDTO -> Domain 변환
        Domain domain = modelMapper.map(domainDTO, Domain.class);

        setHostAndPath(domain, domainDTO);

        try {
            // insert
            Domain returnValue = domainService.insertDomain(domain);
            purgeHelper.purgeTmsDomain(request);

            // 결과리턴
            DomainDTO dto = modelMapper.map(returnValue, DomainDTO.class);
            ResultDTO<DomainDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT DOMAIN]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.domain.error.save", request), e);
        }
    }

    /**
     * 수정
     *
     * @param request   요청
     * @param domainId  도메인아이디
     * @param domainDTO 수정할 도메인정보
     * @return 수정된 도메인정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "도메인 수정")
    @PutMapping("/{domainId}")
    public ResponseEntity<?> putDomain(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam("도메인 ID(필수)") @PathVariable("domainId")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId, @Valid DomainDTO domainDTO)
            throws Exception {

        // DomainDTO -> Domain 변환
        String infoMessage = msg("tps.domain.error.no-data", request);
        Domain newDomain = modelMapper.map(domainDTO, Domain.class);

        // 오리진 데이터 조회
        domainService
                .findDomainById(newDomain.getDomainId())
                .orElseThrow(() -> new NoDataException(infoMessage));

        setHostAndPath(newDomain, domainDTO);

        try {
            // update
            Domain returnValue = domainService.updateDomain(newDomain);
            purgeHelper.purgeTmsDomain(request);

            // 결과리턴
            DomainDTO dto = modelMapper.map(returnValue, DomainDTO.class);
            ResultDTO<DomainDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.update"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE DOMAIN]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.domain.error.save", request), e);
        }
    }

    /**
     * 관련아이템이 있는지 확인한다
     *
     * @param request  HTTP요청
     * @param domainId 도메인ID
     * @return 관련아이템 존재 여부
     * @throws NoDataException 데이터없음 예외처리
     */
    @ApiOperation(value = "도메인과 관련아이템 존재 여부 확인")
    @GetMapping("/{domainId}/has-relations")
    public ResponseEntity<?> hasRelations(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam("도메인 ID(필수)") @PathVariable("domainId")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId)
            throws NoDataException {

        String message = msg("tps.domain.error.no-data", request);
        domainService
                .findDomainById(domainId)
                .orElseThrow(() -> new NoDataException(message));

        // 관련 데이터 조회
        String related = relationService.isRelatedDomain(domainId);

        String msg = "";
        if (MokaConstants.ITEM_TEMPLATE.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.tp");
        }
        if (MokaConstants.ITEM_COMPONENT.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.cp");
        }
        if (MokaConstants.ITEM_CONTAINER.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.ct");
        }
        if (MokaConstants.ITEM_PAGE.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.pg");
        }
        if (MokaConstants.ITEM_ARTICLE_PAGE.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.ap");
        }
        if (MokaConstants.ITEM_AD.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.ad");
        }
        if (MokaConstants.ITEM_RESERVED.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.rs");
        }

        ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK, message);
        resultMapDTO.addBodyAttribute("related", McpString.isNotEmpty(related));
        resultMapDTO.addBodyAttribute("message", msg);
        return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
    }

    /**
     * 삭제
     *
     * @param request  요청
     * @param domainId 삭제 할 도메인아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 도메인 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "도메인 삭제")
    @DeleteMapping("/{domainId}")
    public ResponseEntity<?> deleteDomain(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam("도메인 ID(필수)") @PathVariable("domainId")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId)
            throws InvalidDataException, NoDataException, Exception {


        // 도메인 데이터 조회
        String noContentMessage = msg("tps.domain.error.no-data", request);
        Domain domain = domainService
                .findDomainById(domainId)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // 관련 데이터 조회
        try {
            String related = relationService.isRelatedDomain(domainId);
            if (McpString.isNotEmpty(related)) {
                // 액션 로그에 실패 로그 출력
                tpsLogger.fail(ActionType.DELETE, msg("tps.domain.error.delete.exist-related", request));
                throw new Exception(msg("tps.domain.error.delete.exist-related", request));
            }
        } catch (Exception ex) {
            // 액션 로그에 실패 로그 출력
            tpsLogger.fail(ActionType.DELETE, ex.toString());
            throw new Exception(msg("tps.domain.error.select.related", request));
        }

        try {
            // 삭제
            domainService.deleteDomain(domain);
            purgeHelper.purgeTmsDomain(request);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.common.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE DOMAIN] domainId: {} {}", domainId, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.domain.error.delete", request), e);
        }
    }



    private void setHostAndPath(Domain domain, DomainDTO domainDTO)
            throws InvalidDataException {
        if (!McpString.isNullOrEmpty(domainDTO.getApiCodeId())) {
            // apiCodeId -> apiHost, apiPath
            Map<String, String> apiInfo = apiCodeHelper.getDataApi(codeMgtService.findUseList(TpsConstants.DATAAPI), domainDTO.getApiCodeId());

            domain.setApiHost(apiInfo.get(TpsConstants.API_HOST));
            domain.setApiPath(apiInfo.get(TpsConstants.API_PATH));
        }
    }


    //    /**
    //     * 도메인 변경 시 TMS에 도메인이 변경되었다고 알려준다
    //     */
    //    private void loadCommandDomain() {
    ////        Map<String, Object> paramMap = new HashMap<String, Object>();
    ////        String targetUrl = String.join("/", tmsHost, TpsConstants.COMMAND_DOMAIN);
    ////        paramMap.put("load", "Y");
    ////        
    ////        try {
    ////            HttpProxy httpProxy = (HttpProxy) applicationContext.getBean(HttpProxyConfiguration.HTTP_PROXY);
    ////            String response = httpProxy.getString(targetUrl, paramMap, false);
    ////            
    ////            ResultDTO<?> resultDTO = ResourceMapper.getDefaultObjectMapper().readValue(response,
    ////                    new TypeReference<ResultDTO<?>>() {});
    ////            ResultHeaderDTO resultHeader = resultDTO.getHeader();
    ////            
    ////            if (!resultHeader.isSuccess()) {
    ////                logger.error("[FAIL TO LOAD TMS API] {}, {}", targetUrl, resultHeader.getMessage());
    ////            }
    ////            
    ////        } catch (Exception e) {
    ////            logger.error("[FAIL TO LOAD TMS API] {}", targetUrl, e);
    ////        }
    //        
    //    }
}
