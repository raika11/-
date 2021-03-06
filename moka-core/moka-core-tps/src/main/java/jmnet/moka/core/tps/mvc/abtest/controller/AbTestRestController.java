package jmnet.moka.core.tps.mvc.abtest.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.abtest.dto.AbTestCaseAllDTO;
import jmnet.moka.core.tps.mvc.abtest.dto.AbTestCaseResultDTO;
import jmnet.moka.core.tps.mvc.abtest.dto.AbTestCaseSaveDTO;
import jmnet.moka.core.tps.mvc.abtest.dto.AbTestCaseSearchDTO;
import jmnet.moka.core.tps.mvc.abtest.entity.AbTestCase;
import jmnet.moka.core.tps.mvc.abtest.service.AbTestCaseService;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseResultDtlVO;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseResultVO;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseSaveVO;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * ABTest API Controller
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abtest.controller
 * ClassName : ABTestRestController
 * Created : 2021-04-15
 * </pre>
 *
 * @author ince
 * @since 2021-04-15 09:54
 */

@RestController
@RequestMapping("/api/ab-test")
@Slf4j
@Api(tags = {"A/B????????? API"})
public class AbTestRestController extends AbstractCommonController {

    private final AbTestCaseService abTestCaseService;

    public AbTestRestController(AbTestCaseService abTestCaseService) {
        this.abTestCaseService = abTestCaseService;
    }

