/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.area.dto.AreaCompLoadDTO;
import jmnet.moka.core.tps.mvc.area.dto.AreaDTO;
import jmnet.moka.core.tps.mvc.area.dto.AreaNode;
import jmnet.moka.core.tps.mvc.area.dto.AreaSearchDTO;
import jmnet.moka.core.tps.mvc.area.dto.ParentAreaDTO;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.entity.AreaSimple;
import jmnet.moka.core.tps.mvc.area.service.AreaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Description: 편집영역 API
 *
 * @author ssc
 * @since 2020-11-04
 */
@Controller
@Validated
@Slf4j
@RequestMapping("/api/areas")
@Api(tags = {"편집영역 API"})
public class AreaRestController extends AbstractCommonController {
    private final AreaService areaService;

    /**
     * 생성자
     *
     * @param areaService AREA서비스
     */
    public AreaRestController(AreaService areaService) {
        this.areaService = areaService;
    }

    /**
     * 편집영역 목록조회(부모 편집영역별)
     *
     * @param search 검색조건
     * @return 편집영역 목록
     */
    @ApiOperation(value = "편집영역 목록조회(부모 편집영역별)")
    @GetMapping
    public ResponseEntity<?> getAreaList(@Valid @SearchParam AreaSearchDTO search)
            throws Exception {

        try {
            List<AreaSimple> returnValue = areaService.findAllArea(search);
            List<AreaDTO> areaDtoList = modelMapper.map(returnValue, AreaDTO.TYPE);

            ResultListDTO<AreaDTO> resultList = new ResultListDTO<AreaDTO>();
            resultList.setList(areaDtoList);
            resultList.setTotalCnt(returnValue.size());

            ResultDTO<ResultListDTO<AreaDTO>> resultDTO = new ResultDTO<ResultListDTO<AreaDTO>>(resultList);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD AREA LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD AREA LIST]", e, true);
            throw new Exception(msg("tps.area.error.select"), e);
        }
    }

    /**
     * 편집영역 상세조회
     *
     * @param areaSeq 편집영역번호 (필수)
     * @return 편집영역
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "편집영역 상세조회")
    @GetMapping("/{areaSeq}")
    public ResponseEntity<?> getArea(
            @ApiParam("편집영역 일련번호 (필수)") @PathVariable("areaSeq") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq)
            throws Exception {

        Area area = areaService
                .findAreaBySeq(areaSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            ResultMapDTO resultMapDTO = getAreaInfo(area, null);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD AREA]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD AREA]", e, true);
            throw new Exception(msg("tps.area.error.select"), e);
        }
    }

    private ResultMapDTO getAreaInfo(Area area, String message)
            throws Exception {
        // 컨테이너의 관련cp변경시 에러표현하고, 로딩시키지는 않는다.
        // 페이지의 컨테이너의 컴포넌트가 변경된 경우도 에러표현하고, 로딩시키지는 않는다.
        AreaCompLoadDTO areaCompLoadDTO = new AreaCompLoadDTO();
        Map<String, Object> check = areaService.checkAreaComp(area);
        if ((long) check.get("byPage") < 0) {
            areaCompLoadDTO.setByPage(true);  // true이면 해당 컴포넌트 미존재
            areaCompLoadDTO.setByPageMessage(msg("tps.areaComp.error.bypage"));
        }
        if ((long) check.get("byContainer") < 0) {
            areaCompLoadDTO.setByContainer(true);  // true이면 해당 컨테이너 미존재
            areaCompLoadDTO.setByContainerMessage(msg("tps.areaComp.error.bycontainer"));
        }
        if ((long) check.get("byContainerComp") < 0) {
            areaCompLoadDTO.setByContainerComp(true); // true이면 해당 컨테이너내에 컴포넌트 미존재
            areaCompLoadDTO.setByContainerCompMessage(msg("tps.areaComp.error.bycontainer-comp"));
        }

        AreaDTO areaDTO = modelMapper.map(area, AreaDTO.class);
        if (area.getParent() != null) {
            ParentAreaDTO parentDto = modelMapper.map(area.getParent(), ParentAreaDTO.class);
            areaDTO.setParent(parentDto);
        }

        // 컴포넌트타입일 경우, areaComps-> areaComp로 컴포넌트 정보 이동
        if (areaDTO
                .getAreaDiv()
                .equals(MokaConstants.ITEM_COMPONENT)) {
            areaService.compsToComp(areaDTO);
        }

        ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK, message);
        resultMapDTO.addBodyAttribute("area", areaDTO);
        resultMapDTO.addBodyAttribute("areaCompLoad", areaCompLoadDTO);

        return resultMapDTO;
    }

    /**
     * 편집영역 등록
     *
     * @param areaDTO 편집영역DTO
     * @return 편집영역
     * @throws InvalidDataException 데이터유효성에러
     * @throws Exception            편집영역오류 그외 모든 에러
     */
    @ApiOperation(value = "편집영역 등록")
    @PostMapping(headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postArea(@ApiParam("편집영역 정보") @RequestBody @Valid AreaDTO areaDTO)
            throws InvalidDataException, Exception {

        // 데이터 유효성 검사
        validData(areaDTO, ActionType.INSERT);

        // 빈 객체로 올 경우 null 처리
        if (areaDTO.getContainer() != null && areaDTO
                .getContainer()
                .getContainerSeq() == null) {
            areaDTO.setContainer(null);
        }
        if (areaDTO.getAreaComps() != null && areaDTO
                .getAreaComps()
                .size() > 0) {

            areaDTO
                    .getAreaComps()
                    .stream()
                    .forEach((comp) -> {
                        comp.setArea(areaDTO);
                        if (comp.getComponent() != null && comp
                                .getComponent()
                                .getComponentSeq() == null) {
                            comp.setComponent(null);
                        }
                    });
        }

        // 컴포넌트타입일 경우, areaComp-> areaComps로 컴포넌트 정보 이동
        if (areaDTO
                .getAreaDiv()
                .equals(MokaConstants.ITEM_COMPONENT)) {
            areaService.compToComps(areaDTO);
        }

        Area area = modelMapper.map(areaDTO, Area.class);

        try {
            // 편집영역 등록
            Area returnVal = areaService.insertArea(area);

            String message = msg("tps.common.success.insert");
            ResultMapDTO resultMapDTO = getAreaInfo(returnVal, message);

            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT AREA]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT AREA]", e, true);
            throw new Exception(msg("tps.area.error.save"), e);
        }
    }

    /**
     * 편집영역 수정
     *
     * @param areaDTO 편집영역DTO
     * @return 편집영역
     * @throws InvalidDataException 데이터유효성에러
     * @throws Exception            편집영역오류 그외 모든 에러
     */
    @ApiOperation(value = "편집영역 수정")
    @PutMapping(value = "/{areaSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putArea(
            @ApiParam("편집영역 일련번호 (필수)") @PathVariable("areaSeq") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq,
            @ApiParam("편집영역 정보") @RequestBody @Valid AreaDTO areaDTO)
            throws InvalidDataException, Exception {

        // 데이터 유효성 검사
        validData(areaDTO, ActionType.UPDATE);

        // 수정
        Area newArea = modelMapper.map(areaDTO, Area.class);
        Area orgArea = areaService
                .findAreaBySeq(areaSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.area.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });

        // 빈 객체로 올 경우 null 처리
        if (areaDTO.getContainer() != null && areaDTO
                .getContainer()
                .getContainerSeq() == null) {
            areaDTO.setContainer(null);
        }
        if (areaDTO.getAreaComps() != null && areaDTO
                .getAreaComps()
                .size() > 0) {

            areaDTO
                    .getAreaComps()
                    .stream()
                    .forEach((comp) -> {
                        comp.setArea(areaDTO);
                        if (comp.getComponent() != null && comp
                                .getComponent()
                                .getComponentSeq() == null) {
                            comp.setComponent(null);
                        }
                    });
        }

        // 컴포넌트타입일 경우, areaComp-> areaComps로 컴포넌트 정보 이동
        if (areaDTO
                .getAreaDiv()
                .equals(MokaConstants.ITEM_COMPONENT)) {
            areaService.compToComps(areaDTO);
        }

        Area area = modelMapper.map(areaDTO, Area.class);

        try {
            // 편집영역 수정
            Area returnVal = areaService.updateArea(area);

            String message = msg("tps.common.success.update");
            ResultMapDTO resultMapDTO = getAreaInfo(returnVal, message);

            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE AREA]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE AREA]", e, true);
            throw new Exception(msg("tps.area.error.save"), e);
        }
    }

    /**
     * 편집영역 데이터 유효성 검사
     *
     * @param area       편집영역정보
     * @param actionType 작업구분(INSERT OR UPDATE)
     * @throws InvalidDataException 데이타유효성 오류
     * @throws Exception            예외
     */
    private void validData(AreaDTO area, ActionType actionType)
            throws InvalidDataException, Exception {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (area != null) {
            if (area.getDepth() > 1) {
                // 자식영역일 경우 부모가 있는지 조사
                if (area.getParent() == null) {
                    String message = msg("tps.area.error.parentAreaSeq");
                    invalidList.add(new InvalidDataDTO("parentAreaSeq", message));
                    tpsLogger.fail(actionType, message, true);
                }

                // Div==CP일때, 컴포넌트가 없으면 에러
                if (area
                        .getAreaDiv()
                        .equals(MokaConstants.ITEM_COMPONENT) && area.getAreaComp() == null) {
                    String message = msg("tps.area.error.notnull.areaComp");
                    invalidList.add(new InvalidDataDTO("areaComp", message));
                    tpsLogger.fail(actionType, message, true);
                }

                // Div==CT일때, 컨테이너에 컴포넌트가 없으면 에러
                if (area
                        .getAreaDiv()
                        .equals(MokaConstants.ITEM_CONTAINER) && (area.getAreaComps() == null || area
                        .getAreaComps()
                        .size() <= 0)) {
                    String message = msg("tps.area.error.notnull.areaComps");
                    invalidList.add(new InvalidDataDTO("areaComps", message));
                    tpsLogger.fail(actionType, message, true);
                }
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = msg("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 편집영역 삭제
     *
     * @param areaSeq 삭제 할 편집영역순번 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      페이지정보 없음 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "편집영역 삭제")
    @DeleteMapping("/{areaSeq}")
    public ResponseEntity<?> deleteArea(
            @ApiParam("편집영역 일련번호 (필수)") @PathVariable("areaSeq") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq)
            throws InvalidDataException, NoDataException, Exception {

        // 1. 데이타 존재여부 검사
        Area area = areaService
                .findAreaBySeq(areaSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.area.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        try {
            // 2. 삭제
            areaService.deleteArea(area);

            // 3. 결과리턴
            String message = msg("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE AREA] seq: {} {}", areaSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE AREA]", e, true);
            throw new Exception(msg("tps.area.error.delete"), e);
        }
    }

    /**
     * 편집영역 목록조회(트리용)
     *
     * @return 편집영역 트리 목록(AreaNode)
     */
    @ApiOperation(value = "편집영역 목록조회(트리용)")
    @GetMapping("/tree")
    public ResponseEntity<?> getAreaTree(@ApiParam(value = "편집영역 매체", required = true) @RequestParam(value = "sourceCode")
    @NotNull(message = "{tps.area.error.notnull.sourceCode}") String sourceCode) {

        AreaNode areaNode = areaService.makeTree(sourceCode);

        ResultDTO<List<AreaNode>> resultDto = new ResultDTO<List<AreaNode>>(areaNode.getNodes());

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 편집영역 정렬
     *
     * @param parentAreaSeq 부모편집영역 일련번호
     * @param areaSeqList   편집영역 일련번호 목록
     * @return
     * @throws InvalidDataException 데이터유효성에러
     * @throws Exception            편집영역오류 그외 모든 에러
     */
    @ApiOperation(value = "편집영역 정렬")
    @PutMapping(value = "/sort/{parentAreaSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putAreaSort(@ApiParam("부모편집영역 일련번호") @PathVariable("parentAreaSeq") Long parentAreaSeq,
            @ApiParam("편집영역 일련번호 목록") @RequestBody @Valid List<Long> areaSeqList)
            throws InvalidDataException, Exception {
        try {
            areaService.updateAreaSort(parentAreaSeq, areaSeqList);

            String message = msg("tps.common.success.update");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE AREA SORT]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE AREA SORT]", e, true);
            throw new Exception(msg("tps.area.error.save"), e);
        }
    }

}
