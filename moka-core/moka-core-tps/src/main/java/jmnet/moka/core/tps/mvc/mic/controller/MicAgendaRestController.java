/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.ValidList;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaCateSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicAnswerSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicBannerSearchDTO;
import jmnet.moka.core.tps.mvc.mic.service.MicAgendaCategoryService;
import jmnet.moka.core.tps.mvc.mic.service.MicAgendaService;
import jmnet.moka.core.tps.mvc.mic.service.MicAnswerService;
import jmnet.moka.core.tps.mvc.mic.service.MicBannerService;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaCategoryVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaSimpleVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAnswerRelVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAnswerVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicBannerVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
 * Description: ??????????????? API
 *
 * @author ssc
 * @since 2021-01-25
 */
@RestController
@RequestMapping("/api/mics")
@Slf4j
@Api(tags = {"??????????????? API"})
public class MicAgendaRestController extends AbstractCommonController {

    private final MicAgendaService micAgendaService;

    private final MicBannerService micBannerService;

    private final MicAgendaCategoryService micAgendaCategoryService;

    private final MicAnswerService micAnswerService;

    public MicAgendaRestController(MicAgendaService micAgendaService, MicBannerService micBannerService,
            MicAgendaCategoryService micAgendaCategoryService, MicAnswerService micAnswerService) {
        this.micAgendaService = micAgendaService;
        this.micBannerService = micBannerService;
        this.micAgendaCategoryService = micAgendaCategoryService;
        this.micAnswerService = micAnswerService;
    }

