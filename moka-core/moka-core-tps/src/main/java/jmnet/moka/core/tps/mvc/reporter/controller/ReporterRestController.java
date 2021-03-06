package jmnet.moka.core.tps.mvc.reporter.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterJamSaveDTO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterJamUpdateDTO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSimpleDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import jmnet.moka.core.tps.mvc.reporter.service.ReporterService;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterSaveVO;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * ????????????
 * 2020. 11. 09. ssc ????????????
 * RequestMapping ?????? ??????
 * RESTful ????????? ???????????? ???????????? ?????? ?????? ????????? ????????? ?????? '-' ??????
 * ????????? ?????? ??????
 * ?????? ?????? : get{Target}List, HttpMethod = GET
 * ?????? : get{Target}, HttpMethod = GET
 * ??????  : put{Target}, HttpMethod = PUT
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 8. ?????? 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/reporters")
@Api(tags = {"?????? API"})
public class ReporterRestController extends AbstractCommonController {

    private final ReporterService reporterService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final TpsLogger tpsLogger;

    @Autowired
    private RestTemplateHelper restTemplateHelper;

    public ReporterRestController(ReporterService reporterService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger) {
        this.reporterService = reporterService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * ????????????????????????
     *
     * @param search ???????????? : ????????????
     * @return ????????????
     */
    @ApiOperation(value = "???????????? ?????? ??????")
    @GetMapping
    public ResponseEntity<?> getReporterList(@Valid @SearchParam ReporterSearchDTO search) {

        // ??????(mybatis)
        List<ReporterVO> returnValue = reporterService.findAllReporter(search);

        // ????????? ??????
        ResultListDTO<ReporterVO> resultList = new ResultListDTO<ReporterVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<ReporterVO>> resultDTO = new ResultDTO<ResultListDTO<ReporterVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ???????????? ??????
     *
     * @param request ??????
     * @param repSeq  ?????????????????? (??????)
     * @return ????????????
     * @throws NoDataException ?????? ????????? ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @GetMapping("/{repSeq}")
    public ResponseEntity<?> getReportMgr(HttpServletRequest request, @ApiParam("?????? ????????????") @PathVariable("repSeq")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.reporter.error.pattern.repSeq}") String repSeq)
            throws NoDataException {
        // ??????(mybatis)
        ReporterVO returnValue = reporterService.findBySeq(repSeq);
        ResultDTO<ReporterVO> resultDTO = new ResultDTO<ReporterVO>(returnValue);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ??????
     *
     * @param request           ??????
     * @param repSeq            ??????????????????
     * @param reporterSimpleDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @PutMapping("/{repSeq}")
    public ResponseEntity<?> putReporter(HttpServletRequest request, @ApiParam("?????? ????????????") @PathVariable("repSeq")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.reporter.error.pattern.repSeq}") String repSeq, @Valid ReporterSimpleDTO reporterSimpleDTO)
            throws Exception {

        // GroupDTO -> Group ??????
        String infoMessage = messageByLocale.get("tps.reporter.error.no-data", request);
        String cd1Nm = reporterSimpleDTO.getR1CdNm();
        String cd2Nm = reporterSimpleDTO.getR2CdNm();
        String cd3Nm = reporterSimpleDTO.getR3CdNm();
        String cd4Nm = reporterSimpleDTO.getR4CdNm();

        Reporter newReporter = modelMapper.map(reporterSimpleDTO, Reporter.class);
        newReporter.setRepSeq(repSeq);

        reporterService
                .findReporterById(newReporter.getRepSeq())
                .orElseThrow(() -> new NoDataException(infoMessage));


        try {
            // update
            Reporter returnValue = reporterService.updateReporter(newReporter);

            // ????????????
            ReporterSimpleDTO dto = modelMapper.map(returnValue, ReporterSimpleDTO.class);
            dto.setR1CdNm(cd1Nm);
            dto.setR2CdNm(cd2Nm);
            dto.setR3CdNm(cd3Nm);
            dto.setR4CdNm(cd4Nm);
            ResultDTO<ReporterSimpleDTO> resultDto = new ResultDTO<ReporterSimpleDTO>(dto, msg("tps.common.success.insert"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE REPORTER] seq: {} {}", reporterSimpleDTO.getRepSeq(), e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE DATASET]", e, true);
            throw new Exception(messageByLocale.get("tps.reporter.error.save", request), e);
        }
    }

    /**
     * ?????? ??????
     *
     * @param reporterJamSaveDTO ????????? ?????? ??????
     * @return
     */
    @ApiOperation(value = "?????? ??????")
    @PostMapping("/createByJam")
    public ResponseEntity<?> createByJam(HttpServletRequest request, @Valid ReporterJamSaveDTO reporterJamSaveDTO)
            throws Exception {
        String result = "";
        String message = "";
        String State = "";

        String serverChk = request.getHeader("MOKA_SERVER");
        log.info("serverChk {} ", serverChk);

        // ???????????? ??? BACKOFFICE ?????? ??? ?????? ??????
        if (McpString.isEmpty(serverChk) || (McpString.isNotEmpty(serverChk) && !serverChk.equals("JAM"))) {
            String errMsg = msg("tps.reporter.error.notConnect");
            message = "State = N, ErrMsg = " + errMsg;
            return new ResponseEntity<>(message, HttpStatus.OK);
        }

        // JAM ?????? ???????????? ??????(?????????)
        if (reporterJamSaveDTO.getJamRepSeq() == 0) {
            String errMsg = msg("tps.reporter.error.error.notnull.jamRepSeq");
            message = "State = N, ErrMsg = " + errMsg;
            return new ResponseEntity<>(message, HttpStatus.OK);
        }

        String date = McpDate.dateStr(reporterJamSaveDTO.getRegDt(), "yyyyMMdd");
        int dt = Integer.parseInt(McpDate.dateStr(reporterJamSaveDTO.getRegDt(), "yyyyMMdd"));
        String date1 = String.valueOf(dt + 1);

        //md5 hash check   MD5(jcms??????????????????(??????:0) + jam??????????????????+ yyyymmdd)
        String hasedKey1 = getMD5("0" + reporterJamSaveDTO
                .getJamRepSeq()
                .toString() + date);  //   DateTime.Now.ToString("yyyyMMdd")

        String hasedKey2 = getMD5("0" + reporterJamSaveDTO
                .getJamRepSeq()
                .toString() + date1);

        log.info("hasedKey1 {} ", hasedKey1);
        log.info("hasedKey2 {} ", hasedKey2);

        if (!reporterJamSaveDTO
                .getHash()
                .equals(hasedKey1) && !reporterJamSaveDTO
                .getHash()
                .equals(hasedKey2)) {
            String errMsg = msg("tps.reporter.error.notConnect");
            message = "State = N, ErrMsg = " + errMsg;
            return new ResponseEntity<>(message, HttpStatus.OK);
        }

        ReporterSaveVO reporterSaveVO = modelMapper.map(reporterJamSaveDTO, ReporterSaveVO.class);

        try {
            int repSeq = reporterService.insertReporters(reporterSaveVO);

            if (McpString.isNotEmpty(repSeq)) {
                if (repSeq > 0) {
                    State = "Y";
                    result = "State = " + State + ", JamRepSeq =" + reporterJamSaveDTO.getJamRepSeq() + ", RepSeq =" + repSeq;
                    // ?????? ????????? ?????? ?????? ??????
                    tpsLogger.success(ActionType.INSERT);
                } else {
                    State = "N";
                    String errMsg = msg("tps.reporter.error.duplicate.repSeq");
                    result = "State = " + State + ", ErrMsg =" + errMsg;
                }
            }
        } catch (Exception e) {
            String errMsg = msg("tps.reporter.error.job");
            result = "State = " + State + ", ErrMsg =" + errMsg;
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * ?????? ??????
     *
     * @param reporterJamUpdateDTO ????????? ?????? ??????
     * @return
     */
    @ApiOperation(value = "?????? ??????")
    @PutMapping(value = "/changeByJam")
    public ResponseEntity<?> changeByJam(HttpServletRequest request, @Valid ReporterJamUpdateDTO reporterJamUpdateDTO)
            throws Exception {
        String result = "";
        String message = "";
        String State = "";

        String serverChk = request.getHeader("MOKA_SERVER");
        log.info("serverChk {} ", serverChk);

        if (McpString.isEmpty(serverChk) || (McpString.isNotEmpty(serverChk) && !serverChk.equals("JAM"))) {
            String errMsg = msg("tps.reporter.error.notConnect");
            message = "State = N, ErrMsg = " + errMsg;
            return new ResponseEntity<>(message, HttpStatus.OK);
        }

        // ?????? ???????????? ??????(?????????)
        if (McpString.isEmpty(reporterJamUpdateDTO.getRepSeq()) || reporterJamUpdateDTO.getRepSeq() == 0) {
            String errMsg = msg("tps.reporter.error.error.notnull.repSeq");
            message = "State = N, ErrMsg = " + errMsg;
            return new ResponseEntity<>(message, HttpStatus.OK);
        }
        // JAM ?????? ???????????? ??????(?????????)
        if (McpString.isEmpty(reporterJamUpdateDTO.getJamRepSeq()) || reporterJamUpdateDTO.getJamRepSeq() == 0) {
            String errMsg = msg("tps.reporter.error.error.notnull.jamRepSeq");
            message = "State = N, ErrMsg = " + errMsg;
            return new ResponseEntity<>(message, HttpStatus.OK);
        }

        String date = McpDate.dateStr(reporterJamUpdateDTO.getModDt(), "yyyyMMdd");
        int dt = Integer.parseInt(McpDate.dateStr(reporterJamUpdateDTO.getModDt(), "yyyyMMdd"));
        String date1 = String.valueOf(dt + 1);

        //md5 hash check MD5(jcms?????????????????? + jam??????????????????+ yyyymmdd)
        String hasedKey1 = getMD5(reporterJamUpdateDTO
                .getRepSeq()
                .toString() + reporterJamUpdateDTO
                .getJamRepSeq()
                .toString() + date);

        String hasedKey2 = getMD5(reporterJamUpdateDTO
                .getRepSeq()
                .toString() + reporterJamUpdateDTO
                .getJamRepSeq()
                .toString() + date1);

        log.info("hasedKey1 {} ", hasedKey1);
        log.info("hasedKey2 {} ", hasedKey2);

        if (!reporterJamUpdateDTO
                .getHash()
                .equals(hasedKey1) && !reporterJamUpdateDTO
                .getHash()
                .equals(hasedKey2)) {

            String errMsg = msg("tps.reporter.error.notConnect");
            message = "State = N, ErrMsg = " + errMsg;
            return new ResponseEntity<>(message, HttpStatus.OK);
        }

        ReporterSaveVO reporterSaveVO = modelMapper.map(reporterJamUpdateDTO, ReporterSaveVO.class);
        try {
            int repSeqChk = reporterService.updateReporters(reporterSaveVO);

            log.info("repSeqChk {} ", repSeqChk);

            if (McpString.isNotEmpty(repSeqChk)) {
                if (repSeqChk > 0) {
                    State = "Y";
                    result = "State = " + State + ", JamRepSeq =" + reporterJamUpdateDTO.getJamRepSeq() + ", RepSeq ="
                            + reporterJamUpdateDTO.getRepSeq();
                    // ?????? ????????? ?????? ?????? ??????
                    tpsLogger.success(ActionType.UPDATE);
                } else {
                    State = "N";
                    String errMsg = msg("tps.reporter.error.update.repSeq");
                    result = "State = " + State + ", ErrMsg =" + errMsg;
                }
            }
        } catch (Exception e) {
            String errMsg = msg("tps.reporter.error.job");
            result = "State = " + State + ", ErrMsg =" + errMsg;
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    public static String getMD5(String str) {
        MessageDigest m = null;
        String rtnMD5 = "";
        try {
            m = MessageDigest.getInstance("MD5");
            m.update(str.getBytes(), 0, str.length());
            rtnMD5 = new BigInteger(1, m.digest())
                    .toString(16)
                    .toUpperCase();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            rtnMD5 = null;
        }
        return rtnMD5;
    }
}
