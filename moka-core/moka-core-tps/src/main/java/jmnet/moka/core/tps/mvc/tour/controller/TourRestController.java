/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.ValidList;
import jmnet.moka.core.tps.mvc.tour.dto.TourApplySearchDTO;
import jmnet.moka.core.tps.mvc.tour.dto.TourDenySearchDTO;
import jmnet.moka.core.tps.mvc.tour.service.TourApplyService;
import jmnet.moka.core.tps.mvc.tour.service.TourDenyService;
import jmnet.moka.core.tps.mvc.tour.service.TourGuideService;
import jmnet.moka.core.tps.mvc.tour.service.TourSetupService;
import jmnet.moka.core.tps.mvc.tour.vo.TourApplyVO;
import jmnet.moka.core.tps.mvc.tour.vo.TourDenyVO;
import jmnet.moka.core.tps.mvc.tour.vo.TourGuideVO;
import jmnet.moka.core.tps.mvc.tour.vo.TourPossibleDenyVO;
import jmnet.moka.core.tps.mvc.tour.vo.TourSetupVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description: 견학 API
 *
 * @author ssc
 * @since 2021-01-20
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/tours")
@Api(tags = {"견학 API"})
public class TourRestController extends AbstractCommonController {

    @Autowired
    private TourGuideService tourGuideService;

    @Autowired
    private TourDenyService tourDenyService;

    @Autowired
    private TourSetupService tourSetupService;

    @Autowired
    private TourApplyService tourApplyService;