    /**
     * ABTest ?????? ??????
     *
     * @param search ????????????
     * @return API?????? ??????
     */
    @ApiOperation(value = "A/B????????? ?????? ??????")
    @GetMapping
    public ResponseEntity<?> getAbTestCaseList(@Valid @SearchParam AbTestCaseSearchDTO search) {

        ResultListDTO<AbTestCaseVO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<AbTestCaseVO> returnValue = abTestCaseService.findAllList(search);

        // ????????? ??????
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(returnValue.getContent());


        ResultDTO<ResultListDTO<AbTestCaseVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ABTest ?????? ?????? ??????
     *
     * @param abtestSeq A/B????????? ???????????? (??????)
     * @return ABTest??????
     * @throws NoDataException A/B????????? ????????? ??????
     */
    @ApiOperation(value = "A/B????????? ?????? ??????")
    @GetMapping("/{abtestSeq}")
    public ResponseEntity<?> getABTest(@ApiParam("A/B????????? ????????????(??????)") @PathVariable("abtestSeq")
    @Size(min = 1, max = 4, message = "{tps.abtest.error.notnull.abtestSeq}") Long abtestSeq)
            throws NoDataException {

        // ??????
        AbTestCaseSaveVO returnValue = abTestCaseService.findABTestById(abtestSeq);

        AbTestCaseAllDTO dto = modelMapper.map(returnValue, AbTestCaseAllDTO.class);

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<AbTestCaseAllDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ABTest ??????
     *
     * @param abTestCaseSaveDTO ????????? ABTest ??????
     * @return ????????? ???????????????
     * @throws Exception ????????????
     */
    @ApiOperation(value = "A/B????????? ??????")
    @PostMapping(headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postABTest(@ApiParam("A/B????????? ??????") @RequestBody @Valid AbTestCaseSaveDTO abTestCaseSaveDTO)
            throws Exception {

        AbTestCaseSaveVO abTestCaseSaveVO = modelMapper.map(abTestCaseSaveDTO, AbTestCaseSaveVO.class);

        if (McpString.isNotEmpty(abTestCaseSaveVO.getDupChk())) {
            if (abTestCaseSaveVO
                    .getDupChk()
                    .equals("Y")) {

                List<AbTestCase> abtestCase = abTestCaseService.findChk(abTestCaseSaveDTO);

                //?????? ?????? - ?????????, ??????, ?????????????????? ???????????? ?????? ???????????? ????????????  ?????? ?????? ??????
                if (McpString.isNotEmpty(abtestCase)) {
                    if (McpString.isNotEmpty(abtestCase
                            .get(0)
                            .getAbtestSeq())) {
                        log.info("getAbtestSeq {}", abtestCase
                                .get(0)
                                .getAbtestSeq());
                        throw new Exception(messageByLocale.get("tps.abtest.error.insert.dup", abtestCase
                                .get(0)
                                .getPageValue(), abtestCase
                                .get(0)
                                .getAbtestPurpose()));
                    }
                }

            }

        }

        try {

            // insert
            Integer abtestSeq = abTestCaseService.insertABTestCase(abTestCaseSaveVO);

            AbTestCaseAllDTO dto = modelMapper.map(abTestCaseSaveVO, AbTestCaseAllDTO.class);

            String message = "";
            if (abtestSeq != 0) {
                message = msg("tps.common.success.insert");
                dto.setAbtestSeq(abtestSeq);
            } else {
                message = msg("tps.common.error.insert");
            }

            ResultDTO<AbTestCaseAllDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO ABTest INSERT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO ABTest INSERT]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * ABTest ??????
     *
     * @param abTestCaseSaveDTO
     * @return ABTest ??????
     * @throws Exception A/B????????? ?????? ?????? ?????? ??????
     */
    @ApiOperation(value = "A/B????????? ??????")
    @PutMapping(value = "/{abtestSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putAbTestCase(@ApiParam("A/B????????? ???????????? (??????)") @PathVariable("abtestSeq")
    @Size(min = 1, max = 4, message = "{tps.abtest.error.notnull.abtestSeq}") Long abtestSeq,
            @ApiParam("A/B????????? ??????") @RequestBody @Valid AbTestCaseSaveDTO abTestCaseSaveDTO)
            throws Exception {

        // STEP 2 ???????????? ??? ??????
        AbTestCaseSaveVO abTestCaseSaveVO = modelMapper.map(abTestCaseSaveDTO, AbTestCaseSaveVO.class);

        abTestCaseSaveVO.setAbtestSeq(Math.toIntExact(abtestSeq));

        try {
            // ?????? ?????? ??????(mybatis)
            AbTestCase abtestCase = abTestCaseService
                    .findById(abtestSeq)
                    .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

            // update
            Integer chk = abTestCaseService.updateABTestCase(abTestCaseSaveVO);

            AbTestCaseAllDTO dto = modelMapper.map(abTestCaseSaveVO, AbTestCaseAllDTO.class);
            String message = "";
            if (abtestSeq > 0) {
                message = msg("tps.common.success.update");
                dto.setAbtestSeq(chk);
            } else {
                message = msg("tps.common.error.update");
            }

            ResultDTO<AbTestCaseAllDTO> resultDto = new ResultDTO<>(dto, message);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO ABTest UPDATE]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO ABTest UPDATE]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    /**
     * ABTest ??????
     *
     * @param abtestSeq
     * @return ABTest ??????
     * @throws Exception A/B????????? ?????? ?????? ?????? ??????
     */
    @ApiOperation(value = "A/B????????? ??????")
    @PutMapping(value = "/close/{abtestSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putAbTestCaseClose(@ApiParam("A/B????????? ???????????? (??????)") @PathVariable("abtestSeq")
    @Size(min = 1, max = 4, message = "{tps.abtest.error.notnull.abtestSeq}") Long abtestSeq)
            throws Exception {

        try {

            // ?????? ?????? ??????(mybatis)
            AbTestCase abtestCase = abTestCaseService
                    .findById(abtestSeq)
                    .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

            // 2. ??????
            abTestCaseService.closeABTestCase(abtestSeq);

            // 3. ????????????
            String message = msg("tps.abtest.success.close");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.SHUTDOWN, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO CLOSE ABTest] seq: {} {}", abtestSeq, e.getMessage());
            tpsLogger.error(ActionType.SHUTDOWN, "[FAIL TO CLOSE ABTest]", e, true);
            throw new Exception(msg("tps.abtest.error.close"), e);
        }
    }

    /**
     * ABTest ??????
     *
     * @param abtestSeq
     * @return ABTest ??????
     * @throws Exception A/B????????? ?????? ?????? ?????? ??????
     */
    @ApiOperation(value = "A/B????????? ??????")
    @PutMapping(value = "/delete/{abtestSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putAbTestCaseDelete(@ApiParam("A/B????????? ???????????? (??????)") @PathVariable("abtestSeq")
    @Size(min = 1, max = 4, message = "{tps.abtest.error.notnull.abtestSeq}") Long abtestSeq)
            throws Exception {

        try {

            // ?????? ?????? ??????(mybatis)
            AbTestCase abtestCase = abTestCaseService
                    .findById(abtestSeq)
                    .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

            // 2. ??????
            abTestCaseService.deleteABTestCase(abtestSeq);

            // 3. ????????????
            String message = msg("tps.abtest.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE ABTest] seq: {} {}", abtestSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE ABTest]", e, true);
            throw new Exception(msg("tps.abtest.error.delete"), e);
        }
    }

    /**
     * ABTest ?????? ?????? ??????
     *
     * @param search ????????????
     * @return API?????? ??????
     */
    @ApiOperation(value = "A/B????????? ?????? ?????? ??????")
    @GetMapping("/result")
    public ResponseEntity<?> getAbTestCaseResultList(@Valid @SearchParam AbTestCaseSearchDTO search) {

        ResultListDTO<AbTestCaseResultVO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<AbTestCaseResultVO> returnValue = abTestCaseService.findResultList(search);

        // ????????? ??????
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(returnValue.getContent());


        ResultDTO<ResultListDTO<AbTestCaseResultVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ABTest ?????? ?????? ?????? ??????
     *
     * @param abtestSeq A/B????????? ???????????? (??????)
     * @return ABTest??????
     * @throws NoDataException A/B????????? ?????? ????????? ??????
     */
    @ApiOperation(value = "A/B????????? ?????? ?????? ??????")
    @GetMapping("/result/{abtestSeq}")
    public ResponseEntity<?> getABTestResult(@ApiParam("A/B????????? ????????????(??????)") @PathVariable("abtestSeq")
    @Size(min = 1, max = 4, message = "{tps.abtest.error.notnull.abtestSeq}") Long abtestSeq)
            throws NoDataException {

        // ??????
        AbTestCaseResultDtlVO returnValue = abTestCaseService.findABTestResultById(abtestSeq);

        AbTestCaseResultDTO dto = modelMapper.map(returnValue, AbTestCaseResultDTO.class);

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<AbTestCaseResultDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