    @ApiOperation(value = "????????? ????????????")
    @GetMapping("/agendas")
    public ResponseEntity<?> getMicAgendaList(@ApiParam("????????????") @Valid @SearchParam MicAgendaSearchDTO search)
            throws Exception {

        try {
            // ??????(mybatis)
            List<MicAgendaVO> returnValue = micAgendaService.findAllMicAgenda(search);

            ResultListDTO<MicAgendaVO> resultList = new ResultListDTO<MicAgendaVO>();
            resultList.setList(returnValue);
            resultList.setTotalCnt(search.getTotal());

            ResultDTO<ResultListDTO<MicAgendaVO>> resultDTO = new ResultDTO<ResultListDTO<MicAgendaVO>>(resultList);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD AGENDA LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD AGENDA LIST]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    @ApiOperation(value = "????????? ??????")
    @GetMapping("/report")
    public ResponseEntity<?> getMicReport()
            throws Exception {
        try {
            // ??????(mybatis)
            Map<String, Object> returnValue = micAgendaService.findMic();

            ResultDTO<Map<String, Object>> resultDTO = new ResultDTO<Map<String, Object>>(returnValue);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD AGENDA REPORT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD AGENDA REPORT]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    @ApiOperation(value = "????????? ????????????")
    @GetMapping("/agendas/{agndSeq}")
    public ResponseEntity<?> getMicAgenda(@ApiParam(value = "???????????????", required = true) @PathVariable("agndSeq")
    @Min(value = 0, message = "tps.agenda.error.min.agndSeq") Long agndSeq)
            throws Exception {

        try {
            // ??????(mybatis)
            MicAgendaVO returnValue = micAgendaService.findMicAgendaById(agndSeq);

            ResultDTO<MicAgendaVO> resultDTO = new ResultDTO<MicAgendaVO>(returnValue);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD AGENDA]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD AGENDA]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    @ApiOperation(value = "????????? ??????")
    @PostMapping(value = "/agendas", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postMicAgenda(@ApiParam("????????? ??????") @Valid MicAgendaVO micAgendaVO, @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {

        try {
            micAgendaVO.setRegId(principal.getName());
            micAgendaVO.setRegDt(McpDate.now());
            boolean uploaded = micAgendaService.saveMicAgenda(micAgendaVO);
            String msg = uploaded ? msg("tps.common.success.insert") : msg("tps.agenda.error.image-upload");

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT AGENDA]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT AGENDA]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    @ApiOperation(value = "????????? ??????")
    @PutMapping(value = "/agendas/{agndSeq}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> putMicAgenda(@ApiParam(value = "???????????????", required = true) @PathVariable("agndSeq")
    @Min(value = 0, message = "tps.agenda.error.min.agndSeq") Long agndSeq, @ApiParam("????????? ??????") @Valid MicAgendaVO micAgendaVO,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {

        try {
            boolean uploaded = micAgendaService.saveMicAgenda(micAgendaVO);
            String msg = uploaded ? msg("tps.common.success.update") : msg("tps.agenda.error.image-upload");

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE AGENDA]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE AGENDA]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/banners")
    public ResponseEntity<?> getMicBannerList(@ApiParam("????????????") @Valid @SearchParam MicBannerSearchDTO search)
            throws Exception {

        try {
            // ??????(mybatis)
            List<MicBannerVO> returnValue = micBannerService.findAllMicBanner(search);

            ResultListDTO<MicBannerVO> resultList = new ResultListDTO<MicBannerVO>();
            resultList.setList(returnValue);
            resultList.setTotalCnt(search.getTotal());

            ResultDTO<ResultListDTO<MicBannerVO>> resultDTO = new ResultDTO<ResultListDTO<MicBannerVO>>(resultList);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD BANNER LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD BANNER LIST]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/banners/{bnnrSeq}")
    public ResponseEntity<?> getMicBanner(@ApiParam(value = "????????????", required = true) @PathVariable("bnnrSeq")
    @Min(value = 0, message = "tps.banner.error.min.bnnrSeq") Long bnnrSeq)
            throws Exception {

        try {
            // ??????(mybatis)
            MicBannerVO returnValue = micBannerService.findMicBannerById(bnnrSeq);

            ResultDTO<MicBannerVO> resultDTO = new ResultDTO<MicBannerVO>(returnValue);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD BANNER]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD BANNER]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    @ApiOperation(value = "?????? ??????")
    @PostMapping(value = "/banners", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postMicBanner(@ApiParam("?????? ??????") @Valid MicBannerVO micBannerVO)
            throws Exception {

        try {
            validBanner(micBannerVO, ActionType.INSERT);

            boolean uploaded = micBannerService.saveMicBanner(micBannerVO);
            String msg = uploaded ? msg("tps.common.success.insert") : msg("tps.banner.error.image-upload");

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT BANNER]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT BANNER]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    @ApiOperation(value = "?????? ??????")
    @PutMapping(value = "/banners/{bnnrSeq}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> putMicBanner(@ApiParam(value = "????????????", required = true) @PathVariable("bnnrSeq") Long bnnrSeq,
            @ApiParam("?????? ??????") @Valid MicBannerVO micBannerVO)
            throws Exception {

        try {
            validBanner(micBannerVO, ActionType.INSERT);

            boolean uploaded = micBannerService.saveMicBanner(micBannerVO);
            String msg = uploaded ? msg("tps.common.success.update") : msg("tps.banner.error.image-upload");

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE BANNER]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE BANNER]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    private void validBanner(MicBannerVO micBannerVO, ActionType actionType)
            throws InvalidDataException {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (micBannerVO != null) {
            if (micBannerVO.getBnnrSeq() != null && micBannerVO.getBnnrSeq() > 0) {
                if (McpString.isNotEmpty(micBannerVO.getImgLink()) || micBannerVO.getImgFile() != null) {
                } else {
                    String message = msg("tps.banner.error.notnull.imgLink");
                    invalidList.add(new InvalidDataDTO("imgLink", message));
                    tpsLogger.fail(actionType, message, true);
                }
            } else {
                if (micBannerVO.getImgFile() == null) {
                    String message = msg("tps.banner.error.notnull.imgLink");
                    invalidList.add(new InvalidDataDTO("imgLink", message));
                    tpsLogger.fail(actionType, message, true);
                }
            }

            if (invalidList.size() > 0) {
                String validMessage = msg("tps.common.error.invalidContent");
                throw new InvalidDataException(invalidList, validMessage);
            }
        }
    }

    @ApiOperation(value = "?????? ???????????? ??????(??????)")
    @PutMapping(value = "/banners/{bnnrSeq}/toggle")
    public ResponseEntity<?> putMicBannerToggle(@ApiParam(value = "????????????", required = true) @PathVariable("bnnrSeq")
    @Min(value = 0, message = "tps.banner.error.min.bnnrSeq") Long bnnrSeq)
            throws Exception {

        try {
            micBannerService.updateMicBannerToggle(bnnrSeq);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.update"));
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE BANNER TOGGLE]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE BANNER TOGGLE]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }


    @ApiOperation(value = "????????? ???????????? ????????????")
    @GetMapping("/categorys")
    public ResponseEntity<?> getMicAgendaCategoryList(@ApiParam("????????????") @Valid @SearchParam MicAgendaCateSearchDTO search)
            throws Exception {

        try {
            // ??????(mybatis)
            List<MicAgendaCategoryVO> returnValue = micAgendaCategoryService.findAllMicAgendaCategory(search);

            ResultListDTO<MicAgendaCategoryVO> resultList = new ResultListDTO<MicAgendaCategoryVO>();
            resultList.setList(returnValue);
            resultList.setTotalCnt(returnValue.size());

            ResultDTO<ResultListDTO<MicAgendaCategoryVO>> resultDTO = new ResultDTO<ResultListDTO<MicAgendaCategoryVO>>(resultList);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD AGENDA CATEGORY LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD AGENDA CATEGORY LIST]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    @ApiOperation(value = "????????? ???????????? ??????")
    @PostMapping("/categorys")
    public ResponseEntity<?> postMicAgendaCategory(@ApiParam("????????? ???????????? ??????") @Valid MicAgendaCategoryVO micAgendaCategoryVO)
            throws Exception {

        try {
            boolean inserted = micAgendaCategoryService.insertMicAgendaCategory(micAgendaCategoryVO);
            String msg = inserted ? msg("tps.common.success.insert") : msg("tps.agenda-category.error.dup.catNm");

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(inserted, msg);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT AGENDA CATEGORY]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT AGENDA CATEGORY]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    @ApiOperation(value = "????????? ???????????? ????????????")
    @PutMapping(value = "/categorys", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putMicAgendaCategoryList(@ApiParam("???????????? ??????") @RequestBody @Valid ValidList<MicAgendaCategoryVO> validList)
            throws Exception {

        List<MicAgendaCategoryVO> micAgendaCategoryVOList = validList.getList();

        try {
            micAgendaCategoryService.updateMicAgendaCategory(micAgendaCategoryVOList);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.agenda-category.success.all.update"));
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE AGENDA CATEGORY]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE AGENDA CATEGORY]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "????????? ????????????")
    @PutMapping(value = "/agendas/sort", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putMicAgendaSort(@ApiParam("????????? ??????") @RequestBody @Valid ValidList<MicAgendaSimpleVO> validList)
            throws Exception {

        List<MicAgendaSimpleVO> micAgendaCategoryVOList = validList.getList();

        try {
            micAgendaService.updateAllMicAgendaOrder(micAgendaCategoryVOList);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.update"));
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE AGENDA ORDER]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE AGENDA ORDER]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/answers")
    public ResponseEntity<?> getMicAnswerList(@ApiParam("????????????") @Valid @SearchParam MicAnswerSearchDTO search)
            throws Exception {

        try {
            // ??????(mybatis)
            List<MicAnswerVO> returnValue = micAnswerService.findAllMicAnswer(search);

            ResultListDTO<MicAnswerVO> resultList = new ResultListDTO<MicAnswerVO>();
            resultList.setList(returnValue);
            resultList.setTotalCnt(search.getTotal());

            ResultDTO<ResultListDTO<MicAnswerVO>> resultDTO = new ResultDTO<ResultListDTO<MicAnswerVO>>(resultList);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD  ANSWER LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD ANSWER LIST]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/answers/{answSeq}")
    public ResponseEntity<?> getMicAnswer(@ApiParam(value = "????????????", required = true) @PathVariable("answSeq")
    @Min(value = 0, message = "tps.answer.error.min.answSeq") Long answSeq)
            throws Exception {

        try {
            // ??????(mybatis)
            MicAnswerVO returnValue = micAnswerService.findMicAnswerById(answSeq);

            ResultDTO<MicAnswerVO> resultDTO = new ResultDTO<MicAnswerVO>(returnValue);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO LOAD  ANSWER]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD ANSWER]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    @ApiOperation(value = "????????? ?????? ???????????? ??????")
    @PostMapping(value = "/answers/{answSeq}/rel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postMicAnswerRel(@ApiParam(value = "????????????", required = true) @PathVariable("answSeq")
    @Min(value = 0, message = "tps.answer.error.min.answSeq") Long answSeq, @ApiParam("?????? ????????????") @Valid MicAnswerRelVO micAnswerRelVO)
            throws Exception {

        try {
            boolean uploaded = micAnswerService.saveMicAnswerRel(micAnswerRelVO);
            String msg = uploaded ? msg("tps.common.success.update") : msg("tps.answer.error.image-upload");

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT ANSWER REL]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT ANSWER REL]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "????????? ?????? ???????????? ??????")
    @DeleteMapping(value = "/answers/{answSeq}/rel")
    public ResponseEntity<?> deleteMicAnswerRel(@ApiParam(value = "????????????", required = true) @PathVariable("answSeq")
    @Min(value = 0, message = "tps.answer.error.min.answSeq") Long answSeq)
            throws Exception {

        try {
            micAnswerService.deleteAllMicAnswerRel(answSeq);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.update"));
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE ANSWER REL]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE ANSWER REL]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "?????? ?????? ???????????? ??????")
    @PutMapping("/answers/{answSeq}/used")
    public ResponseEntity<?> putMicAnswerUsed(@ApiParam(value = "????????????", required = true) @PathVariable("answSeq")
    @Min(value = 0, message = "tps.answer.error.min.answSeq") Long answSeq,
            @ApiParam(value = "????????????", required = true) @RequestParam("usedYn") @NotNull(message = "{tps.answer.error.notnull.usedYn}") String usedYn)
            throws Exception {

        try {
            micAnswerService.updateMicAnswerUsed(answSeq, usedYn);
            String msg = "";
            if (usedYn.equals(MokaConstants.NO)) {
                msg = msg("tps.common.success.delete");
            } else {
                msg = msg("tps.common.success.update");
            }

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE ANSWER USED]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE ANSWER USED]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "?????? ?????? ????????? ??????")
    @PutMapping("/answers/{answSeq}/top")
    public ResponseEntity<?> putMicAnswerTop(@ApiParam(value = "????????????", required = true) @PathVariable("answSeq") Long answSeq,
            @ApiParam(value = "???????????????", required = true) @NotNull(message = "{tps.answer.error.notnull.answTop}") @RequestParam("answTop")
                    String answTop)
            throws Exception {

        try {
            micAnswerService.updateMicAnswerTop(answSeq, answTop);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.update"));
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE ANSWER TOP]", e);
            tpsLogger.error(ActionType.DELETE, "[FAIL TO UPDATE ANSWER TOP]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "????????? ?????? ?????? ??????")
    @PutMapping("/answers/{answSeq}/div")
    public ResponseEntity<?> putMicAnswerDiv(@ApiParam(value = "????????????", required = true) @PathVariable("answSeq") Long answSeq,
            @ApiParam(value = "??????", required = true) @RequestParam("answDiv") @NotNull(message = "{tps.answer.error.notnull.answDiv}") String answDiv,
            @ApiParam(hidden = true) HttpServletRequest request)
            throws Exception {

        try {
            micAnswerService.updateMicAnswerDiv(answSeq, answDiv, request);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg("tps.common.success.update"));
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE ANSWER DIV]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE ANSWER DIV]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "?????? ?????? ??????")
    @PutMapping(value = "/answers/{answSeq}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> putMicAnswer(@ApiParam(value = "????????????", required = true) @PathVariable("answSeq")
    @Min(value = 0, message = "tps.answer.error.min.answSeq") Long answSeq, @ApiParam("????????????") @Valid MicAnswerVO micAnswerVO)
            throws Exception {

        try {
            boolean uploaded = micAnswerService.updateMicAnswer(micAnswerVO);
            String msg = uploaded ? msg("tps.common.success.update") : msg("tps.answer.error.image-upload");

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE ANSWER]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE ANSWER]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    @ApiOperation(value = "?????? ?????? ??????")
    @PostMapping(value = "/answers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postMicAnswer(@ApiParam("????????????") @Valid MicAnswerVO micAnswerVO)
            throws Exception {

        try {
            boolean uploaded = micAnswerService.insertMicAnswer(micAnswerVO);
            String msg = uploaded ? msg("tps.common.success.update") : msg("tps.answer.error.image-upload");

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, msg);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT ANSWER]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT ANSWER]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

}
