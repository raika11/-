/**
 * msp-tps DatasetRestController.java 2020. 4. 24. 오후 4:24:44 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.proxy.autoConfig.HttpProxyConfiguration;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.ApiCodeHelper;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetDTO;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetSearchDTO;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.dataset.service.DatasetService;
import jmnet.moka.core.tps.mvc.dataset.vo.DatasetVO;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import jmnet.moka.core.tps.mvc.relation.service.RelationService;
import lombok.extern.slf4j.Slf4j;
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

/**
 * 데이타셋 API
 *
 * @author ssc
 * @since 2020. 4. 24. 오후 4:24:44
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/datasets")
@Api(tags = {"데이터셋 API"})
public class DatasetRestController extends AbstractCommonController {

    @Autowired
    private DatasetService datasetService;

    @Autowired
    private CodeMgtService codeMgtService;

    @Autowired
    private RelationService relationService;

    @Autowired
    private ApiCodeHelper apiCodeHelper;

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private PurgeHelper purgeHelper;

    /**
     * 데이타셋정보 목록조회
     *
     * @param search 검색조건
     * @return 데이타셋정보 목록
     * @throws InvalidDataException 검색조건오류
     */
    @ApiOperation(value = "데이타셋 목록조회")
    @GetMapping
    public ResponseEntity<?> getDatasetList(@Valid @SearchParam DatasetSearchDTO search)
            throws InvalidDataException {
        // apiCodeId -> apiHost, apiPath
        if (McpString.isNotEmpty(search.getApiCodeId())) {
            List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
            Map<String, String> apiInfo = apiCodeHelper.getDataApi(CodeMgts, search.getApiCodeId());
            search.setApiHost(apiInfo.get(TpsConstants.API_HOST));
            search.setApiPath(apiInfo.get(TpsConstants.API_PATH));
        }

        // 조회(mybatis)
        List<DatasetVO> returnValue = datasetService.findAllDataset(search);

        ResultListDTO<DatasetVO> resultList = new ResultListDTO<DatasetVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<DatasetVO>> resultModel = new ResultDTO<ResultListDTO<DatasetVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultModel, HttpStatus.OK);
    }

    /**
     * 데이타셋 상세조회
     *
     * @param datasetSeq 데이타셋정보순번 (필수)
     * @return 데이타셋정보
     * @throws Exception
     */
    @ApiOperation(value = "데이타셋 상세조회")
    @GetMapping("/{datasetSeq}")
    public ResponseEntity<?> getDataset(
            @ApiParam("데이타셋 일련번호(필수)") @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}") Long datasetSeq)
            throws Exception {

        Dataset dataset = datasetService
                .findDatasetBySeq(datasetSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        DatasetDTO dto = modelMapper.map(dataset, DatasetDTO.class);

        // apiHost, apiPath -> apiCodeId
        List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
        String apiCodeId = apiCodeHelper.getDataApiCode(CodeMgts, dto.getDataApiHost(), dto.getDataApiPath());
        if (apiCodeId != null) {
            dto.setApiCodeId(apiCodeId);
        }
        // 파라미터 구조정보 세팅
        if (McpString.isNotEmpty(dto.getDataApi())) {
            dto.setDataApiParamShape(getParameters(dto));
        }

        ResultDTO<DatasetDTO> resultDto = new ResultDTO<DatasetDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * DPS에서 API의 파라미터 구조 정보조회
     *
     * @param dto 데이타셋DTO
     * @return 파라미터 정보
     * @throws Exception 예외
     */
    private String getParameters(DatasetDTO dto)
            throws Exception {
        String targetUrl = String.join("/", dto.getDataApiHost(), TpsConstants.COMMAND_API);
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("apiPath", dto.getDataApiPath());
        paramMap.put("searchType", "id");
        paramMap.put("keyword", dto.getDataApi());
        // paramMap.put("page", String.valueOf(0));
        paramMap.put("size", String.valueOf(999));

        try {
            HttpProxy httpProxy = (HttpProxy) applicationContext.getBean(HttpProxyConfiguration.HTTP_PROXY);
            String response = httpProxy.getString(targetUrl, paramMap, false);

            ResultDTO<?> apiDto = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(response, new TypeReference<ResultDTO<?>>() {
                    });

            if (apiDto
                    .getHeader()
                    .getResultCode() == TpsConstants.HEADER_UNAUTHORIZED) {
                log.error("FAIL TO LOAD DATASET PARAMETER INFO : %s", targetUrl);
                throw new Exception(msg("tps.dataset.error.dps"));
            }

            String body = ResourceMapper
                    .getDefaultObjectMapper()
                    .writeValueAsString(apiDto.getBody());
            return body;
        } catch (Exception e) {
            log.error("FAIL TO LOAD DATASET PARAMETER INFO : %s", targetUrl, e);
            throw new Exception(msg("tps.dataset.error.dps"), e);
        }
    }


    /**
     * 데이타셋 등록
     *
     * @param datasetDTO 등록할 데이타셋정보
     * @return 등록된 데이타셋정보
     * @throws Exception
     */
    @ApiOperation(value = "데이타셋 등록")
    @PostMapping
    public ResponseEntity<?> postDataset(@Valid DatasetDTO datasetDTO)
            throws Exception {

        Dataset dataset = modelMapper.map(datasetDTO, Dataset.class);

        try {
            // apiCodeId -> apiHost, apiPath
            if (McpString.isEmpty(dataset.getDataApiHost()) && McpString.isEmpty(dataset.getDataApiPath())) {
                List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
                Map<String, String> apiInfo = apiCodeHelper.getDataApi(CodeMgts, datasetDTO.getApiCodeId());
                dataset.setDataApiHost(apiInfo.get(TpsConstants.API_HOST));
                dataset.setDataApiPath(apiInfo.get(TpsConstants.API_PATH));
            }

            if (datasetDTO
                    .getAutoCreateYn()
                    .equals("N")) {
                dataset.setDataApi(null);
                dataset.setDataApiParam(null);
            }

            // 등록
            Dataset returnValue = datasetService.insertDataset(dataset);

            // 결과리턴
            DatasetDTO dto = modelMapper.map(returnValue, DatasetDTO.class);
            dto.setApiCodeId(datasetDTO.getApiCodeId());
            // 파라미터 구조정보 세팅
            if (McpString.isNotEmpty(dto.getDataApi())) {
                dto.setDataApiParamShape(getParameters(dto));
            }

            String message = msg("tps.common.success.insert");
            ResultDTO<DatasetDTO> resultDto = new ResultDTO<DatasetDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT DATASET]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT DATASET]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * 데이타셋정보 유효성 검사
     *
     * @param datasetSeq 데이타셋순번
     * @param datasetDTO 데이타셋정보
     * @return 유효하지 않은 필드목록(invalidDataDTO)
     * @throws InvalidDataException
     */
    private void validData(Long datasetSeq, DatasetDTO datasetDTO)
            throws InvalidDataException {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (datasetDTO != null) {
            if (!datasetSeq.equals(datasetDTO.getDatasetSeq())) {
                String message = msg("tps.common.error.no-data");
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // if("N".equals(datasetDTO.getAutoCreateYn()) && ){
            //
            // }
        }

        if (invalidList.size() > 0) {
            String validMessage = msg("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 데이타셋 수정
     *
     * @param datasetSeq 순번
     * @param datasetDTO 수정할 데이타셋정보
     * @return 수정된 데이타셋정보
     * @throws Exception
     */
    @ApiOperation(value = "데이타셋 수정")
    @PutMapping("/{datasetSeq}")
    public ResponseEntity<?> putDataset(
            @ApiParam("데이타셋 일련번호(필수)") @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}") Long datasetSeq,
            @Valid DatasetDTO datasetDTO)
            throws Exception {

        // 데이타유효성검사
        validData(datasetSeq, datasetDTO);

        Dataset newDataset = modelMapper.map(datasetDTO, Dataset.class);

        try {
            // apiCodeId -> apiHost, apiPath
            List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
            Map<String, String> apiInfo = apiCodeHelper.getDataApi(CodeMgts, datasetDTO.getApiCodeId());

            Dataset orgDataset = datasetService
                    .findDatasetBySeq(newDataset.getDatasetSeq())
                    .orElseThrow(() -> {
                        String message = msg("tps.common.error.no-data");
                        tpsLogger.fail(ActionType.UPDATE, message, true);
                        return new NoDataException(message);
                    });

            newDataset.setDataApiHost(apiInfo.get(TpsConstants.API_HOST));
            newDataset.setDataApiPath(apiInfo.get(TpsConstants.API_PATH));
            if (newDataset
                    .getAutoCreateYn()
                    .equals("N")) {
                newDataset.setDataApi(null);
                ;
                newDataset.setDataApiParam(null);
            }

            // 수정
            Dataset returnValue = datasetService.updateDataset(newDataset);

            // 결과리턴
            DatasetDTO dto = modelMapper.map(returnValue, DatasetDTO.class);
            dto.setApiCodeId(datasetDTO.getApiCodeId());
            // 파라미터 구조정보 세팅
            if (McpString.isNotEmpty(dto.getDataApi())) {
                dto.setDataApiParamShape(getParameters(dto));
            }

            // purge 날림!! 성공실패여부는 리턴하지 않는다.
            purge(dto);

            String message = msg("tps.common.success.update");
            ResultDTO<DatasetDTO> resultDto = new ResultDTO<DatasetDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE DATASET] seq: {} {}", datasetDTO.getDatasetSeq(), e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE DATASET]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }

    }

    /**
     * Dps API 목록 조회
     *
     * @param search 검색조건
     * @return API목록
     * @throws InvalidDataException 검색조건오류
     * @throws URISyntaxException
     * @throws IOException
     */
    @ApiOperation(value = "API 목록 조회")
    @GetMapping("/apis")
    public ResponseEntity<?> getApiList(@Valid @SearchParam DatasetSearchDTO search)
            throws Exception {

        // apiCodeId -> apiHost, apiPath
        List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
        Map<String, String> apiInfo = apiCodeHelper.getDataApi(CodeMgts, search.getApiCodeId());
        search.setApiHost(apiInfo.get(TpsConstants.API_HOST));
        search.setApiPath(apiInfo.get(TpsConstants.API_PATH));

        String targetUrl = String.join("/", apiInfo.get(TpsConstants.API_HOST), TpsConstants.COMMAND_API);
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("apiPath", apiInfo.get(TpsConstants.API_PATH));

        String searchType = search.getSearchType();
        String keyword = search.getKeyword();
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            paramMap.put("searchType", search.getSearchType());
            paramMap.put("keyword", search.getKeyword());
        }
        if (search.getPage() > 0) {
            paramMap.put("page", String.valueOf(search.getPage() + 1));    // 1 base 페이징
        } else {
            paramMap.put("page", "1");
        }
        if (search.getSize() > 0) {
            paramMap.put("size", String.valueOf(search.getSize()));
        }

        try {
            HttpProxy httpProxy = (HttpProxy) applicationContext.getBean(HttpProxyConfiguration.HTTP_PROXY);
            String response = httpProxy.getString(targetUrl, paramMap, false);

            ResultDTO<?> dto = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(response, new TypeReference<ResultDTO<?>>() {
                    });

            if (dto
                    .getHeader()
                    .getResultCode() == TpsConstants.HEADER_UNAUTHORIZED) {
                String message = msg("tps.dataset.error.dps");
                ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(TpsConstants.HEADER_SERVER_ERROR, message);
                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            }
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD API LIST] : %s", targetUrl, e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD API LIST]", e, true);
            throw new Exception(msg("tps.dataset.error.dps"), e);
        }
    }

    /**
     * 데이타셋 삭제
     *
     * @param datasetSeq 삭제 할 데이타셋아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 도메인 없음
     */
    @ApiOperation(value = "데이타셋 삭제")
    @DeleteMapping("/{datasetSeq}")
    public ResponseEntity<?> deleteDataset(
            @ApiParam("데이타셋 일련번호(필수)") @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}") Long datasetSeq)
            throws Exception {

        // 1.1 아이디체크
        validData(datasetSeq, null);

        // 1.2. 데이타 존재여부 검사
        Dataset returnValue = datasetService
                .findDatasetBySeq(datasetSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        try {

            DatasetDTO dto = modelMapper.map(returnValue, DatasetDTO.class);

            // 1.3. 관련데이타가 있는지 조사.
            if (datasetService.isRelated(datasetSeq)) {
                String message = msg("tps.common.error.delete.related");
                ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(TpsConstants.HEADER_RELEATED_DATA, message);
                tpsLogger.fail(ActionType.DELETE, message, true);
                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            }

            // 2. 삭제
            datasetService.deleteDataset(datasetSeq);

            // purge 날림!!  성공실패여부는 리턴하지 않는다.
            purge(dto);

            // 3. 결과리턴
            String message = msg("tps.common.success.delete");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DELETE DATASET] seq: {} {}", datasetSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE DATASET]", e, true);
            throw new Exception(msg("tps.common.error.delete"), e);
        }
    }

    /**
     * 관련 아이템 존재여부
     *
     * @param datasetSeq 데이터셋SEQ
     * @return 관련 아이템 존재 여부
     * @throws NoDataException 데이터없음
     * @throws Exception       관련아이템 조회 에러
     */
    @ApiOperation(value = "관련 아이템 존재여부")
    @GetMapping("/{datasetSeq}/has-relations")
    public ResponseEntity<?> hasRelationList(@ApiParam("데이타셋 일련번호(필수)") @PathVariable("datasetSeq")
    @Min(value = 0, message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq)
            throws Exception {

        // 데이타셋 확인
        datasetService
                .findDatasetBySeq(datasetSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        try {
            Boolean chkRels = relationService.hasRelations(datasetSeq, MokaConstants.ITEM_DATASET);

            String message = "";
            if (chkRels) {
                message = msg("tps.common.success.has-relations");
            }
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[DATASET RELATION EXISTENCE CHECK FAILED] seq: {} {}", datasetSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[DATASET RELATION EXISTENCE CHECK FAILEDE]", e, true);
            throw new Exception(msg("tps.common.error.has-relation"), e);
        }
    }

    /**
     * 데이타셋 복사
     *
     * @param datasetSeq  데이터셋ID
     * @param datasetName 데이터셋명
     * @return 등록된 컴포넌트
     * @throws InvalidDataException 데이터없음 예외처리
     * @throws Exception            그외 예외
     */
    @ApiOperation(value = "데이타셋 복사")
    @PostMapping("/{datasetSeq}/copy")
    public ResponseEntity<?> copyDataset(@ApiParam("데이타셋 일련번호(필수)") @PathVariable("datasetSeq") Long datasetSeq,
            @ApiParam("데이타셋명") String datasetName)
            throws InvalidDataException, Exception {

        // 조회
        Dataset dataset = datasetService
                .findDatasetBySeq(datasetSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.INSERT, message, true);
                    return new NoDataException(message);
                });

        DatasetDTO dto = modelMapper.map(dataset, DatasetDTO.class);
        dto.setDatasetSeq(null);
        dto.setDatasetName(datasetName);

        return this.postDataset(dto);
    }

    /**
     * tms서버의 데이타셋정보를 갱신한다. 해당 데이타셋과 관련된 fileYn=Y인 페이지도 갱신한다.
     *
     * @param returnValDTO 데이타셋정보
     * @return 갱신오류메세지
     * @throws DataLoadException
     * @throws TemplateMergeException
     * @throws TemplateParseException
     * @throws NoDataException
     */
    private String purge(DatasetDTO returnValDTO)
            throws DataLoadException, TemplateMergeException, TemplateParseException, NoDataException {

        // 1. 데이타셋 tms purge
        String returnValue = "";
        String retDataset = purgeHelper.tmsPurge(Collections.singletonList(returnValDTO.toDatasetItem()));
        if (McpString.isNotEmpty(retDataset)) {
            log.error("[FAIL TO PURGE DATASET] seq: {} {}", returnValDTO.getDatasetSeq(), retDataset);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO PURGE DATASET]", true);
            returnValue = String.join("\r\n", retDataset);
        }

        // 2. fileYn=Y인 관련페이지 tms pageUpdate
        RelationSearchDTO search = RelationSearchDTO
                .builder()
                .fileYn(MokaConstants.YES)
                .relSeq(returnValDTO.getDatasetSeq())
                .relSeqType(MokaConstants.ITEM_DATASET)
                .relType(MokaConstants.ITEM_PAGE)
                .build();
        List<PageVO> pageList = relationService.findAllPage(search);
        String retPage = purgeHelper.tmsPageUpdate(pageList);
        if (McpString.isNotEmpty(retPage)) {
            log.error("[FAIL TO PAGE UPATE] datasetSeq: {} {}", returnValDTO.getDatasetSeq(), retPage);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO PAGE UPATE]", true);
            returnValue = String.join("\r\n", retPage);
        }

        return returnValue;
    }
}