    @ApiOperation(value = "메세지 목록조회")
    @GetMapping("/guides")
    public ResponseEntity<?> getTourGuideList() {

        // 조회(mybatis)
        List<TourGuideVO> returnValue = tourGuideService.findAllTourGuide();

        ResultListDTO<TourGuideVO> resultList = new ResultListDTO<TourGuideVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(returnValue.size());

        ResultDTO<ResultListDTO<TourGuideVO>> resultDTO = new ResultDTO<ResultListDTO<TourGuideVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "메세지 수정")
    @PutMapping(value = "/guides", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putTourGuideList(@ApiParam("메세지 목록") @RequestBody @Valid ValidList<TourGuideVO> validList)
            throws Exception {

        List<TourGuideVO> guideVOList = validList.getList();

        try {
            // 수정(mybatis)
            boolean saved = tourGuideService.saveTourGuide(guideVOList);

            ResultListDTO<TourGuideVO> resultList = new ResultListDTO<TourGuideVO>();

            String message = "";
            if (saved) {
                message = msg("tps.common.success.update");

                List<TourGuideVO> guideList = tourGuideService.findAllTourGuide();
                resultList.setList(guideList);
            } else {
                message = msg("tps.common.error.update");
            }
            ResultDTO<ResultListDTO<TourGuideVO>> resultDto = new ResultDTO<ResultListDTO<TourGuideVO>>(resultList, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE TOUR GUIDE]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE TOUR GUIDE]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "휴일 목록조회(매년반복)")
    @GetMapping("/denys")
    public ResponseEntity<?> getTourDenyList(@ApiParam("휴일 검색조건") @Valid TourDenySearchDTO search) {

        // 조회(mybatis)
        List<TourDenyVO> returnValue = tourDenyService.findAllTourDeny(search);

        ResultListDTO<TourDenyVO> resultList = new ResultListDTO<TourDenyVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(returnValue.size());

        ResultDTO<ResultListDTO<TourDenyVO>> resultDTO = new ResultDTO<ResultListDTO<TourDenyVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "휴일 등록")
    @PostMapping("/denys")
    public ResponseEntity<?> postTourDeny(@ApiParam("휴일정보") @Valid TourDenyVO tourDenyVo)
            throws Exception {
        try {
            // 등록
            tourDenyService.insertTourDeny(tourDenyVo);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.insert"));
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT TOUR DENY]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT TOUR DENY]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    @ApiOperation(value = "휴일 수정")
    @PutMapping("/denys/{denySeq}")
    public ResponseEntity<?> putTourDeny(@ApiParam(value = "휴일순번", required = true) @PathVariable("denySeq")
    @Min(value = 0, message = "{tps.tour-deny.error.min.denySeq}") Long denySeq, @ApiParam("휴일정보") @Valid TourDenyVO tourDenyVo)
            throws Exception {

        try {
            // 수정
            tourDenyService.updateTourDeny(tourDenyVo);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.update"));
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE TOUR DENY]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE TOUR DENY]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "휴일 삭제")
    @DeleteMapping("/denys/{denySeq}")
    public ResponseEntity<?> deleteTourDeny(@ApiParam(value = "휴일순번", required = true) @PathVariable("denySeq")
    @Min(value = 0, message = "{tps.tour-deny.error.min.denySeq}") Long denySeq)
            throws Exception {

        try {
            // 삭제
            tourDenyService.deleteTourDeny(denySeq);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.delete"));
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE TOUR DENY]", e);
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE TOUR DENY]", e, true);
            throw new Exception(msg("tps.common.error.delete"), e);
        }
    }

    @ApiOperation(value = "견학기본설정 조회")
    @GetMapping("/setup")
    public ResponseEntity<?> getTourSetup() {

        // 조회(mybatis)
        TourSetupVO returnValue = tourSetupService.findTourSetup();

        ResultDTO<TourSetupVO> resultDTO = new ResultDTO<TourSetupVO>(returnValue);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "견학기본설정 수정")
    @PutMapping("/setup")
    public ResponseEntity<?> putTourSetup(@ApiParam("견학기본설정정보") @Valid TourSetupVO tourSetupVo)
            throws Exception {

        try {
            // 수정
            tourSetupService.updateTourSetup(tourSetupVo);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.update"));
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE TOUR SETUP]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE TOUR SETUP]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "신청 목록조회")
    @GetMapping("/applys")
    public ResponseEntity<?> getTourApplyList(@ApiParam("검색조건") @Valid @SearchParam TourApplySearchDTO search) {

        // 조회(mybatis)
        List<TourApplyVO> returnValue = tourApplyService.findAllTourApply(search);

        ResultListDTO<TourApplyVO> resultList = new ResultListDTO<TourApplyVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<TourApplyVO>> resultDTO = new ResultDTO<ResultListDTO<TourApplyVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "신청 상세조회")
    @GetMapping("/applys/{tourSeq}")
    public ResponseEntity<?> getTourApply(@ApiParam(value = "신청순번", required = true) @PathVariable("tourSeq")
    @Min(value = 0, message = "{tps.tour-apply.error.min.tourSeq}") Long tourSeq) {

        // 조회(mybatis)
        TourApplyVO returnValue = tourApplyService.findTourApply(tourSeq);

        ResultDTO<TourApplyVO> resultDTO = new ResultDTO<TourApplyVO>(returnValue);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "신청 수정")
    @PutMapping(value = "/applys/{tourSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putTourApply(@ApiParam(value = "신청순번", required = true) @PathVariable("tourSeq")
    @Min(value = 0, message = "{tps.tour-apply.error.min.tourSeq}") Long tourSeq, @ApiParam("신청정보") @RequestBody @Valid TourApplyVO tourApplyVO)
            throws Exception {

        try {
            TourApplyVO returnValue = tourApplyService.updateTourApply(tourApplyVO);

            ResultDTO<TourApplyVO> resultDTO = new ResultDTO<TourApplyVO>(returnValue, msg("tps.common.success.update"));
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE TOUR APPLY] seq: {} {}", tourSeq, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE TOUR APPLY]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "견학 가능일 목록조회")
    @GetMapping("/denys/possible")
    public ResponseEntity<?> getTourDenyPossibleList() {

        // 조회(mybatis)
        List<TourPossibleDenyVO> returnValue = tourDenyService.findAllTourDenyByPossible();

        ResultListDTO<TourPossibleDenyVO> resultList = new ResultListDTO<TourPossibleDenyVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(returnValue.size());

        ResultDTO<ResultListDTO<TourPossibleDenyVO>> resultDTO = new ResultDTO<ResultListDTO<TourPossibleDenyVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "신청 삭제")
    @DeleteMapping("/applys/{tourSeq}")
    public ResponseEntity<?> deleteTourApply(@ApiParam(value = "신청순번", required = true) @PathVariable("tourSeq")
    @Min(value = 0, message = "{tps.tour-apply.error.min.tourSeq}") Long tourSeq)
            throws Exception {

        try {
            tourApplyService.deleteTourApply(tourSeq);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.delete"));
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DELETE TOUR APPLY] seq: {} {}", tourSeq, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO DELETE TOUR APPLY]", e, true);
            throw new Exception(msg("tps.common.error.delete"), e);
        }
    }

    //    @ApiOperation(value = "비밀번호 초기화")
    //    @PostMapping("/apply/resest-pwd")
    //    public ResponseEntity<?> postResetPwd(
    //            @ApiParam("전화번호 뒷 4자리") @Valid @Pattern(regexp = "//d{4}$", message = "{tps.tour-apply.error.pattern.writerPhone}") String phone)
    //            throws Exception {
    //        try {
    //            String pwd = tourApplyService.DESEncrypt(phone);
    //
    //            ResultDTO<String> resultDTO = new ResultDTO<String>(pwd, msg("tps.tour-apply.success.reset-pwd"));
    //            tpsLogger.success(ActionType.SELECT, true);
    //            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    //        } catch (Exception e) {
    //            log.error("[FAIL TO RESET PASSWORD TOUR APPLY] seq: {} {}", phone, e.getMessage());
    //            tpsLogger.error(ActionType.UPDATE, "[FAIL TO RESET PASSWORD TOUR APPLY]", e, true);
    //            throw new Exception(msg("tps.tour-apply.error.reset-pwd"), e);
    //        }
    //    }

    @ApiOperation(value = "휴일 목록조회(월별)")
    @GetMapping("/denys/month")
    public ResponseEntity<?> getTourDenyMonthList(@ApiParam(value = "년도(4자리)", required = true) @RequestParam("year")
    @Pattern(regexp = "\\d{4}$", message = "{tps.tour-apply.error.pattern.year}") String year,
            @ApiParam(value = "월(2자리)", required = true) @RequestParam("month")
            @Pattern(regexp = "\\d{2}$", message = "{tps.tour-apply.error.pattern.month}") String month) {

        // 조회(mybatis)
        List<TourDenyVO> returnValue = tourDenyService.findAllTourDenyMonth(year, month);

        ResultListDTO<TourDenyVO> resultList = new ResultListDTO<TourDenyVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(returnValue.size());

        ResultDTO<ResultListDTO<TourDenyVO>> resultDTO = new ResultDTO<ResultListDTO<TourDenyVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "견학 신청 목록조회(월별)")
    @GetMapping("/applys/month")
    public ResponseEntity<?> getTourApplyMonthList(@ApiParam(value = "년도(4자리)", required = true) @RequestParam("year")
    @Pattern(regexp = "\\d{4}$", message = "{tps.tour-apply.error.pattern.year}") String year,
            @ApiParam(value = "월(2자리)", required = true) @RequestParam("month")
            @Pattern(regexp = "\\d{2}$", message = "{tps.tour-apply.error.pattern.month}") String month) {

        // 조회(mybatis)
        List<TourApplyVO> returnValue = tourApplyService.findAllTourApplyMonth(year, month);

        ResultListDTO<TourApplyVO> resultList = new ResultListDTO<TourApplyVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(returnValue.size());

        ResultDTO<ResultListDTO<TourApplyVO>> resultDTO = new ResultDTO<ResultListDTO<TourApplyVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

}
