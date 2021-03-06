package jmnet.moka.core.tps.mvc.schedule.server.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.encrypt.MokaCrypt;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerCodeDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerSaveDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerUpdateDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentCodeDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentHistoryDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentHistorySearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSaveDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentUpdateDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobDeletedContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobStatisticDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobStatisticSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContentHistory;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobStatistic;
import jmnet.moka.core.tps.mvc.schedule.server.service.DistributeServerService;
import jmnet.moka.core.tps.mvc.schedule.server.service.JobContentHistoryService;
import jmnet.moka.core.tps.mvc.schedule.server.service.JobContentService;
import jmnet.moka.core.tps.mvc.schedule.server.service.JobStatisticService;
import jmnet.moka.core.tps.mvc.schedule.server.vo.JobStatisticVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/api/schedule-server")
@Api(tags = {"????????????????????? API"})
public class ScheduleServerController extends AbstractCommonController {

    //????????????
    private final JobStatisticService jobStatisticService;
    //????????????
    private final DistributeServerService distServerService;
    //??????
    private final JobContentService jobContentService;
    //????????????
    private final JobContentHistoryService jobContentHistoryService;

    //????????? ??????
    private final MokaCrypt mokaCrypt;

    public ScheduleServerController(JobStatisticService jobStatisticService, DistributeServerService distServerService,
            JobContentService jobContentService, JobContentHistoryService jobContentHistoryService, MokaCrypt mokaCrypt) {

        this.jobStatisticService = jobStatisticService;
        this.distServerService = distServerService;
        this.jobContentService = jobContentService;
        this.jobContentHistoryService = jobContentHistoryService;
        this.mokaCrypt = mokaCrypt;
    }


