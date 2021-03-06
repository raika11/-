package jmnet.moka.core.tps.mvc.codemgt.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtDtlDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtGrpDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtGrpSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgtGrp;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * ????????????
 * 2020. 1. 8. ssc ????????????
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 8. ?????? 2:09:06
 */
@RestController
@Slf4j
@RequestMapping("/api/codemgt-grps")
@Api(tags = {"???????????? API"})
public class CodeMgtRestController extends AbstractCommonController {

    private final CodeMgtService codeMgtService;

    public CodeMgtRestController(CodeMgtService codeMgtService) {
        this.codeMgtService = codeMgtService;
    }

    /**
     * ?????? ????????????
     *
     * @param search ????????????
     * @return ?????????????????? ??????sercret
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping
    public ResponseEntity<?> getCodeMgtGrpList(@Valid @SearchParam CodeMgtGrpSearchDTO search) {
        // ??????
        Page<CodeMgtGrp> returnValue = codeMgtService.findAllCodeMgtGrp(search);

        // ????????? ??????
        ResultListDTO<CodeMgtGrpDTO> resultListMessage = new ResultListDTO<CodeMgtGrpDTO>();
        List<CodeMgtGrpDTO> dtoList = modelMapper.map(returnValue.getContent(), CodeMgtGrpDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<CodeMgtGrpDTO>> resultDto = new ResultDTO<ResultListDTO<CodeMgtGrpDTO>>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ????????????. ???????????????.
     *
     * @param grpCd  rmfnq??????
     * @param search ????????????
     * @return ?????? ??????
     * @throws Exception
     * @throws InvalidDataException
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/{grpCd}/codemgts")
    public ResponseEntity<?> getCodeMgtList(@ApiParam("????????????(??????)") @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd,
            @Valid @SearchParam CodeMgtSearchDTO search)
            throws InvalidDataException, Exception {
        // ????????????????????????.
        validSearchData(grpCd, search, ActionType.SELECT);

        // ??????
        Page<CodeMgt> returnValue = codeMgtService.findAllCodeMgt(search, search.getPageable());

        // ????????? ??????
        ResultListDTO<CodeMgtDTO> resultListMessage = new ResultListDTO<CodeMgtDTO>();
        List<CodeMgtDTO> codeDtoList = modelMapper.map(returnValue.getContent(), CodeMgtDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(codeDtoList);

        ResultDTO<ResultListDTO<CodeMgtDTO>> resultDto = new ResultDTO<ResultListDTO<CodeMgtDTO>>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ?????? ????????????. ???????????????.
     *
     * @param grpCd ????????????
     * @return ?????? ??????
     * @throws Exception
     * @throws InvalidDataException
     */
    @ApiOperation(value = "???????????? ?????? ????????????")
    @GetMapping("/{grpCd}/use-codemgts")
    public ResponseEntity<?> getUseCodeMgtList(@ApiParam("????????????(??????)") @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd) {

        // ??????
        List<CodeMgt> returnValue = codeMgtService.findUseList(grpCd);

        // ????????? ??????
        ResultListDTO<CodeMgtDTO> resultListMessage = new ResultListDTO<CodeMgtDTO>();
        List<CodeMgtDTO> codeDtoList = modelMapper.map(returnValue, CodeMgtDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(codeDtoList);

        ResultDTO<ResultListDTO<CodeMgtDTO>> resultDto = new ResultDTO<ResultListDTO<CodeMgtDTO>>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ????????????
     *
     * @param grpCd ???????????? (??????)
     * @return ????????????????????????
     * @throws NoDataException ?????????????????? ????????? ??????
     * @throws Exception       ????????????
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/{grpCd}")
    public ResponseEntity<?> getCodeMgtGrp(
            @ApiParam("????????????(??????)") @PathVariable("grpCd") @NotNull(message = "{tps.codeMgt.error.notnul.grpCd}") String grpCd)
            throws NoDataException, Exception {

        // ????????????????????????.
        //        validGrpData(request, seqNo, null, principal, processStartTime, ActionType.SELECT);


        CodeMgtGrp codeMgtGrp = codeMgtService
                .findByGrpCd(grpCd)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        // ?????????????????? ??????
        Long count = codeMgtService.countCodeMgtByGrpCd(codeMgtGrp.getGrpCd());

        CodeMgtGrpDTO dto = modelMapper.map(codeMgtGrp, CodeMgtGrpDTO.class);
        dto.setCountCodeMgt(count);

        ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ????????? ??????
     *
     * @param seqNo         ???????????????????????????. 0?????? ???????????? ????????? ??????
     * @param codeMgtGrpDTO ????????????????????????
     * @param actionType    ????????????(INSERT OR UPDATE)
     * @throws InvalidDataException ????????????????????????
     * @throws Exception            ????????????
     */
    private void validGrpData(Long seqNo, CodeMgtGrpDTO codeMgtGrpDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtGrpDTO != null) {
            // url id??? json??? id??? ???????????? ??????
            if (seqNo > 0 && !seqNo.equals(codeMgtGrpDTO.getSeqNo())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // grpCd????????????
            int countGrpCd = codeMgtService.countCodeMgtGrpByGrpCd(codeMgtGrpDTO.getGrpCd());
            if ((seqNo == 0 && countGrpCd > 0) || seqNo > 0 && countGrpCd > 1) {
                String message = messageByLocale.get("tps.codeMgtGrp.error.invalid.dupGrpCd");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * ???????????? ????????? ??????
     *
     * @param grpCd            ???????????????????????????
     * @param codeMgtSearchDTO ????????????
     * @param actionType       ????????????(INSERT OR UPDATE)
     * @throws InvalidDataException ????????????????????????
     * @throws Exception            ????????????
     */
    private void validSearchData(String grpCd, CodeMgtSearchDTO codeMgtSearchDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtSearchDTO != null) {
            // url id??? json??? id??? ???????????? ??????
            if (!grpCd.equals(codeMgtSearchDTO.getGrpCd())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * ????????????
     *
     * @param codeMgtGrpDTO ????????? ??????????????????
     * @return ????????? ???????????????
     * @throws Exception
     */
    @ApiOperation(value = "????????????")
    @PostMapping(headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postCodeMgtGrp(@RequestBody @Valid CodeMgtGrpDTO codeMgtGrpDTO)
            throws Exception {

        // ????????????????????????.
        validGrpData((long) 0, codeMgtGrpDTO, ActionType.INSERT);

        CodeMgtGrp codeMgtGrp = modelMapper.map(codeMgtGrpDTO, CodeMgtGrp.class);

        try {
            // ??????
            CodeMgtGrp returnValue = codeMgtService.insertCodeMgtGrp(codeMgtGrp);

            // ????????????
            CodeMgtGrpDTO dto = modelMapper.map(returnValue, CodeMgtGrpDTO.class);

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT CODE_MGT_GRP]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT CODE_MGT_GRP]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.insert"), e);
        }
    }

    /**
     * ????????????
     *
     * @param seqNo         ????????????
     * @param codeMgtGrpDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws InvalidDataException ????????? ???????????????
     * @throws NoDataException      ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "?????? ??????")
    @PutMapping(value = "/{seqNo}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putCodeMgtGrp(
            @ApiParam("???????????? ????????????(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgtGrp.error.min.seqNo}") Long seqNo,
            @RequestBody @Valid CodeMgtGrpDTO codeMgtGrpDTO)
            throws InvalidDataException, NoDataException, Exception {

        // ????????????????????????.
        validGrpData(seqNo, codeMgtGrpDTO, ActionType.UPDATE);

        CodeMgtGrp newCodeMgtGrp = modelMapper.map(codeMgtGrpDTO, CodeMgtGrp.class);
        CodeMgtGrp orgCodeMgtGrp = codeMgtService
                .findByGrpSeqNo(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        try {
            // ??????
            CodeMgtGrp returnValue = codeMgtService.updateCodeMgtGrp(newCodeMgtGrp);

            // ????????????
            CodeMgtGrpDTO dto = modelMapper.map(returnValue, CodeMgtGrpDTO.class);

            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<CodeMgtGrpDTO> resultDto = new ResultDTO<CodeMgtGrpDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CODE_MGT_GRP]", e);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE CODE_MGT_GRP]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.update"), e);
        }
    }

    /**
     * ????????????
     *
     * @param seqNo ?????? ??? ???????????? (??????)
     * @return ??????????????????
     * @throws NoDataException ??????????????? ?????? ??????
     * @throws Exception       ????????????
     */
    @ApiOperation(value = "?????? ??????")
    @DeleteMapping("/{seqNo}")
    public ResponseEntity<?> deleteCodeMgtGrp(
            @ApiParam("???????????? ????????????(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgtGrp.error.min.seqNo}") Long seqNo)
            throws NoDataException, Exception {
        // 1. ????????? ???????????? ??????
        CodeMgtGrp codeMgtGrp = codeMgtService
                .findByGrpSeqNo(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        // 2. ??????
        try {
            codeMgtService.deleteCodeMgtGrp(codeMgtGrp);

            String message = messageByLocale.get("tps.common.success.delete");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE CODE_MGT_GRP] seqNo: {} {}", seqNo, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE CODE_MGT_GRP]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.delete"), e);
        }
    }

    /**
     * ???????????? ??????
     *
     * @param seqNo ???????????? (??????)
     * @return ????????????
     * @throws NoDataException      ?????? ????????? ??????
     * @throws InvalidDataException ?????? ????????? ????????????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/codemgts/{seqNo}")
    public ResponseEntity<?> getCodeMgt(
            @ApiParam("???????????? ????????????(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgt.error.min.seqNo}") Long seqNo)
            throws NoDataException, InvalidDataException, Exception {

        // ????????????????????????.
        validData(seqNo, null, ActionType.SELECT);

        CodeMgt codeMgt = codeMgtService
                .findBySeqNo(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        CodeMgtDTO dto = modelMapper.map(codeMgt, CodeMgtDTO.class);
        ResultDTO<CodeMgtDTO> resultDto = new ResultDTO<CodeMgtDTO>(dto);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ????????? ??????
     *
     * @param seqNo      ?????? ??????. 0?????? ???????????? ????????? ??????
     * @param codeMgtDTO ????????????
     * @param actionType ????????????(INSERT OR UPDATE)
     * @throws InvalidDataException ????????????????????????
     * @throws Exception            ????????????
     */
    private void validData(Long seqNo, CodeMgtDTO codeMgtDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (codeMgtDTO != null) {
            // url id??? json??? id??? ???????????? ??????
            if (seqNo > 0 && !seqNo.equals(codeMgtDTO.getSeqNo())) {
                String message = messageByLocale.get("tps.common.error.no-data");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // ????????? grpSeqNo?????? ??????
            Long grpSeqNo = codeMgtDTO
                    .getCodeMgtGrp()
                    .getSeqNo();
            if (grpSeqNo == null || grpSeqNo < 0) {
                String message = messageByLocale.get("tps.codeMgtGrp.error.min.seqNo");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

            // ??????????????? ?????? ??????
            String grpCd = codeMgtDTO
                    .getCodeMgtGrp()
                    .getGrpCd();
            if (McpString.isEmpty(grpCd)) {
                String message = messageByLocale.get("tps.codeMgtGrp.error.notnull.grpCd");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("grpCd", message));
            }

            // ??????????????? ???????????? ??????
            if (McpString.isNotEmpty(grpCd) && grpSeqNo > 0) {
                Optional<CodeMgtGrp> codeMgtGrp = codeMgtService.findByGrpSeqNo(grpSeqNo);
                if (!codeMgtGrp.isPresent()) {
                    String message = messageByLocale.get("tps.codeMgtGrp.error.notnull.grpCd");
                    tpsLogger.fail(actionType, message, true);
                    invalidList.add(new InvalidDataDTO("grpCd", message));
                } else {
                    if (!codeMgtGrp
                            .get()
                            .getGrpCd()
                            .equals(grpCd)) {
                        String message = messageByLocale.get("tps.codeMgt.error.invalid.matchGrpCd");
                        tpsLogger.fail(actionType, message, true);
                        invalidList.add(new InvalidDataDTO("grpCd", message));
                    }
                }
            }

            // dtlCd????????????
            int countDtls = codeMgtService.countCodeMgtByDtlCd(grpCd, codeMgtDTO.getDtlCd());
            if ((seqNo == 0 && countDtls > 0) || seqNo > 0 && countDtls > 1) {
                String message = messageByLocale.get("tps.codeMgt.error.invalid.dupDtlCd");
                tpsLogger.fail(actionType, message, true);
                invalidList.add(new InvalidDataDTO("dtlCd", message));
            }
        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * ????????????
     *
     * @param codeMgtDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws Exception
     */
    @ApiOperation(value = "????????????")
    @PostMapping(value = "/codemgts", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postCodeMgt(@RequestBody @Valid CodeMgtDTO codeMgtDTO)
            throws Exception {

        // ????????????????????????.
        validData((long) 0, codeMgtDTO, ActionType.INSERT);

        // ??????
        CodeMgt codeMgt = modelMapper.map(codeMgtDTO, CodeMgt.class);
        try {
            CodeMgt returnValue = codeMgtService.insertCodeMgt(codeMgt);

            // ????????????
            CodeMgtDTO dto = modelMapper.map(returnValue, CodeMgtDTO.class);

            String message = messageByLocale.get("tps.common.success.insert");
            ResultDTO<CodeMgtDTO> resultDTO = new ResultDTO<CodeMgtDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT CODE_MGT]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT CODE_MGT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.insert"), e);
        }
    }

    /**
     * ????????????
     *
     * @param seqNo      ?????????
     * @param codeMgtDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws InvalidDataException ????????? ???????????????
     * @throws NoDataException      ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "????????????")
    @PutMapping(value = "/codemgts/{seqNo}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putCodeMgt(
            @ApiParam("???????????? ????????????(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgt.error.min.seqNo}") Long seqNo,
            @RequestBody @Valid CodeMgtDTO codeMgtDTO)
            throws InvalidDataException, NoDataException, Exception {
        // ????????????????????????.
        validData(seqNo, codeMgtDTO, ActionType.UPDATE);

        // ??????
        CodeMgt newCodeMgt = modelMapper.map(codeMgtDTO, CodeMgt.class);
        CodeMgt orgCodeMgt = codeMgtService
                .findBySeqNo(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });

        try {
            CodeMgt returnValue = codeMgtService.updateCodeMgt(newCodeMgt);

            // ????????????
            CodeMgtDTO dto = modelMapper.map(returnValue, CodeMgtDTO.class);

            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<CodeMgtDTO> resultDTO = new ResultDTO<CodeMgtDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CODE_MGT] seqNo: {} {}", seqNo, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE CODE_MGT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.update"), e);
        }

    }


    /**
     * ????????????
     *
     * @param seqNo ?????? ??? ???????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ???????????? ?????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "????????????")
    @DeleteMapping("/codemgts/{seqNo}")
    public ResponseEntity<?> deleteCodeMgt(
            @ApiParam("???????????? ????????????(??????)") @PathVariable("seqNo") @Min(value = 0, message = "{tps.codeMgt.error.min.seqNo}") Long seqNo)
            throws InvalidDataException, NoDataException, Exception {
        // 1. ????????? ???????????? ??????
        CodeMgt codeMgt = codeMgtService
                .findBySeqNo(seqNo)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        try {
            // 2. ??????
            codeMgtService.deleteCodeMgt(codeMgt);

            // 3. ????????????
            String message = messageByLocale.get("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DELETE CODE_MGT] seqNo: {} {}", seqNo, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE CODE_MGT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.delete"), e);
        }
    }

    /**
     * ??????????????????
     *
     * @param grpCd ???????????? (??????)
     * @param dtlCd ???????????? (??????)
     * @return ????????????
     * @throws NoDataException      ?????? ????????? ??????
     * @throws InvalidDataException ?????? ????????? ????????????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/{grpCd}/special-char/{dtlCd}")
    public ResponseEntity<?> getSpecialChar(@ApiParam("????????????(??????)") @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd,
            @ApiParam("????????????(??????)") @PathVariable("dtlCd")
            @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.dtlCd}") String dtlCd)
            throws InvalidDataException, Exception {
        // specialChar
        // ??????
        List<CodeMgt> returnValue = codeMgtService.findByDtlCd(grpCd, dtlCd);
        CodeMgtDtlDTO codeMgtDtlDTO = null;

        for (CodeMgt cc : returnValue) {
            codeMgtDtlDTO = CodeMgtDtlDTO
                    .builder()
                    .grpCd(cc
                            .getCodeMgtGrp()
                            .getGrpCd())
                    .dtlCd(cc.getDtlCd())
                    .cdNm(cc.getCdNm())
                    .build();
            break;
        }
        ResultDTO<CodeMgtDtlDTO> resultDto = new ResultDTO<>(codeMgtDtlDTO);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????????????????
     *
     * @param grpCd         ?????????
     * @param codeMgtDtlDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws InvalidDataException ????????? ???????????????
     * @throws NoDataException      ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "????????????")
    @PutMapping("/{grpCd}/special-char")
    public ResponseEntity<?> putCodeMgtDtl(
            @ApiParam("????????????(??????)") @PathVariable("grpCd") @NotNull(message = "{tps.codeMgt.error.notnul.grpCd}") String grpCd,
            @Valid CodeMgtDtlDTO codeMgtDtlDTO)
            throws InvalidDataException, NoDataException, Exception {


        // ??????
        List<CodeMgt> result = codeMgtService.findByDtlCd(grpCd, codeMgtDtlDTO.getDtlCd());

        if (result.size() == 0) {
            String message = messageByLocale.get("tps.common.error.no-data");
            tpsLogger.fail(ActionType.UPDATE, message, true);
            throw new NoDataException(message);
        }

        try {

            // ???????????? ??????
            //CodeMgt result = codeMgtService.findByDtlCd(grpCd, codeMgtDtlDTO.getDtlCd()).get(0);
            codeMgtDtlDTO.setSeqNo(result
                    .get(0)
                    .getSeqNo());
            CodeMgtDtlDTO returnValue = codeMgtService.updateCodeMgtDtl(codeMgtDtlDTO);

            // ????????????
            CodeMgtDtlDTO dto = modelMapper.map(returnValue, CodeMgtDtlDTO.class);

            String message = messageByLocale.get("tps.common.success.update");
            ResultDTO<CodeMgtDtlDTO> resultDTO = new ResultDTO<CodeMgtDtlDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CODE_MGT] seqNo: {} {}", grpCd, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE CODE_MGT]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.update"), e);
        }

    }

    /**
     * ?????? ??????????????? ?????? ??????
     *
     * @param grpCd ??????ID
     * @return ????????????
     */
    @ApiOperation(value = "?????? ??????????????? ?????? ??????")
    @GetMapping("/{grpCd}/exists")
    public ResponseEntity<?> duplicateCheckGrpCd(@ApiParam("????????????(??????)") @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd)
            throws Exception {

        try {
            boolean duplicated = codeMgtService.isDuplicatedGrpCd(grpCd);
            String message = "";
            if (duplicated) {
                message = messageByLocale.get("tps.codeMgtGrp.error.duplicate.grpCd");
            }

            ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DUPLICATE GRPCD] : reservedId {} {}", grpCd, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DUPLICATE GRPCD]", e, true);
            throw new Exception(messageByLocale.get("tps.codeMgt.error.duplicate.dtlCd"));
        }
    }

    /**
     * ?????? ????????? ?????? ??????
     *
     * @param dtlCd ??????ID
     * @return ????????????
     */
    @ApiOperation(value = "?????? ????????? ?????? ??????")
    @GetMapping("/{grpCd}/{dtlCd}/exists")
    public ResponseEntity<?> duplicateCheckDtlCd(@ApiParam("????????????(??????)") @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd,
            @ApiParam("????????????(??????)") @PathVariable("dtlCd")
            @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgt.error.pattern.dtlCd}") String dtlCd)
            throws Exception {

        try {
            boolean duplicated = codeMgtService.isDuplicatedDtlCd(grpCd, dtlCd);
            String message = "";
            if (duplicated) {
                message = messageByLocale.get("tps.codeMgt.error.duplicate.dtlCd");
            }

            ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DUPLICATE DTLCD] : dtlCd {} {}", dtlCd, e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DUPLICATE DTLCD]", e, true);
            throw new Exception(messageByLocale.get("tps.codeMgt.error.duplicate.dtlCd"));
        }
    }

    /**
     * ?????? ????????????(abTest???)
     *
     * @param grpCd ????????????
     * @param dtlCd ????????????
     * @return ??????????????????
     * @throws Exception
     */
    @ApiOperation(value = "?????? ????????????(abTest???)")
    @GetMapping("/{grpCd}/abtest/{dtlCd}")
    public ResponseEntity<?> getAbTest(@ApiParam(value = "????????????(??????)", required = true) @PathVariable("grpCd")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}") String grpCd,
            @ApiParam(value = "????????????(??????)", required = true) @PathVariable("dtlCd")
            @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgt.error.pattern.dtlCd}") String dtlCd)
            throws Exception {

        // ????????????????????????.
        //        validData(seqNo, null, ActionType.SELECT);

        List<CodeMgt> returnValue = codeMgtService.findByDtlCd(grpCd, dtlCd);

        ResultDTO<CodeMgtDTO> resultDto = new ResultDTO<CodeMgtDTO>();
        if (returnValue.size() > 0) {
            CodeMgtDTO dto = modelMapper.map(returnValue.get(0), CodeMgtDTO.class);
            resultDto.setBody(dto);
        }
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}

