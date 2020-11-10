/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.controller;

import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.area.dto.AreaCompLoadDTO;
import jmnet.moka.core.tps.mvc.area.dto.AreaDTO;
import jmnet.moka.core.tps.mvc.area.dto.AreaNode;
import jmnet.moka.core.tps.mvc.area.dto.AreaSearchDTO;
import jmnet.moka.core.tps.mvc.area.dto.ParentAreaDTO;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.service.AreaService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
public class AreaRestController {
    @Autowired
    private AreaService areaService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private TpsLogger tpsLogger;

    /**
     * 편집영역 목록조회(부모 편집영역별)
     *
     * @param search 검색조건
     * @return 편집영역 목록
     */
    @ApiOperation(value = "편집영역 목록조회(부모 편집영역별)")
    @GetMapping
    public ResponseEntity<?> getAreaList(@Valid @SearchParam AreaSearchDTO search) {

        Page<Area> returnValue = areaService.findAllArea(search);
        List<AreaDTO> areaDtoList = modelMapper.map(returnValue.getContent(), AreaDTO.TYPE);
        ResultListDTO<AreaDTO> resultList = new ResultListDTO<AreaDTO>();
        resultList.setList(areaDtoList);
        resultList.setTotalCnt(returnValue.getTotalElements());

        ResultDTO<ResultListDTO<AreaDTO>> resultDTO = new ResultDTO<ResultListDTO<AreaDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
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
    public ResponseEntity<?> getArea(@PathVariable("areaSeq") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq)
            throws Exception {

        Area area = areaService.findAreaBySeq(areaSeq)
                               .orElseThrow(() -> {
                                   String message = messageByLocale.get("tps.common.error.no-data");
                                   tpsLogger.fail(message, true);
                                   return new NoDataException(message);
                               });

        try {
            // 컨테이너의 관련cp변경시 에러표현하고, 로딩시키지는 않는다.
            // 페이지의 컨테이너의 컴포넌트가 변경된 경우도 에러표현하고, 로딩시키지는 않는다.
            AreaCompLoadDTO areaCompLoadDTO = new AreaCompLoadDTO();
            Map<String, Object> check = areaService.checkAreaComp(area);
            if ((long) check.get("byPage") < 0) {
                areaCompLoadDTO.setByPage(true);  // true이면 해당 컴포넌트 미존재
                areaCompLoadDTO.setByPageMessage(messageByLocale.get("tps.areaComp.error.bypage"));
            }
            if ((long) check.get("byContainer") < 0) {
                areaCompLoadDTO.setByContainer(true);  // true이면 해당 컨테이너 미존재
                areaCompLoadDTO.setByContainerMessage(messageByLocale.get("tps.areaComp.error.bycontainer"));
            }
            if ((long) check.get("byContainerComp") < 0) {
                areaCompLoadDTO.setByContainerComp(true); // true이면 해당 컨테이너내에 컴포넌트 미존재
                areaCompLoadDTO.setByContainerCompMessage(messageByLocale.get("tps.areaComp.error.bycontainer-comp"));
            }

            AreaDTO areaDTO = modelMapper.map(area, AreaDTO.class);

            ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);
            resultMapDTO.addBodyAttribute("area", areaDTO);
            resultMapDTO.addBodyAttribute("areaCompLoad", areaCompLoadDTO);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD AREA]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD AREA]", e, true);
            throw new Exception(messageByLocale.get("tps.area.error.select"), e);
        }
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
    public ResponseEntity<?> postArea(@RequestBody @Valid AreaDTO areaDTO)
            throws InvalidDataException, Exception {

        // 데이터 유효성 검사
        validData(areaDTO, ActionType.INSERT);

        if (areaDTO.getAreaComps()
                   .size() > 0) {

            areaDTO.getAreaComps()
                   .stream()
                   .forEach((comp) -> comp.setArea(areaDTO));
        }

        Area area = modelMapper.map(areaDTO, Area.class);

        try {
            // 편집영역 등록
            Area returnVal = areaService.insertArea(area);
            AreaDTO returnValDTO = modelMapper.map(returnVal, AreaDTO.class);
            if (returnVal.getParent() != null) {
                ParentAreaDTO parentDto = modelMapper.map(returnVal.getParent(), ParentAreaDTO.class);
                returnValDTO.setParent(parentDto);
            }

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<AreaDTO> resultDTO = new ResultDTO<AreaDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT AREA]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT AREA]", e, true);
            throw new Exception(messageByLocale.get("tps.area.error.save"), e);
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
    public ResponseEntity<?> putArea(HttpServletRequest request,
            @PathVariable("areaSeq") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq, @RequestBody @Valid AreaDTO areaDTO)
            throws InvalidDataException, Exception {

        // 데이터 유효성 검사
        validData(areaDTO, ActionType.UPDATE);

        // 수정
        Area newArea = modelMapper.map(areaDTO, Area.class);
        Area orgArea = areaService.findAreaBySeq(areaSeq)
                                  .orElseThrow(() -> {
                                      String message = messageByLocale.get("tps.area.error.no-data");
                                      tpsLogger.fail(ActionType.UPDATE, message, true);
                                      return new NoDataException(message);
                                  });

        if (areaDTO.getAreaComps()
                   .size() > 0) {

            areaDTO.getAreaComps()
                   .stream()
                   .forEach((comp) -> comp.setArea(areaDTO));
        }

        Area area = modelMapper.map(areaDTO, Area.class);

        try {
            // 편집영역 수정
            Area returnVal = areaService.updateArea(area);

            AreaDTO returnValDTO = modelMapper.map(returnVal, AreaDTO.class);
            if (returnVal.getParent() != null) {
                ParentAreaDTO parentDto = modelMapper.map(returnVal.getParent(), ParentAreaDTO.class);
                returnValDTO.setParent(parentDto);
            }

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<AreaDTO> resultDTO = new ResultDTO<AreaDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE AREA]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE AREA]", e, true);
            throw new Exception(messageByLocale.get("tps.area.error.save"), e);
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
            // 자식영역일 경우 부모가 있는지 조사
            if (area.getDepth() > 1) {
                if (area.getParent() == null) {
                    String message = messageByLocale.get("tps.area.error.parentAreaSeq");
                    invalidList.add(new InvalidDataDTO("parentAreaSeq", message));
                    tpsLogger.fail(actionType, message, true);
                }
            }

        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
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
    public ResponseEntity<?> deleteArea(@PathVariable("areaSeq") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq)
            throws InvalidDataException, NoDataException, Exception {

        // 1. 데이타 존재여부 검사
        Area area = areaService.findAreaBySeq(areaSeq)
                               .orElseThrow(() -> {
                                   String message = messageByLocale.get("tps.area.error.no-data");
                                   tpsLogger.fail(ActionType.DELETE, message, true);
                                   return new NoDataException(message);
                               });

        try {
            // 2. 삭제
            areaService.deleteArea(area);

            // 3. 결과리턴
            String message = messageByLocale.get("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE AREA] seq: {} {}", areaSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE AREA]", e, true);
            throw new Exception(messageByLocale.get("tps.area.error.delete"), e);
        }
    }

    /**
     * 편집영역 목록조회(트리용)
     *
     * @return 편집영역 트리 목록(AreaNode)
     */
    @ApiOperation(value = "편집영역 목록조회(트리용)")
    @GetMapping("/tree")
    public ResponseEntity<?> getAreaTree() {

        AreaNode areaNode = areaService.makeTree();

        ResultDTO<AreaNode> resultDto = new ResultDTO<AreaNode>(areaNode);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
