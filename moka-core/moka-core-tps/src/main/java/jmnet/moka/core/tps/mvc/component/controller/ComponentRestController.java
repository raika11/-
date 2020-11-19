package jmnet.moka.core.tps.mvc.component.controller;

import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.dto.ValidList;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.component.dto.ComponentDTO;
import jmnet.moka.core.tps.mvc.component.dto.ComponentHistDTO;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.component.service.ComponentHistService;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetDTO;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.relation.service.RelationService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 컴포넌트 API
 */
@Controller
@Validated
@Slf4j
@RequestMapping("/api/components")
public class ComponentRestController {
    @Autowired
    private ComponentService componentService;

    @Autowired
    private ComponentHistService componentHistService;

    @Autowired
    private RelationService relationService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private PurgeHelper purgeHelper;

    @Autowired
    private TpsLogger tpsLogger;

    /**
     * 컴포넌트 목록조회
     *
     * @param search 검색 조건
     * @return 컴포넌트 목록
     */
    @ApiOperation(value = "컴포넌트 목록조회")
    @GetMapping
    public ResponseEntity<?> getComponentList(@Valid @SearchParam ComponentSearchDTO search) {

        // 조회(mybatis)
        List<ComponentVO> returnValue = componentService.findAllComponent(search);

        ResultListDTO<ComponentVO> resultList = new ResultListDTO<ComponentVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<ComponentVO>> resultDTO = new ResultDTO<ResultListDTO<ComponentVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 컴포넌트 상세조회
     *
     * @param componentSeq 컴포넌트아이디
     * @return 컴포넌트
     * @throws Exception 예외
     */
    @ApiOperation(value = "컴포넌트 상세조회")
    @GetMapping("/{componentSeq}")
    public ResponseEntity<?> getComponent(
            @PathVariable("componentSeq") @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq)
            throws Exception {

        Component component = componentService.findComponentBySeq(componentSeq)
                                              .orElseThrow(() -> {
                                                  String message = messageByLocale.get("tps.common.error.no-data");
                                                  tpsLogger.fail(message, true);
                                                  return new NoDataException(message);
                                              });

        ComponentDTO componentDTO = modelMapper.map(component, ComponentDTO.class);

        try {
            componentDTO = this.setPrevDataset(componentDTO);

            ResultDTO<ComponentDTO> resultDTO = new ResultDTO<ComponentDTO>(componentDTO);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO SELECT COMPONENT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO SELECT COMPONENT]", e, true);
            throw new Exception(messageByLocale.get("tps.component.error.select"), e);
        }
    }

