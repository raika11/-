/**
 * msp-tps DatasetRestController.java 2020. 4. 24. 오후 4:24:44 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;

import jmnet.moka.core.common.MokaConstants;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
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

import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.proxy.autoConfig.HttpProxyConfiguration;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.ApiCodeHelper;
import jmnet.moka.core.tps.helper.RelationHelper;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetDTO;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetSearchDTO;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.dataset.service.DatasetService;
import jmnet.moka.core.tps.mvc.dataset.vo.DatasetVO;
import jmnet.moka.core.tps.mvc.codeMgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codeMgt.service.CodeMgtService;

/**
 * <pre>
 * 
 * 2020. 4. 24. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 24. 오후 4:24:44
 * @author ssc
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/datasets")
public class DatasetRestController {

    @Autowired
    private DatasetService datasetService;

    @Autowired
    private CodeMgtService codeMgtService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private ApiCodeHelper apiCodeHelper;

    @Autowired
    private RelationHelper relationHelper;

    @Autowired
    private ApplicationContext applicationContext;

    /**
     * 데이타셋정보 목록조회
     * 
     * @param request 요청
     * @param search 검색조건
     * @return 데이타셋정보 목록
     * @throws InvalidDataException 검색조건오류
     */
    @GetMapping
    public ResponseEntity<?> getDatasetList(HttpServletRequest request,
            @Valid @SearchParam DatasetSearchDTO search) throws InvalidDataException {
        // 페이징조건 설정
        // Pageable pageable = search.getPageable();

        // apiCodeId -> apiHost, apiPath
        if (McpString.isNotEmpty(search.getApiCodeId())) {
            List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
            Map<String, String> apiInfo =
                    apiCodeHelper.getDataApi(request, CodeMgts, search.getApiCodeId());
            search.setApiHost(apiInfo.get(TpsConstants.API_HOST));
            search.setApiPath(apiInfo.get(TpsConstants.API_PATH));
        }

        // 리턴값 설정
        ResultListDTO<DatasetVO> resultListMessage = new ResultListDTO<DatasetVO>();

        // 조회(mybatis)
        Long totalCount = datasetService.findListCount(search);
        resultListMessage.setTotalCnt(totalCount);

        List<DatasetVO> returnValue = datasetService.findList(search);
        resultListMessage.setList(returnValue);

        ResultDTO<ResultListDTO<DatasetVO>> resultModel =
                new ResultDTO<ResultListDTO<DatasetVO>>(resultListMessage);

        return new ResponseEntity<>(resultModel, HttpStatus.OK);
    }



    /**
     * 데이타셋정보 조회
     * 
     * @param request 요청
     * @param datasetSeq 데이타셋정보순번 (필수)
     * @return 데이타셋정보
     * @throws Exception
     */
    @GetMapping("/{datasetSeq}")
    public ResponseEntity<?> getDataset(HttpServletRequest request,
            @PathVariable("datasetSeq") @Min(value = 0,
                    message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq)
            throws Exception {

        Dataset dataset =
                datasetService.findByDatasetSeq(datasetSeq).orElseThrow(() -> new NoDataException(
                        messageByLocale.get("tps.dataset.error.noContent", request)));

        DatasetDTO dto = modelMapper.map(dataset, DatasetDTO.class);

        // apiHost, apiPath -> apiCodeId
        List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
        String apiCodeId =
                apiCodeHelper.getDataApiCode(CodeMgts, dto.getDataApiHost(), dto.getDataApiPath());
        if (apiCodeId != null) {
            dto.setApiCodeId(apiCodeId);
        }
        // 파라미터 구조정보 세팅
        if (McpString.isNotEmpty(dto.getDataApi())) {
            dto.setDataApiParamShape(getParameters(request, dto));
        }

        ResultDTO<DatasetDTO> resultDto = new ResultDTO<DatasetDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    private String getParameters(HttpServletRequest request, DatasetDTO dto) throws Exception {
        String targetUrl = String.join("/", dto.getDataApiHost(), TpsConstants.COMMAND_API);
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("apiPath", dto.getDataApiPath());
        paramMap.put("searchType", "id");
        paramMap.put("keyword", dto.getDataApi());
        // paramMap.put("page", String.valueOf(0));
        paramMap.put("size", String.valueOf(999));

        try {
            HttpProxy httpProxy =
                    (HttpProxy) applicationContext.getBean(HttpProxyConfiguration.HTTP_PROXY);
            String response = httpProxy.getString(targetUrl, paramMap, false);

            ResultDTO<?> apiDto = ResourceMapper.getDefaultObjectMapper().readValue(response,
                    new TypeReference<ResultDTO<?>>() {});

            if (apiDto.getHeader().getResultCode() == TpsConstants.HEADER_UNAUTHORIZED) {
                log.error("Fail to load Dataset Parameter Info : %s", targetUrl);
                throw new Exception(messageByLocale.get("tps.dataset.error.dps", request));
            }

            String body =
                    ResourceMapper.getDefaultObjectMapper().writeValueAsString(apiDto.getBody());
            return body;
        } catch (Exception e) {
            log.error("Fail to load Dataset Parameter Info : %s", targetUrl, e);
            throw new Exception(messageByLocale.get("tps.dataset.error.dps", request), e);
        }
    }


    /**
     * 데이타셋등록
     * 
     * @param request 요청
     * @param datasetDTO 등록할 데이타셋정보
     * @param principal 로그인사용자 세션
     * @return 등록된 데이타셋정보
     * @throws Exception 
     */
    @PostMapping
    public ResponseEntity<?> postDataset(HttpServletRequest request, @Valid DatasetDTO datasetDTO,
            Principal principal) throws Exception {

        // 등록
        Dataset dataset = modelMapper.map(datasetDTO, Dataset.class);

        dataset.setRegId(principal.getName());

        // apiCodeId -> apiHost, apiPath
        if (McpString.isEmpty(dataset.getDataApiHost())
                && McpString.isEmpty(dataset.getDataApiPath())) {
            List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
            Map<String, String> apiInfo =
                    apiCodeHelper.getDataApi(request, CodeMgts, datasetDTO.getApiCodeId());
            dataset.setDataApiHost(apiInfo.get(TpsConstants.API_HOST));
            dataset.setDataApiPath(apiInfo.get(TpsConstants.API_PATH));
        }

        if (datasetDTO.getAutoCreateYn().equals("N")) {
            dataset.setDataApi(null);
            dataset.setDataApiParam(null);
        }

        Dataset returnValue = datasetService.insertDataset(dataset);

        // 결과리턴
        DatasetDTO dto = modelMapper.map(returnValue, DatasetDTO.class);
        dto.setApiCodeId(datasetDTO.getApiCodeId());
        // 파라미터 구조정보 세팅
        if (McpString.isNotEmpty(dto.getDataApi())) {
            dto.setDataApiParamShape(getParameters(request, dto));
        }
        
        ResultDTO<DatasetDTO> resultDto = new ResultDTO<DatasetDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 데이타셋정보 유효성 검사
     * 
     * @param request 요청
     * @param datasetSeq 데이타셋순번
     * @param datasetDTO 데이타셋정보
     * @return 유효하지 않은 필드목록(invalidDataDTO)
     * @throws InvalidDataException
     */
    private void validData(HttpServletRequest request, Long datasetSeq, DatasetDTO datasetDTO)
            throws InvalidDataException {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (datasetDTO != null) {
            if (!datasetSeq.equals(datasetDTO.getDatasetSeq())) {
                String message = messageByLocale.get("tps.common.error.invalid.matchId", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // if("N".equals(datasetDTO.getAutoCreateYn()) && ){
            //
            // }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.dataset.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 데이타셋수정
     * 
     * @param datasetSeq 요청
     * @param datasetDTO 수정할 데이타셋정보
     * @param principal 로그인사용자세션
     * @return 수정된 데이타셋정보
     * @throws Exception 
     */
    @PutMapping("/{seq}")
    public ResponseEntity<?> putDataset(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq,
            @Valid DatasetDTO datasetDTO, Principal principal)
            throws Exception {

        // apiCodeId -> apiHost, apiPath
        List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
        Map<String, String> apiInfo =
                apiCodeHelper.getDataApi(request, CodeMgts, datasetDTO.getApiCodeId());

        // 데이타유효성검사
        validData(request, datasetSeq, datasetDTO);

        // 수정
        Dataset newDataset = modelMapper.map(datasetDTO, Dataset.class);
        Dataset orgDataset = datasetService.findByDatasetSeq(newDataset.getDatasetSeq())
                .orElseThrow(() -> new NoDataException(
                        messageByLocale.get("tps.dataset.error.noContent", request)));

        newDataset.setRegDt(orgDataset.getRegDt());
        newDataset.setRegId(orgDataset.getRegId());
        newDataset.setModDt(McpDate.now());
        newDataset.setModId(principal.getName());
        newDataset.setDataApiHost(apiInfo.get(TpsConstants.API_HOST));
        newDataset.setDataApiPath(apiInfo.get(TpsConstants.API_PATH));
        if (newDataset.getAutoCreateYn().equals("N")) {
            newDataset.setDataApi(null);;
            newDataset.setDataApiParam(null);
        }
        Dataset returnValue = datasetService.updateDataset(newDataset);

        // 결과리턴
        DatasetDTO dto = modelMapper.map(returnValue, DatasetDTO.class);
        dto.setApiCodeId(datasetDTO.getApiCodeId());
        // 파라미터 구조정보 세팅
        if (McpString.isNotEmpty(dto.getDataApi())) {
            dto.setDataApiParamShape(getParameters(request, dto));
        }
        
        ResultDTO<DatasetDTO> resultDto = new ResultDTO<DatasetDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * Dps API 목록 조회
     * 
     * @param request 요청
     * @param search 검색조건
     * @return API목록
     * @throws InvalidDataException 검색조건오류
     * @throws URISyntaxException
     * @throws IOException
     */
    @GetMapping("/apis")
    public ResponseEntity<?> getApiList(HttpServletRequest request,
            @Valid @SearchParam DatasetSearchDTO search)
            throws InvalidDataException, IOException, URISyntaxException, Exception {

        // apiCodeId -> apiHost, apiPath
        List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
        Map<String, String> apiInfo =
                apiCodeHelper.getDataApi(request, CodeMgts, search.getApiCodeId());
        search.setApiHost(apiInfo.get(TpsConstants.API_HOST));
        search.setApiPath(apiInfo.get(TpsConstants.API_PATH));

        String targetUrl =
                String.join("/", apiInfo.get(TpsConstants.API_HOST), TpsConstants.COMMAND_API);
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("apiPath", apiInfo.get(TpsConstants.API_PATH));
        
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
        	paramMap.put("searchType", search.getSearchType());
            paramMap.put("keyword", search.getKeyword());
        }
        if (search.getPage() > 0) {
            paramMap.put("page", String.valueOf(search.getPage() + 1));	// 1 base 페이징
        } else {
            paramMap.put("page", "1");
        }
        if (search.getSize() > 0) {
            paramMap.put("size", String.valueOf(search.getSize()));
        }

        try {
            HttpProxy httpProxy =
                    (HttpProxy) applicationContext.getBean(HttpProxyConfiguration.HTTP_PROXY);
            String response = httpProxy.getString(targetUrl, paramMap, false);

            ResultDTO<?> dto = ResourceMapper.getDefaultObjectMapper().readValue(response,
                    new TypeReference<ResultDTO<?>>() {});

            if (dto.getHeader().getResultCode() == TpsConstants.HEADER_UNAUTHORIZED) {
                String message = messageByLocale.get("tps.dataset.error.dps", request);
                ResultDTO<Boolean> resultDto =
                        new ResultDTO<Boolean>(TpsConstants.HEADER_SERVER_ERROR, message);
                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Fail to load API list : %s", targetUrl, e);
            throw new Exception(messageByLocale.get("tps.dataset.error.dps", request), e);
        }
    }

    /**
     * 데이타셋삭제
     * 
     * @param request 요청
     * @param datasetSeq 삭제 할 데이타셋아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException 삭제 할 도메인 없음
     */
    @DeleteMapping("/{seq}")
    public ResponseEntity<?> deleteDomain(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq)
            throws InvalidDataException, NoDataException {

        /* 데이타유효성검사 */
        // 1.1 아이디체크
        validData(request, datasetSeq, null);

        // 1.2. 데이타 존재여부 검사
        datasetService.findByDatasetSeq(datasetSeq).orElseThrow(() -> new NoDataException(
                messageByLocale.get("tps.dataset.error.noContent", request)));

        // 1.3. 관련데이타가 있는지 조사.
        if (datasetService.isRelated(datasetSeq)) {
            String message = messageByLocale.get("tps.dataset.error.related", request);
            ResultDTO<Boolean> resultDto =
                    new ResultDTO<Boolean>(TpsConstants.HEADER_RELEATED_DATA, message);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        }

        // 2. 삭제
        datasetService.deleteDataset(datasetSeq);

        // 3. 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 관련아이템 목록조회
     * 
     * @param request 요청
     * @param datasetSeq 데이타순번
     * @param search 데이타의 관련아이템(페이지,본문,컨테이너,컴포넌트) 검색 조건
     * @return 관련아이템(페이지,본문,컨테이너,컴포넌트) 목록
     * @throws NoDataException 등록된 페이지 없음
     * @throws InvalidDataException 검색조건이 유효하지 않은 오류
     */
    @GetMapping("/{datasetSeq}/relations")
    public ResponseEntity<?> getRelationList(HttpServletRequest request,
            @PathVariable("datasetSeq") @Min(value = 0,
                    message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq,
            @Valid @SearchParam RelSearchDTO search) throws NoDataException, InvalidDataException {

        search.setRelSeq(datasetSeq);
        search.setRelSeqType(MokaConstants.ITEM_DATASET);

        return relationHelper.findRelations(search);
    }

    /**
     * <pre>
     * 관련 아이템이 있는지 확인한다
     * </pre>
     * 
     * @param request HTTP요청
     * @param datasetSeq 데이터셋 아이디
     * @return 관련 아이템 존재 여부
     * @throws NoDataException 데이터없음
     */
    @GetMapping("/{seq}/hasRelations")
    public ResponseEntity<?> hasRelations(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq)
            throws NoDataException {

        // 데이타 존재여부 검사
        datasetService.findByDatasetSeq(datasetSeq).orElseThrow(() -> new NoDataException(
                messageByLocale.get("tps.dataset.error.noContent", request)));

        Boolean chkRels = relationHelper.hasRelations(datasetSeq, MokaConstants.ITEM_DATASET);
        ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels);

        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 데이타셋을 복사한다
     * 
     * @param request HTTP요청
     * @param datasetSeq 데이터셋ID
     * @param datasetName 데이터셋명
     * @param principal Principal
     * @return 등록된 컴포넌트
     * @throws InvalidDataException 데이터없음 예외처리
     * @throws Exception 그외 예외
     */
    @PostMapping("/{seq}/copy")
    public ResponseEntity<?> copyDataset(HttpServletRequest request,
            @PathVariable("seq") Long datasetSeq, String datasetName, Principal principal)
            throws InvalidDataException, Exception {

        // 데이타 존재여부 검사
        Dataset dataset =
                datasetService.findByDatasetSeq(datasetSeq).orElseThrow(() -> new NoDataException(
                        messageByLocale.get("tps.dataset.error.noContent", request)));

        DatasetDTO dto = modelMapper.map(dataset, DatasetDTO.class);
        dto.setDatasetSeq(null);
        dto.setDatasetName(datasetName);

        return this.postDataset(request, dto, principal);
    }
}