    /**
     * ?????? ???????????? ????????????
     *
     * @param search ???????????? : ??????, ??????, ??????, ????????????, ??????, ????????????, ?????????
     * @return ?????? ???????????? ??????
     */
    @ApiOperation(value = "?????? ???????????? ????????????")
    @GetMapping("/job-statistic")
    public ResponseEntity<?> getJobStatisticList(@Valid @SearchParam JobStatisticSearchDTO search) {
        ResultListDTO<JobStatisticVO> resultListMessage = new ResultListDTO<>();

        Page<JobStatisticVO> returnValue = jobStatisticService.findAllJobStat(search);

        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(returnValue.getContent());

        ResultDTO<ResultListDTO<JobStatisticVO>> resultDTO = new ResultDTO<>(resultListMessage);
        tpsLogger.success(LoggerCodes.ActionType.SELECT);

        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ?????? ???????????? ????????????
     *
     * @param search ???????????? : ??????, ??????, ??????, ????????????, ??????, ????????????, ?????????
     * @return ?????? ???????????? ??????
     */
    @ApiOperation(value = "?????? ???????????? ????????????")
    @GetMapping("/job-statistic/search")
    public ResponseEntity<?> getJobContentList(@Valid @SearchParam JobStatisticSearchDTO search) {
        Page<JobStatistic> returnValue = jobStatisticService.findJobStatisticList(search);

        List<JobStatisticDTO> dtoList = modelMapper.map(returnValue.getContent(), JobStatisticDTO.TYPE);

        ResultListDTO<JobStatisticDTO> resultList = new ResultListDTO<JobStatisticDTO>();
        resultList.setList(dtoList);
        resultList.setTotalCnt(returnValue.getTotalElements());

        ResultDTO<ResultListDTO<JobStatisticDTO>> resultDTO = new ResultDTO<ResultListDTO<JobStatisticDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ?????? ??????(????????????)
     *
     * @param
     * @return ?????? ??????
     */
    @ApiOperation(value = "???????????? ????????????")
    @GetMapping("/job-code")
    public ResponseEntity<?> getJobContentCodeList() {
        List<JobContent> returnValue = jobContentService.findJobContentCodeList();

        ResultListDTO<JobContentCodeDTO> resultListMessage = new ResultListDTO<JobContentCodeDTO>();
        List<JobContentCodeDTO> dtoList = modelMapper.map(returnValue, JobContentCodeDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<JobContentCodeDTO>> resultDto = new ResultDTO<ResultListDTO<JobContentCodeDTO>>(resultListMessage);
        tpsLogger.success(LoggerCodes.ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ????????????
     *
     * @param search ???????????? : ??????, ??????, ??????, ????????????, ????????????, URL
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/job")
    public ResponseEntity<?> getJobContentList(@Valid @SearchParam JobContentSearchDTO search) {
        Page<JobContent> returnValue = jobContentService.findJobContentList(search);

        List<JobContentDTO> dtoList = modelMapper.map(returnValue.getContent(), JobContentDTO.TYPE);

        ResultListDTO<JobContentDTO> resultList = new ResultListDTO<JobContentDTO>();
        resultList.setList(dtoList);
        resultList.setTotalCnt(returnValue.getTotalElements());

        ResultDTO<ResultListDTO<JobContentDTO>> resultDTO = new ResultDTO<ResultListDTO<JobContentDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ?????? ????????????
     *
     * @param jobSeq ????????????
     * @return ??????
     */
    @ApiOperation(value = "?????? ????????????")
    @GetMapping("/job/{jobSeq}")
    public ResponseEntity<?> getJobContent(@ApiParam("?????? ??????(??????)") @PathVariable("jobSeq") Long jobSeq)
            throws NoDataException {
        JobContent jobContent = jobContentService
                .findJobContentById(jobSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        JobContentDTO dto = modelMapper.map(jobContent, JobContentDTO.class);

        ResultDTO<JobContentDTO> resultDTO = new ResultDTO<JobContentDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);

    }

    /**
     * ?????? ??????
     *
     * @param jobContentSaveDTO ????????? ??????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ??????")
    @PostMapping("/job")
    public ResponseEntity<?> postJobContent(HttpServletRequest request, @Valid JobContentSaveDTO jobContentSaveDTO,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {

        JobContentSearchDTO checkItem = new JobContentSearchDTO();
        checkItem.setServerSeq(jobContentSaveDTO.getServerSeq());
        checkItem.setPeriod(jobContentSaveDTO.getPeriod());
        //???????????? ???????????? ??????(?????????????????? serverSeq, callUrl, period ??? ???????????? ????????????) > ???????????? ????????? ?????????
        //if (jobContentService.isValidData(checkItem)) {
        //throw new InvalidDataException(msg("tps.common.error.duplicated.data"));
        //}

        try {

            JobContent jobContent = modelMapper.map(jobContentSaveDTO, JobContent.class);
            jobContent.setRegId(getUserId(principal));  //?????????ID ??????

            JobContent returnValue = jobContentService.insertJobContent(jobContent);
            JobContentDTO dto = modelMapper.map(returnValue, JobContentDTO.class);

            String message = msg("tps.common.success.insert");
            ResultDTO<JobContentDTO> resultDTO = new ResultDTO<JobContentDTO>(dto, message);
            tpsLogger.success(LoggerCodes.ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch (Exception e) {
            log.error("[FAIL TO INSERT SCHEDULE]", e);
            tpsLogger.error(LoggerCodes.ActionType.INSERT, "[FAIL TO INSERT SCHEDULE]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * ?????? ??????
     *
     * @param jobSeq ????????????, jobContentUpdateDTO ????????? ??????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ??????")
    @PutMapping("/job/{jobSeq}")
    public ResponseEntity<?> putJobContent(@ApiParam("????????????") @PathVariable("jobSeq") @Min(value = 0, message = "") Long jobSeq,
            @Valid JobContentUpdateDTO jobContentUpdateDTO, @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {
        //????????? ???????????? ?????? ?????? FAIL
        String infoMessage = msg("tps.common.error.no-data");
        jobContentService
                .findJobContentById(jobSeq)
                .orElseThrow(() -> new NoDataException((infoMessage)));

        JobContentSearchDTO checkItem = new JobContentSearchDTO();
        checkItem.setServerSeq(jobContentUpdateDTO.getServerSeq());
        checkItem.setPeriod(jobContentUpdateDTO.getPeriod());
        //???????????? ???????????? ??????(?????????????????? serverSeq, callUrl, period ??? ???????????? ????????????) > ???????????? ????????? ?????????
        //if (jobContentService.isValidData(checkItem)) {
        //throw new InvalidDataException(msg("tps.common.error.duplicated.data"));
        //}

        try {
            JobContent jobContent = modelMapper.map(jobContentUpdateDTO, JobContent.class);
            jobContent.setModId(getUserId(principal));  //?????????ID ??????
            jobContent.setJobSeq(jobSeq);

            JobContent returnValue = jobContentService.updateJobContent(jobContent);
            JobContentUpdateDTO dto = modelMapper.map(returnValue, JobContentUpdateDTO.class);

            String message = msg("tps.common.success.update");
            ResultDTO<JobContentUpdateDTO> resultDTO = new ResultDTO<JobContentUpdateDTO>(dto, message);
            tpsLogger.success(LoggerCodes.ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch (Exception e) {
            log.error("[FAIL TO UPDATE DISTRIBUTE SERVER]", e);
            tpsLogger.error(LoggerCodes.ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.update"), e);

        }
    }

    /**
     * ?????? ??????
     *
     * @param jobSeq ????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ??????")
    @PutMapping("/job/{jobSeq}/delete")
    public ResponseEntity<?> deleteJobContent(@ApiParam("????????????") @PathVariable("jobSeq") @Min(value = 0, message = "") Long jobSeq,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {

        String infoMessage = msg("tps.common.error.no-data");
        JobContent jobContent = jobContentService
                .findJobContentById(jobSeq)
                .orElseThrow(() -> new NoDataException((infoMessage)));

        try {
            //?????? ????????????
            jobContentService.deleteJobContent(jobContent);
            tpsLogger.success(LoggerCodes.ActionType.DELETE, true);

            // ????????????
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch (Exception e) {
            log.error("[FAIL TO DELETE JOB CONTENT]", e);
            tpsLogger.error(LoggerCodes.ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.delete"), e);

        }
    }

    /**
     * ?????? > jobCd ????????????
     *
     * @param jobCd
     * @return boolean
     */
    @ApiOperation(value = "jobCd ????????????")
    @GetMapping("/job-check-jobcd/{jobCd}")
    public ResponseEntity<?> getJobContentHistory(@ApiParam("jobCd(??????)") @PathVariable("jobCd") String jobCd) {
        boolean result = jobContentService.findJobCd(jobCd) == 0 ? false : true;
        HashMap<String, Boolean> resultMap = new HashMap<String, Boolean>();
        resultMap.put("duplicated", result);
        
        ResultDTO<HashMap<String, Boolean>> resultDTO = new ResultDTO<HashMap<String, Boolean>>(resultMap);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ????????? ?????? ????????????
     *
     * @param search ???????????? : ??????, ??????, ??????, ????????????, ????????????, ?????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "????????? ?????? ????????????")
    @GetMapping("/job-deleted")
    public ResponseEntity<?> getJobDeletedContentList(@Valid @SearchParam JobDeletedContentSearchDTO search) {
        Page<JobContent> returnValue = jobContentService.findDeletedJobContentList(search);

        List<JobContentDTO> dtoList = modelMapper.map(returnValue.getContent(), JobContentDTO.TYPE);

        ResultListDTO<JobContentDTO> resultList = new ResultListDTO<JobContentDTO>();
        resultList.setList(dtoList);
        resultList.setTotalCnt(returnValue.getTotalElements());

        ResultDTO<ResultListDTO<JobContentDTO>> resultDTO = new ResultDTO<ResultListDTO<JobContentDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ????????? ?????? ????????????
     *
     * @param jobSeq ????????? ?????? ??????
     * @return ????????? ??????
     */
    @ApiOperation(value = "????????? ?????? ????????????")
    @GetMapping("/job-deleted/{jobSeq}")
    public ResponseEntity<?> getJobDeletedContent(@ApiParam("?????? ??????(??????)") @PathVariable("jobSeq") Long jobSeq)
            throws NoDataException {
        JobContent jobContent = jobContentService
                .findDeletedJobContentById(jobSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        JobContentDTO dto = modelMapper.map(jobContent, JobContentDTO.class);

        ResultDTO<JobContentDTO> resultDTO = new ResultDTO<JobContentDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);

    }

    /**
     * ????????? ?????? ??????
     *
     * @param jobSeq ????????? ?????? ??????
     * @return ?????? ??????
     */
    @ApiOperation(value = "????????? ?????? ??????")
    @PutMapping("/job-deleted/{jobSeq}/recover")
    public ResponseEntity<?> recoverJobDeletedContent(@ApiParam("????????????") @PathVariable("jobSeq") Long jobSeq,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {


        JobContent jobContent = jobContentService
                .findDeletedJobContentById(jobSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });



        try {
            jobContent.setRegId(getUserId(principal));  //????????? ID ??????

            jobContentService.updateDeleteJobContent(jobContent);

            tpsLogger.success(LoggerCodes.ActionType.DELETE, true);

            // ????????????
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch (Exception e) {
            log.error("[FAIL TO RECOVER JOB CONTENT]", e);
            tpsLogger.error(LoggerCodes.ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.delete"), e);

        }
    }

    /**
     * ???????????? ?????? ??????(??????)
     *
     * @param
     * @return ???????????? ??????
     */
    @ApiOperation(value = "???????????? ????????????(???????????? ??????)")
    @GetMapping("/distribute-server-code")
    public ResponseEntity<?> getDistributeServerCodeList() {
        List<DistributeServer> returnValue = distServerService.findDistibuteServerCodeList();

        ResultListDTO<DistributeServerCodeDTO> resultListMessage = new ResultListDTO<DistributeServerCodeDTO>();
        List<DistributeServerCodeDTO> distServerDtoList = modelMapper.map(returnValue, DistributeServerCodeDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(distServerDtoList);

        ResultDTO<ResultListDTO<DistributeServerCodeDTO>> resultDto = new ResultDTO<ResultListDTO<DistributeServerCodeDTO>>(resultListMessage);
        tpsLogger.success(LoggerCodes.ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ????????????
     *
     * @param search ???????????? : ??????, ??????IP
     * @return ???????????? ??????
     */
    @ApiOperation(value = "???????????? ????????????")
    @GetMapping("/distribute-server")
    public ResponseEntity<?> getDistributeServerList(@Valid @SearchParam DistributeServerSearchDTO search) {
        Page<DistributeServer> returnValue = distServerService.findDistibuteServerList(search);

        List<DistributeServerDTO> dtoList = modelMapper.map(returnValue.getContent(), DistributeServerDTO.TYPE);

        ResultListDTO<DistributeServerDTO> resultList = new ResultListDTO<DistributeServerDTO>();
        resultList.setList(dtoList);
        resultList.setTotalCnt(returnValue.getTotalElements());

        ResultDTO<ResultListDTO<DistributeServerDTO>> resultDTO = new ResultDTO<ResultListDTO<DistributeServerDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ???????????? ?????? ??????
     *
     * @param serverSeq ???????????? ????????????
     * @return ????????????
     */
    @ApiOperation(value = "???????????? ????????????")
    @GetMapping("/distribute-server/{serverSeq}")
    public ResponseEntity<?> getDistributeServer(@ApiParam("???????????? ??????(??????)") @PathVariable("serverSeq") Long serverSeq)
            throws NoDataException {
        DistributeServer distServer = distServerService
                .findDistributeServerById(serverSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        DistributeServerDTO dto = modelMapper.map(distServer, DistributeServerDTO.class);

        ResultDTO<DistributeServerDTO> resultDTO = new ResultDTO<DistributeServerDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);

    }

    /**
     * ???????????? ??????
     *
     * @param distServerSaveDTO ???????????? ??????
     * @return ?????? ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @PostMapping("/distribute-server")
    public ResponseEntity<?> postDistributeServer(HttpServletRequest request, @Valid DistributeServerSaveDTO distServerSaveDTO,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {
        try {
            DistributeServer distServer = modelMapper.map(distServerSaveDTO, DistributeServer.class);
            setPassword(distServer);    //???????????? ?????????
            distServer.setRegId(getUserId(principal));  //?????????ID ??????

            DistributeServer returnValue = distServerService.insertDistributeServer(distServer);
            DistributeServerDTO dto = modelMapper.map(returnValue, DistributeServerDTO.class);

            String message = msg("tps.common.success.insert");
            ResultDTO<DistributeServerDTO> resultDTO = new ResultDTO<DistributeServerDTO>(dto, message);
            tpsLogger.success(LoggerCodes.ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch (Exception e) {
            log.error("[FAIL TO INSERT DISTRIBUTE SERVER]", e);
            tpsLogger.error(LoggerCodes.ActionType.INSERT, "[FAIL TO INSERT DISTRIBUTE SERVER]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * ???????????? ??????
     *
     * @param serverSeq ???????????? ????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @PutMapping("/distribute-server/{serverSeq}")
    public ResponseEntity<?> putDistributeServer(@ApiParam("????????????") @PathVariable("serverSeq") @Min(value = 0, message = "") Long serverSeq,
            @Valid DistributeServerUpdateDTO distServerUpdateDTO, @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {

        String infoMessage = msg("tps.common.error.no-data");
        distServerService
                .findDistributeServerById(serverSeq)
                .orElseThrow(() -> new NoDataException((infoMessage)));

        try {
            DistributeServer distServer = modelMapper.map(distServerUpdateDTO, DistributeServer.class);
            setPassword(distServer);
            distServer.setModId(getUserId(principal));  //?????????ID ??????

            distServer.setServerSeq(serverSeq);
            DistributeServer returnValue = distServerService.updateDistributeServer(distServer);
            DistributeServerDTO dto = modelMapper.map(returnValue, DistributeServerDTO.class);

            String message = msg("tps.common.success.update");
            ResultDTO<DistributeServerDTO> resultDTO = new ResultDTO<DistributeServerDTO>(dto, message);
            tpsLogger.success(LoggerCodes.ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch (Exception e) {
            log.error("[FAIL TO UPDATE DISTRIBUTE SERVER]", e);
            tpsLogger.error(LoggerCodes.ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.update"), e);

        }
    }

    /**
     * ???????????? ??????
     *
     * @param serverSeq ???????????? ????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @PutMapping("/distribute-server/{serverSeq}/delete")
    public ResponseEntity<?> deleteDistributeServer(@ApiParam("????????????") @PathVariable("serverSeq") @Min(value = 0, message = "") Long serverSeq,
            @ApiParam(hidden = true) @NotNull Principal principal)
            throws Exception {

        String infoMessage = msg("tps.common.error.no-data");
        DistributeServer distServer = distServerService
                .findDistributeServerById(serverSeq)
                .orElseThrow(() -> new NoDataException((infoMessage)));

        JobContentSearchDTO checkItem = new JobContentSearchDTO();
        checkItem.setServerSeq(distServer.getServerSeq());
        //???????????? ???????????? ??????(????????? ???????????? ????????? ????????????)
        if (jobContentService.isValidData(checkItem)) {
            throw new InvalidDataException(msg("tps.common.error.delete.related"));
        }

        try {
            distServer.setDelYn(MokaConstants.YES);
            distServer.setModId(getUserId(principal));  //?????????ID ??????

            distServer.setServerSeq(serverSeq);
            DistributeServer returnValue = distServerService.updateDistributeServer(distServer);
            DistributeServerDTO dto = modelMapper.map(returnValue, DistributeServerDTO.class);

            String message = msg("tps.common.success.update");
            ResultDTO<DistributeServerDTO> resultDTO = new ResultDTO<DistributeServerDTO>(dto, message);
            tpsLogger.success(LoggerCodes.ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch (Exception e) {
            log.error("[FAIL TO DELETE(UPDATE DELYN) DISTRIBUTE SERVER]", e);
            tpsLogger.error(LoggerCodes.ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.update"), e);

        }
    }

    /**
     * ???????????? ????????????
     *
     * @param search ???????????? : ?????????, ?????????, ????????????, ????????????, ??????????????????
     * @return ???????????? ??????
     */
    @ApiOperation(value = "???????????? ????????????")
    @GetMapping("/job-history")
    public ResponseEntity<?> getJobContentHistoryList(@Valid @SearchParam JobContentHistorySearchDTO search) {
        Page<JobContentHistory> returnValue = jobContentHistoryService.findJobContentHistoryList(search);

        List<JobContentHistoryDTO> dtoList = modelMapper.map(returnValue.getContent(), JobContentHistoryDTO.TYPE);

        ResultListDTO<JobContentHistoryDTO> resultList = new ResultListDTO<JobContentHistoryDTO>();
        resultList.setList(dtoList);
        resultList.setTotalCnt(returnValue.getTotalElements());

        ResultDTO<ResultListDTO<JobContentHistoryDTO>> resultDTO = new ResultDTO<ResultListDTO<JobContentHistoryDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ???????????? ????????????
     *
     * @param seqNo ????????????
     * @return ??????
     */
    @ApiOperation(value = "???????????? ????????????")
    @GetMapping("/job-history/{seqNo}")
    public ResponseEntity<?> getJobContentHistory(@ApiParam("?????? ??????(??????)") @PathVariable("seqNo") Long seqNo)
            throws NoDataException {
        JobContentHistory jobContentHistory = jobContentHistoryService
                .findJobContentHistoryById(seqNo)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        JobContentHistoryDTO dto = modelMapper.map(jobContentHistory, JobContentHistoryDTO.class);

        ResultDTO<JobContentHistoryDTO> resultDTO = new ResultDTO<JobContentHistoryDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    //???????????? ????????? ??????
    private void setPassword(DistributeServer distServer) {
        if (McpString.isNotEmpty(distServer.getAccessPwd())) {
            try {
                distServer.setAccessPwd(mokaCrypt.encrypt(distServer.getAccessPwd()));
            } catch (Exception e) {
                log.error("[FAIL TO DISTRIBUTESERVER PASSWORD] password: {} {}", distServer.getAccessPwd(), e.getMessage());
            }
        }
    }

    //?????? ?????????ID ??????
    private String getUserId(Principal principal) {
        UserDTO userDTO = (UserDTO) ((UsernamePasswordAuthenticationToken) principal).getDetails();
        return userDTO.getUserId();
    }



    //@ApiOperation(value = "???????????? ????????????2")
    //@GetMapping("/distribute-server2")
    public ResponseEntity<?> getDistributeServerList2(@Valid @SearchParam DistributeServerSearchDTO search) {
        Page<DistributeServerDTO> returnValue = distServerService.findList2(search);

        List<DistributeServerDTO> dtoList = modelMapper.map(returnValue.getContent(), DistributeServerDTO.TYPE);

        ResultListDTO<DistributeServerDTO> resultList = new ResultListDTO<DistributeServerDTO>();
        resultList.setList(dtoList);
        resultList.setTotalCnt(returnValue.getTotalElements());

        ResultDTO<ResultListDTO<DistributeServerDTO>> resultDTO = new ResultDTO<ResultListDTO<DistributeServerDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }
}