    /**
     * 컴포넌트 등록
     *
     * @param componentDTO 컴포넌트DTO
     * @return 등록된 컴포넌트
     * @throws InvalidDataException 데이터가 유효하지 않음
     * @throws NoDataException      데이터 없음
     * @throws Exception            그외 모든 예외
     */
    @ApiOperation(value = "컴포넌트 등록")
    @PostMapping
    public ResponseEntity<?> postComponent(@RequestBody @Valid ComponentDTO componentDTO)
            throws InvalidDataException, NoDataException, Exception {

        // 데이터 유효성 검사
        validData(componentDTO, ActionType.INSERT);

        if (componentDTO.getDataset() != null && componentDTO.getDataset()
                                                             .getDatasetSeq() == null) {
            componentDTO.setDataset(null);
        }

        Component component = modelMapper.map(componentDTO, Component.class);

        try {
            // 등록
            Component returnVal = componentService.insertComponent(component);

            ComponentDTO returnValDTO = modelMapper.map(returnVal, ComponentDTO.class);
            returnValDTO = this.setPrevDataset(returnValDTO);

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<ComponentDTO> resultDTO = new ResultDTO<ComponentDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT COMPONENT]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT COMPONENT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.insert"), e);
        }
    }

    /**
     * 여러개의 컴포넌트를 한번에 등록한다
     *
     * @param validList 컴포넌트 목록
     * @return 등록된 컴포넌트
     * @throws InvalidDataException 데이터가 유효하지 않음
     * @throws Exception            에러
     */
    @ApiOperation(value = "컴포넌트 멀티등록")
    @PostMapping("/all")
    public ResponseEntity<?> postAllComponent(@Valid @RequestBody ValidList<ComponentDTO> validList)
            throws InvalidDataException, Exception {

        // 컴포넌트 목록 가져옴
        List<ComponentDTO> componentDTOs = validList.getList();

        // 데이터 유효성 검사
        for (ComponentDTO componentDTO : componentDTOs) {
            validData(componentDTO, ActionType.INSERT);
        }

        List<Component> components = modelMapper.map(componentDTOs, Component.TYPE);

        try {
            // 한번에 등록한다
            List<Component> returnVal = componentService.insertComponents(components);
            List<ComponentDTO> returnValDTO = modelMapper.map(returnVal, ComponentDTO.TYPE);

            // 리턴 DTO 생성
            ResultListDTO<ComponentDTO> resultList = new ResultListDTO<ComponentDTO>();
            resultList.setList(returnValDTO);
            resultList.setTotalCnt(returnValDTO.size());

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<ResultListDTO<ComponentDTO>> resultDTO = new ResultDTO<ResultListDTO<ComponentDTO>>(resultList, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT COMPONENT]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT COMPONENT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.insert"), e);
        }
    }

    /**
     * 컴포넌트 수정
     *
     * @param componentSeq 컴포넌트아이디
     * @param componentDTO 수정할 컴포넌트DTO
     * @return 수정된 컴포넌트DTO
     * @throws NoDataException      데이터없음
     * @throws InvalidDataException 데이터가 유효하지 않음
     * @throws Exception            나머지 에러
     */
    @ApiOperation(value = "컴포넌트 수정")
    @PutMapping("/{componentSeq}")
    public ResponseEntity<?> putComponent(
            @PathVariable("componentSeq") @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq,
            @Valid @RequestBody ComponentDTO componentDTO)
            throws NoDataException, InvalidDataException, Exception {

        // 데이터 유효성 검사
        validData(componentDTO, ActionType.UPDATE);

        // 원래 데이터 조회
        Component orgComponent = componentService.findComponentBySeq(componentSeq)
                                                 .orElseThrow(() -> {
                                                     String message = messageByLocale.get("tps.common.error.no-data");
                                                     tpsLogger.fail(ActionType.UPDATE, message, true);
                                                     return new NoDataException(message);
                                                 });

        if (componentDTO.getDataset() != null && componentDTO.getDataset()
                                                             .getDatasetSeq() == null) {
            componentDTO.setDataset(null);
        }

        try {
            // 업데이트
            Component newComponent = modelMapper.map(componentDTO, Component.class);

            Component returnVal = componentService.updateComponent(newComponent, orgComponent);
            ComponentDTO returnValDTO = modelMapper.map(returnVal, ComponentDTO.class);
            returnValDTO = this.setPrevDataset(returnValDTO);

            // purge 날림!!!!
            purgeHelper.purgeTms(returnVal.getDomain()
                                          .getDomainId(), MokaConstants.ITEM_COMPONENT, returnVal.getComponentSeq());

            // 리턴
            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<ComponentDTO> resultDTO = new ResultDTO<ComponentDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE COMPONENT] seq: {} {}", componentDTO.getComponentSeq(), e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE COMPONENT]", e, true);
            throw new Exception(messageByLocale.get("tps.coommon.error.update"), e);
        }
    }

    /**
     * 컴포넌트 복사
     *
     * @param componentSeq  컴포넌트SEQ
     * @param componentName 컴포넌트명
     * @return 등록된 컴포넌트
     * @throws InvalidDataException 데이터없음 예외처리
     * @throws Exception            그외 예외
     */
    @ApiOperation(value = "컴포넌트 복사")
    @PostMapping("/{componentSeq}/copy")
    public ResponseEntity<?> copyComponent(
            @PathVariable("componentSeq") @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq, String componentName)
            throws InvalidDataException, Exception {

        // 조회
        Component component = componentService.findComponentBySeq(componentSeq)
                                              .orElseThrow(() -> {
                                                  String message = messageByLocale.get("tps.component.error.no-data");
                                                  tpsLogger.fail(ActionType.INSERT, message, true);
                                                  return new NoDataException(message);
                                              });

        ComponentDTO componentDTO = modelMapper.map(component, ComponentDTO.class);
        // 수동형 데이터셋이면 새 데이터셋을 생성하게끔 null로 바꿔줌
        if (componentDTO.getDataType()
                        .equals(TpsConstants.DATATYPE_DESK)) {
            componentDTO.setDataset(null);
        }
        componentDTO.setComponentSeq(null);
        componentDTO.setComponentName(componentName);

        return this.postComponent(componentDTO);
    }

    /**
     * 히스토리에서 데이터타입이 수동/자동인 최신 데이터의 데이터셋을 찾아서 넣는다 (프론트에서 개발할때 필요함)
     *
     * @param componentDTO 컴포넌트DTO
     * @return 컴포넌트DTO
     */
    private ComponentDTO setPrevDataset(ComponentDTO componentDTO) {
        Long componentSeq = componentDTO.getComponentSeq();

        // 히스토리에서 데스크 데이터셋 찾아서 셋팅
        try {
            List<ComponentHist> deskHistory = componentHistService.findLastHist(componentSeq, TpsConstants.DATATYPE_DESK);
            if (deskHistory.size() > 0) {
                Dataset deskDataset = deskHistory.get(0)
                                                 .getDataset();
                if (deskDataset != null) {
                    componentDTO.setPrevDeskDataset(modelMapper.map(deskDataset, DatasetDTO.class));
                }
            }
        } catch (Exception e) {
            log.error("[COMPONENT HISTORY LOAD FAIL] seq: {} {}", componentDTO.getComponentSeq(), e.getMessage());
        }

        // 히스토리에서 자동 데이터셋 찾아서 셋팅
        try {
            List<ComponentHist> autoHistory = componentHistService.findLastHist(componentSeq, TpsConstants.DATATYPE_AUTO);
            if (autoHistory.size() > 0) {
                Dataset autoDataset = autoHistory.get(0)
                                                 .getDataset();
                if (autoDataset != null) {
                    componentDTO.setPrevAutoDataset(modelMapper.map(autoDataset, DatasetDTO.class));
                }
            }
        } catch (Exception e) {
            log.error("[COMPONENT HISTORY LOAD FAIL] seq: {} {}", componentDTO.getComponentSeq(), e.getMessage());
        }

        return componentDTO;
    }

    /**
     * 컴포넌트 삭제
     *
     * @param componentSeq 컴포넌트아이디
     * @return 삭제 여부
     * @throws NoDataException 데이터없음
     * @throws Exception       관련아이템 있으면 삭제 불가능
     */
    @ApiOperation(value = "컴포넌트 삭제")
    @DeleteMapping("/{componentSeq}")
    public ResponseEntity<?> deleteComponent(
            @PathVariable("componentSeq") @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq)
            throws NoDataException, Exception {

        // 데이타 확인
        Component component = componentService.findComponentBySeq(componentSeq)
                                              .orElseThrow(() -> {
                                                  String message = messageByLocale.get("tps.common.error.no-data");
                                                  tpsLogger.fail(ActionType.DELETE, message, true);
                                                  return new NoDataException(message);
                                              });

        // 관련아이템 확인
        Boolean hasRels = relationService.hasRelations(componentSeq, MokaConstants.ITEM_COMPONENT);
        if (hasRels) {
            String relMessage = messageByLocale.get("tps.common.error.delete.related");
            tpsLogger.fail(ActionType.DELETE, relMessage, true);
            throw new Exception(relMessage);
        }

        try {
            // 컴포넌트 삭제
            componentService.deleteComponent(component);

            String message = messageByLocale.get("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE COMPONENT] seq: {} {}", componentSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE COMPONENT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.delete"), e);
        }
    }

    /**
     * 컴포넌트 히스토리 목록조회
     *
     * @param search       검색조건
     * @param componentSeq 컴포넌트SEQ
     * @return 히스토리 목록
     */
    @ApiOperation(value = "컴포넌트 히스토리 목록조회")
    @GetMapping("/{componentSeq}/histories")
    public ResponseEntity<?> getHistoryList(@Valid @SearchParam SearchDTO search,
            @PathVariable("componentSeq") @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq) {

        // 페이징조건 설정 (order by seq desc)
        List<String> sort = new ArrayList<String>();
        sort.add("seq,desc");
        search.setSort(sort);
        Pageable pageable = search.getPageable();

        // 히스토리 목록 조회
        Page<ComponentHist> returnVal = componentHistService.findAllComponentHist(componentSeq, pageable);

        // entity -> DTO
        List<ComponentHistDTO> returnValDTO = modelMapper.map(returnVal.getContent(), ComponentHistDTO.TYPE);

        // 리턴 DTO 생성
        ResultListDTO<ComponentHistDTO> resultList = new ResultListDTO<ComponentHistDTO>();
        resultList.setList(returnValDTO);
        resultList.setTotalCnt(returnValDTO.size());

        ResultDTO<ResultListDTO<ComponentHistDTO>> resultDTO = new ResultDTO<ResultListDTO<ComponentHistDTO>>(resultList);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 관련 아이템 존재여부
     *
     * @param componentSeq 컴포넌트SEQ
     * @return 관련 아이템 존재 여부
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "관련 아이템 존재여부")
    @GetMapping("/{componentSeq}/has-relations")
    public ResponseEntity<?> hasRelationList(
            @PathVariable("componentSeq") @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq)
            throws Exception {

        // 컴포넌트 확인
        componentService.findComponentBySeq(componentSeq)
                        .orElseThrow(() -> {
                            String message = messageByLocale.get("tps.common.error.no-data");
                            tpsLogger.fail(ActionType.SELECT, message, true);
                            return new NoDataException(message);
                        });

        try {
            Boolean chkRels = relationService.hasRelations(componentSeq, MokaConstants.ITEM_COMPONENT);

            String message = "";
            if (chkRels) {
                message = messageByLocale.get("tps.common.success.has-relations");
            }
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[COMPONENT RELATION EXISTENCE CHECK FAILED] seq: {} {}", componentSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[COMPONENT RELATION EXISTENCE CHECK FAILEDE]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.has-relation"), e);
        }
    }

    /**
     * 컴포넌트 데이터 유효성 검사
     *
     * @param component  컴포넌트정보
     * @param actionType 작업구분(INSERT OR UPDATE)
     * @return
     */
    private void validData(ComponentDTO component, ActionType actionType)
            throws InvalidDataException {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (component != null) {
            // dataType이 AUTO 일 때는 반드시 dataseq가 존재
            if (component.getDataType()
                         .equals("AUTO")) {
                if (component.getDataset() == null) {
                    String message = messageByLocale.get("tps.dataset.error.notnull.datasetSeq");
                    invalidList.add(new InvalidDataDTO("dataset", message));
                    tpsLogger.fail(actionType, message, true);
                }
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }
}
