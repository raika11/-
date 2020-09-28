package jmnet.moka.core.tps.mvc.component.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;

import jmnet.moka.core.common.MokaConstants;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.common.dto.ValidList;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.helper.RelationHelper;
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

/**
 * 
 * <pre>
 * 컴포넌트 RestController
 * 2020. 4. 21. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 21. 오후 5:09:51
 * @author jeon
 */
@Controller
@Validated
@RequestMapping("/api/components")
public class ComponentRestController {
    private static final Logger logger = LoggerFactory.getLogger(ComponentRestController.class);

    @Autowired
    private ComponentService componentService;

    @Autowired
    private ComponentHistService componentHistService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private PurgeHelper purgeHelper;

    @Autowired
    private RelationHelper relationHelper;

    /**
     * 컴포넌트 목록을 조회한다
     * 
     * @param request HTTP 요청
     * @param search 검색 조건
     * @return 컴포넌트 목록
     */
    @GetMapping
    public ResponseEntity<?> getComponents(HttpServletRequest request,
            @Valid @SearchParam ComponentSearchDTO search) {

        // 조회(mybatis)
        Long totalCount = componentService.findListCount(search);
        List<ComponentVO> returnValue = componentService.findList(search);

        ResultListDTO<ComponentVO> resultList = new ResultListDTO<ComponentVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(totalCount);

        ResultDTO<ResultListDTO<ComponentVO>> resultDTO =
                new ResultDTO<ResultListDTO<ComponentVO>>(resultList);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 컴포넌트를 조회한다
     * 
     * @param request HTTP 요청
     * @param componentSeq 컴포넌트아이디
     * @return 컴포넌트
     * @throws NoDataException 데이터없음
     */
    @GetMapping("/{seq}")
    public ResponseEntity<?> getComponent(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.component.error.invalid.componentSeq}") Long componentSeq)
            throws NoDataException, Exception {

        String message = messageByLocale.get("tps.component.error.noContent", request);

        // 조회
        Component component = componentService.findByComponentSeq(componentSeq)
                .orElseThrow(() -> new NoDataException(message));

        ComponentDTO componentDTO = modelMapper.map(component, ComponentDTO.class);
        componentDTO = this.setPrevDataset(componentDTO);

        ResultDTO<ComponentDTO> resultDTO = new ResultDTO<ComponentDTO>(componentDTO);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 컴포넌트를 등록한다
     * 
     * @param request HTTP 요청
     * @param componentDTO 컴포넌트DTO
     * @param principal Principal
     * @return 등록된 컴포넌트
     * @throws InvalidDataException 데이터가 유효하지 않음
     * @throws NoDataException 데이터 없음
     * @throws Exception 그외 모든 예외
     */
    @PostMapping
    public ResponseEntity<?> postComponent(HttpServletRequest request,
            @RequestBody @Valid ComponentDTO componentDTO, Principal principal)
            throws InvalidDataException, NoDataException, Exception {

        // 데이터 유효성 검사
        List<InvalidDataDTO> invalidList = validData(componentDTO);
        if (invalidList.size() > 0) {
            String message = messageByLocale.get("tps.component.error.invalidContent", request);
            throw new InvalidDataException(invalidList, message);
        }

        try {
            // 등록
            Component component = modelMapper.map(componentDTO, Component.class);
            component.setCreateYmdt(McpDate.nowStr());
            component.setCreator(principal.getName());

            Component returnVal = componentService.insertComponent(component);
            ComponentDTO returnValDTO = modelMapper.map(returnVal, ComponentDTO.class);
            returnValDTO = this.setPrevDataset(returnValDTO);

            ResultDTO<ComponentDTO> resultDTO = new ResultDTO<ComponentDTO>(returnValDTO);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            logger.error("[COMPONENT INSERT FAIL]", e);
            throw new Exception(messageByLocale.get("tps.component.error.save", request), e);
        }
    }

    /**
     * <pre>
     * 여러개의 컴포넌트를 한번에 등록한다
     * </pre>
     * 
     * @param request HTTP요청
     * @param validList 컴포넌트 목록
     * @param principal Principal
     * @return 등록된 컴포넌트
     * @throws InvalidDataException 데이터가 유효하지 않음
     * @throws Exception 에러
     */
    @PostMapping("/all")
    public ResponseEntity<?> postAllComponent(HttpServletRequest request,
            @Valid @RequestBody ValidList<ComponentDTO> validList, Principal principal)
            throws InvalidDataException, Exception {

        // 컴포넌트 목록 가져옴
        List<ComponentDTO> componentDTOs = validList.getList();

        for (ComponentDTO componentDTO : componentDTOs) {
            // 데이터 유효성 검사
            List<InvalidDataDTO> invalidList = validData(componentDTO);
            if (invalidList.size() > 0) {
                String message = messageByLocale.get("tps.component.error.invalidContent", request);
                throw new InvalidDataException(invalidList, message);
            }
        }

        List<Component> components = modelMapper.map(componentDTOs, Component.TYPE);

        // 생성일자, 생성자 추가
        String createYmdt = McpDate.nowStr();
        for (Component component : components) {
            component.setCreator(principal.getName());
            component.setCreateYmdt(createYmdt);
        }

        try {
            // 한번에 등록한다
            List<Component> returnVal = componentService.insertComponents(components);
            List<ComponentDTO> returnValDTO = modelMapper.map(returnVal, ComponentDTO.TYPE);

            // 리턴 DTO 생성
            ResultListDTO<ComponentDTO> resultList = new ResultListDTO<ComponentDTO>();
            resultList.setList(returnValDTO);
            resultList.setTotalCnt(returnValDTO.size());

            ResultDTO<ResultListDTO<ComponentDTO>> resultDTO =
                    new ResultDTO<ResultListDTO<ComponentDTO>>(resultList);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            logger.error("[COMPONENT INSERT ALL FAIL]", e);
            throw new Exception(messageByLocale.get("tps.component.error.save", request), e);
        }
    }

    /**
     * 컴포넌트를 수정한다
     * 
     * @param request HTTP 요청
     * @param componentSeq 컴포넌트아이디
     * @param componentDTO 수정할 컴포넌트DTO
     * @param principal Principal
     * @return 수정된 컴포넌트DTO
     * @throws NoDataException 데이터없음
     * @throws InvalidDataException 데이터가 유효하지 않음
     * @throws Exception 나머지 에러
     */
    @PutMapping("/{seq}")
    public ResponseEntity<?> putComponent(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.component.error.invalid.componentSeq}") Long componentSeq,
            @Valid @RequestBody ComponentDTO componentDTO, Principal principal)
            throws NoDataException, InvalidDataException, Exception {

        // 데이터 유효성 검사
        List<InvalidDataDTO> invalidList = validData(componentDTO);
        if (invalidList.size() > 0) {
            String message = messageByLocale.get("tps.component.error.invalidContent", request);
            throw new InvalidDataException(invalidList, message);
        }

        // 원래 데이터 조회
        String message = messageByLocale.get("tps.component.error.noContent", request);
        Component orgComponent = componentService.findByComponentSeq(componentSeq)
                .orElseThrow(() -> new NoDataException(message));

        try {
            // 업데이트
            Component newComponent = modelMapper.map(componentDTO, Component.class);
            newComponent.setCreateYmdt(orgComponent.getCreateYmdt());
            newComponent.setCreator(orgComponent.getCreator());
            newComponent.setModifiedYmdt(McpDate.nowStr());
            newComponent.setModifier(principal.getName());

            Component returnVal = componentService.updateComponent(newComponent, orgComponent);
            ComponentDTO returnValDTO = modelMapper.map(returnVal, ComponentDTO.class);
            returnValDTO = this.setPrevDataset(returnValDTO);

            // purge 날림!!!!
            purgeHelper.purgeTms(request, returnVal.getDomain().getDomainId(),
                    MokaConstants.ITEM_COMPONENT, returnVal.getComponentSeq());

            // 리턴
            ResultDTO<ComponentDTO> resultDTO = new ResultDTO<ComponentDTO>(returnValDTO);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            logger.error("[COMPONENT UPDATE FAIL]", e);
            throw new Exception(messageByLocale.get("tps.component.error.save", request), e);
        }
    }

    /**
     * 컴포넌트를 복사한다
     * 
     * @param request HTTP요청
     * @param seq 컴포넌트ID
     * @param componentName 컴포넌트명
     * @param principal Principal
     * @return 등록된 컴포넌트
     * @throws InvalidDataException 데이터없음 예외처리
     * @throws Exception 그외 예외
     */
    @PostMapping("/{seq}/copy")
    public ResponseEntity<?> copyComponent(HttpServletRequest request,
            @PathVariable("seq") Long seq, String componentName, Principal principal)
            throws InvalidDataException, Exception {

        // 조회
        String message = messageByLocale.get("tps.component.error.noContent", request);
        Component component = componentService.findByComponentSeq(seq)
                .orElseThrow(() -> new NoDataException(message));

        ComponentDTO componentDTO = modelMapper.map(component, ComponentDTO.class);
        // 수동형 데이터셋이면 새 데이터셋을 생성하게끔 null로 바꿔줌
        if (componentDTO.getDataType().equals(TpsConstants.DATATYPE_DESK)) {
            componentDTO.setDataset(null);
        }
        componentDTO.setComponentSeq(null);
        componentDTO.setComponentName(componentName);

        return this.postComponent(request, componentDTO, principal);
    }

    /**
     * 히스토리에서 데이터타입이 수동/자동인 최신 데이터의 데이터셋을 찾아서 넣는다 (프론트에서 개발할때 필요함)
     * 
     * @param componentDTO 컴포넌트DTO
     * @return 컴포넌트DTO
     * @throws Exception 예외처리
     */
    private ComponentDTO setPrevDataset(ComponentDTO componentDTO) throws Exception {
        Long componentSeq = componentDTO.getComponentSeq();

        // 히스토리에서 데스크 데이터셋 찾아서 셋팅
        try {
            Optional<ComponentHist> deskHistory = componentHistService
                    .findOneByComponentSeqAndDataType(componentSeq, TpsConstants.DATATYPE_DESK);
            if (deskHistory.isPresent()) {
                Dataset deskDataset = deskHistory.get().getDataset();
                if (deskDataset != null) {
                    componentDTO.setPrevDeskDataset(modelMapper.map(deskDataset, DatasetDTO.class));
                }
            }
        } catch (Exception e) {
            logger.error("[COMPONENT HISTORY LOAD FAIL] seq: {}) {}",
                    componentDTO.getComponentSeq(), e.getMessage());
        }

        // 히스토리에서 자동 데이터셋 찾아서 셋팅
        try {
            Optional<ComponentHist> autoHistory = componentHistService
                    .findOneByComponentSeqAndDataType(componentSeq, TpsConstants.DATATYPE_AUTO);
            if (autoHistory.isPresent()) {
                Dataset autoDataset = autoHistory.get().getDataset();
                if (autoDataset != null) {
                    componentDTO.setPrevAutoDataset(modelMapper.map(autoDataset, DatasetDTO.class));
                }
            }
        } catch (Exception e) {
            logger.error("[COMPONENT HISTORY LOAD FAIL] seq: {}) {}",
                    componentDTO.getComponentSeq(), e.getMessage());
        }

        return componentDTO;
    }

    /**
     * <pre>
     * 컴포넌트를 삭제한다
     * </pre>
     * 
     * @param request HTTP요청
     * @param componentSeq 컴포넌트아이디
     * @return 삭제 여부
     * @throws NoDataException 데이터없음
     * @throws Exception 관련아이템 있으면 삭제 불가능
     */
    @DeleteMapping("/{seq}")
    public ResponseEntity<?> deleteComponent(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.component.error.invalid.componentSeq}") Long componentSeq)
            throws NoDataException, Exception {

        // 컴포넌트 확인
        String message = messageByLocale.get("tps.component.error.noContent", request);
        Component component = componentService.findByComponentSeq(componentSeq)
                .orElseThrow(() -> new NoDataException(message));

        // 관련아이템 확인
        Boolean hasRels = relationHelper.hasRelations(componentSeq, MokaConstants.ITEM_COMPONENT);
        String delErrorMsg = messageByLocale.get("tps.component.error.delete.related", request);
        if (hasRels) {
            throw new Exception(delErrorMsg);
        }

        try {
            // 컴포넌트 삭제
            componentService.deleteComponent(component);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("[COMPONENT DELETE FAIL] seq: {}) {}", componentSeq, e.getMessage());
            throw new Exception(messageByLocale.get("tps.component.error.delete", request), e);
        }
    }

    /**
     * <pre>
     * 컴포넌트 히스토리를 조회한다
     * </pre>
     * 
     * @param request HTTP요청
     * @param search 검색조건
     * @param seq 컴포넌트ID
     * @return 히스토리 목록
     */
    @GetMapping("/{seq}/histories")
    public ResponseEntity<?> getHistories(HttpServletRequest request,
            @Valid @SearchParam SearchDTO search, @PathVariable("seq") @Min(value = 0,
                    message = "{tps.component.error.invalid.componentSeq}") Long seq) {

        // 페이징조건 설정 (order by seq desc)
        List<String> sort = new ArrayList<String>();
        sort.add("seq,desc");
        search.setSort(sort);
        Pageable pageable = search.getPageable();

        // 히스토리 목록 조회
        Page<ComponentHist> returnVal = componentHistService.findHistoryList(seq, pageable);
        List<ComponentHistDTO> returnValDTO =
                modelMapper.map(returnVal.getContent(), ComponentHistDTO.TYPE);

        // 리턴 DTO 생성
        ResultListDTO<ComponentHistDTO> resultList = new ResultListDTO<ComponentHistDTO>();
        resultList.setList(returnValDTO);
        resultList.setTotalCnt(returnValDTO.size());

        ResultDTO<ResultListDTO<ComponentHistDTO>> resultDTO =
                new ResultDTO<ResultListDTO<ComponentHistDTO>>(resultList);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * <pre>
     * 관련 아이템이 있는지 확인한다
     * </pre>
     * 
     * @param request HTTP요청
     * @param seq 컴포넌트아이디
     * @return 관련 아이템 존재 여부
     * @throws NoDataException 데이터없음
     */
    @GetMapping("/{seq}/hasRelations")
    public ResponseEntity<?> hasRelations(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.component.error.invalid.componentSeq}") Long seq)
            throws NoDataException {

        // 컴포넌트 확인
        String message = messageByLocale.get("tps.component.error.noContent", request);
        componentService.findByComponentSeq(seq).orElseThrow(() -> new NoDataException(message));

        Boolean chkRels = relationHelper.hasRelations(seq, MokaConstants.ITEM_COMPONENT);
        ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels);

        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * <pre>
     * 관련 아이템(페이지, 컨테이너, 컴포넌트)을 찾는다
     * </pre>
     * 
     * @param request HTTP요청
     * @param search 검색 조건
     * @return 관련아이템 목록
     * @throws NoDataException 데이터없음
     */
    @GetMapping("/{seq}/relations")
    public ResponseEntity<?> getRelations(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.component.error.invalid.componentSeq}") Long seq,
            @Valid @SearchParam RelSearchDTO search) throws NoDataException {

        search.setRelSeq(seq);
        search.setRelSeqType(MokaConstants.ITEM_COMPONENT);

        // 컴포넌트 확인
        String message = messageByLocale.get("tps.component.error.noContent", request);
        componentService.findByComponentSeq(search.getRelSeq())
                .orElseThrow(() -> new NoDataException(message));

        return relationHelper.findRelations(search);
    }

    /**
     * 컴포넌트 데이터 유효성 검사
     * 
     * @param component
     * @return
     */
    private List<InvalidDataDTO> validData(ComponentDTO component) {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (component != null) {
            // dataType이 AUTO 일 때는 반드시 dataseq가 존재
            if (component.getDataType().equals("AUTO")) {
                if (component.getDataset() == null) {
                    String message = messageByLocale.get("tps.dataset.error.invalid.datasetSeq");
                    invalidList.add(new InvalidDataDTO("dataset", message));
                }
            }
        }

        return invalidList;
    }
}
