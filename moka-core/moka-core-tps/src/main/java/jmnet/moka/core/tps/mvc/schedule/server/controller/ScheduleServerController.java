package jmnet.moka.core.tps.mvc.schedule.server.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.encrypt.MokaCrypt;
import jmnet.moka.core.common.logger.LoggerCodes;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.*;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobDeletedContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobStatistic;
import jmnet.moka.core.tps.mvc.schedule.server.service.DistributeServerService;
import jmnet.moka.core.tps.mvc.schedule.server.service.JobContentService;
import jmnet.moka.core.tps.mvc.schedule.server.service.JobDeletedContentService;
import jmnet.moka.core.tps.mvc.schedule.server.service.JobStatisticService;
import jmnet.moka.core.tps.mvc.schedule.server.vo.JobStatisticVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.security.Principal;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/schedule-server")
@Api(tags = {"스케쥴서버관리 API"})
public class ScheduleServerController extends AbstractCommonController {

    //작업통계
    private final JobStatisticService jobStatisticService;
    //배포서버
    private final DistributeServerService distServerService;
    //작업
    private final JobContentService jobContentService;
    //삭제된 작업
    private final JobDeletedContentService jobDeletedContentService;

    //암호화 모듈
    private final MokaCrypt mokaCrypt;

    public ScheduleServerController(
            JobStatisticService jobStatisticService,
            DistributeServerService distServerService, JobContentService jobContentService,
            JobDeletedContentService jobDeletedContentService, MokaCrypt mokaCrypt) {

        this.jobStatisticService = jobStatisticService;
        this.distServerService = distServerService;
        this.jobContentService = jobContentService;
        this.jobDeletedContentService = jobDeletedContentService;
        this.mokaCrypt = mokaCrypt;
    }

    @ApiOperation(value = "작업 실행통계 목록조회")
    @GetMapping("/job-statistic")
    public ResponseEntity<?> getJobStatisticList(@Valid @SearchParam JobContentSearchDTO search){
        ResultListDTO<JobStatisticVO> resultListMessage = new ResultListDTO<>();

        Page<JobStatisticVO> returnValue = jobStatisticService.findAllJobStat(search);

        resultListMessage.setTotalCnt(returnValue.getTotalPages());
        resultListMessage.setList(returnValue.getContent());

        ResultDTO<ResultListDTO<JobStatisticVO>> resultDTO = new ResultDTO<>(resultListMessage);
        tpsLogger.success(LoggerCodes.ActionType.SELECT);

        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "작업 실행현황 목록조회")
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

    @ApiOperation(value = "작업 목록조회")
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

    @ApiOperation(value = "작업 상세조회")
    @GetMapping("/job/{jobSeq}")
    public ResponseEntity<?> getJobContent(@ApiParam("작업 번호(필수)") @PathVariable("jobSeq") Long jobSeq) throws NoDataException {
        JobContent jobContent = jobContentService
                .findJobContentById(jobSeq)
                .orElseThrow(() -> {
                            String message = msg("tps.common.error.no-data");
                            tpsLogger.fail(message, true);
                            return new NoDataException(message);
                        }
                );

        JobContentDTO dto = modelMapper.map(jobContent, JobContentDTO.class);

        ResultDTO<JobContentDTO> resultDTO = new ResultDTO<JobContentDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);

    }

    @ApiOperation(value = "작업 등록")
    @PostMapping("/job")
    public ResponseEntity<?> postJobContent(HttpServletRequest request,
                                                  @Valid JobContentSaveDTO jobContentSaveDTO,
                                                  @ApiParam(hidden = true) @NotNull Principal principal) throws Exception {
        try{
            JobContent jobContent = modelMapper.map(jobContentSaveDTO, JobContent.class);
            jobContent.setRegId(getUserId(principal));  //등록자ID 추가

            JobContent returnValue = jobContentService.saveJobContent(jobContent);
            JobContentDTO dto = modelMapper.map(returnValue, JobContentDTO.class);

            String message = msg("tps.common.success.insert");
            ResultDTO<JobContentDTO> resultDTO = new ResultDTO<JobContentDTO>(dto, message);
            tpsLogger.success(LoggerCodes.ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        }catch (Exception e){
            log.error("[FAIL TO INSERT DISTRIBUTE SERVER]", e);
            tpsLogger.error(LoggerCodes.ActionType.INSERT, "[FAIL TO INSERT DISTRIBUTE SERVER]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    @ApiOperation(value = "작업 수정")
    @PutMapping("/job/{jobSeq}")
    public ResponseEntity<?> putJobContent(@ApiParam("작업번호") @PathVariable("jobSeq") @Min(value = 0, message = "") Long jobSeq,
                                                 @Valid JobContentUpdateDTO jobContentUpdateDTO,
                                                 @ApiParam(hidden = true) @NotNull Principal principal) throws Exception {

        String infoMessage = msg("tps.common.error.no-data");
        jobContentService
                .findJobContentById(jobSeq)
                .orElseThrow(() -> new NoDataException((infoMessage)));

        try{
            JobContent jobContent = modelMapper.map(jobContentUpdateDTO, JobContent.class);
            jobContent.setModId(getUserId(principal));  //수정자ID 추가
            jobContent.setJobSeq(jobSeq);

            JobContent returnValue = jobContentService.updateJobContent(jobContent);
            JobContentUpdateDTO dto = modelMapper.map(returnValue, JobContentUpdateDTO.class);

            String message = msg("tps.common.success.update");
            ResultDTO<JobContentUpdateDTO> resultDTO = new ResultDTO<JobContentUpdateDTO>(dto, message);
            tpsLogger.success(LoggerCodes.ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch(Exception e){
            log.error("[FAIL TO UPDATE DISTRIBUTE SERVER]", e);
            tpsLogger.error(LoggerCodes.ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.update"), e);

        }
    }

    @ApiOperation(value = "작업 삭제")
    @PutMapping("/job/{jobSeq}/delete")
    public ResponseEntity<?> deleteJobContent(@ApiParam("작업번호") @PathVariable("jobSeq") @Min(value = 0, message = "") Long jobSeq,
                                                    @ApiParam(hidden = true) @NotNull Principal principal) throws Exception {

        String infoMessage = msg("tps.common.error.no-data");
        JobContent jobContent = jobContentService
                .findJobContentById(jobSeq)
                .orElseThrow(() -> new NoDataException((infoMessage)));



        try{
            //삭제될 작업 저장
            JobDeletedContent jobDeletedContent = modelMapper.map(jobContent, JobDeletedContent.class);
            jobDeletedContent.setRegId(getUserId(principal));  //삭제자 ID 추가
            jobDeletedContentService.saveJobDeletedContent(jobDeletedContent);

            //작업 삭제
            jobContentService.deleteJobContent(jobContent);

            tpsLogger.success(LoggerCodes.ActionType.DELETE, true);

            // 결과리턴
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch(Exception e){
            log.error("[FAIL TO DELETE JOB CONTENT]", e);
            tpsLogger.error(LoggerCodes.ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.delete"), e);

        }
    }


    @ApiOperation(value = "삭제된 작업 목록조회")
    @GetMapping("/job-deleted")
    public ResponseEntity<?> getJobDeletedContentList(@Valid @SearchParam JobDeletedContentSearchDTO search) {
        Page<JobDeletedContent> returnValue = jobDeletedContentService.findJobContentList(search);

        List<JobDeletedContentDTO> dtoList = modelMapper.map(returnValue.getContent(), JobDeletedContentDTO.TYPE);

        ResultListDTO<JobDeletedContentDTO> resultList = new ResultListDTO<JobDeletedContentDTO>();
        resultList.setList(dtoList);
        resultList.setTotalCnt(returnValue.getTotalElements());

        ResultDTO<ResultListDTO<JobDeletedContentDTO>> resultDTO = new ResultDTO<ResultListDTO<JobDeletedContentDTO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "삭제된 작업 상세조회")
    @GetMapping("/job-deleted/{seqNo}")
    public ResponseEntity<?> getJobDeletedContent(@ApiParam("일련 번호(필수)") @PathVariable("seqNo") Long seqNo) throws NoDataException {
        JobDeletedContent jobDeletedContent = jobDeletedContentService
                .findJobDeletedContentById(seqNo)
                .orElseThrow(() -> {
                            String message = msg("tps.common.error.no-data");
                            tpsLogger.fail(message, true);
                            return new NoDataException(message);
                        }
                );

        JobDeletedContentDTO dto = modelMapper.map(jobDeletedContent, JobDeletedContentDTO.class);

        ResultDTO<JobDeletedContentDTO> resultDTO = new ResultDTO<JobDeletedContentDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);

    }

    @ApiOperation(value = "삭제된 작업 복원")
    @PutMapping("/job-deleted/{seqNo}/recover")
    public ResponseEntity<?> recoverJobDeletedContent(@ApiParam("일련번호") @PathVariable("seqNo") Long seqNo,
                                              @ApiParam(hidden = true) @NotNull Principal principal) throws Exception {

        JobDeletedContent jobDeletedContent = jobDeletedContentService
                .findJobDeletedContentById(seqNo)
                .orElseThrow(() -> {
                            String message = msg("tps.common.error.no-data");
                            tpsLogger.fail(message, true);
                            return new NoDataException(message);
                        }
                );



        try{
            //삭제된 작업 복원
            JobContent jobContent = modelMapper.map(jobDeletedContent, JobContent.class);
            jobContent.setUsedYn("Y");
            jobContent.setRegId(getUserId(principal));  //복원자 ID 추가
            jobContentService.saveJobContent(jobContent);

            //복원된 작업 삭제
            jobDeletedContentService.deletedJobDeletedContent(jobDeletedContent);

            tpsLogger.success(LoggerCodes.ActionType.DELETE, true);

            // 결과리턴
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch(Exception e){
            log.error("[FAIL TO DELETE JOB CONTENT]", e);
            tpsLogger.error(LoggerCodes.ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.delete"), e);

        }
    }







    @ApiOperation(value = "배포서버 목록조회(검색조건 코드)")
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

    @ApiOperation(value = "배포서버 목록조회")
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

    @ApiOperation(value = "배포서버 상세조회")
    @GetMapping("/distribute-server/{serverSeq}")
    public ResponseEntity<?> getDistributeServer(@ApiParam("배포서버 번호(필수)") @PathVariable("serverSeq") Long serverSeq) throws NoDataException {
        DistributeServer distServer = distServerService
                .findDistributeServerById(serverSeq)
                .orElseThrow(() -> {
                        String message = msg("tps.common.error.no-data");
                        tpsLogger.fail(message, true);
                        return new NoDataException(message);
                    }
                );

        DistributeServerDTO dto = modelMapper.map(distServer, DistributeServerDTO.class);

        ResultDTO<DistributeServerDTO> resultDTO = new ResultDTO<DistributeServerDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);

    }

    @ApiOperation(value = "배포서버 등록")
    @PostMapping("/distribute-server")
    public ResponseEntity<?> postDistributeServer(HttpServletRequest request,
                                                  @Valid DistributeServerSaveDTO distServerSaveDTO,
                                                  @ApiParam(hidden = true) @NotNull Principal principal) throws Exception {
        try{
            DistributeServer distServer = modelMapper.map(distServerSaveDTO, DistributeServer.class);
            setPassword(distServer);    //패스워드 암호화
            distServer.setRegId(getUserId(principal));  //등록자ID 추가

            DistributeServer returnValue = distServerService.saveDistributeServer(distServer);
            DistributeServerDTO dto = modelMapper.map(returnValue, DistributeServerDTO.class);

            String message = msg("tps.common.success.insert");
            ResultDTO<DistributeServerDTO> resultDTO = new ResultDTO<DistributeServerDTO>(dto, message);
            tpsLogger.success(LoggerCodes.ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        }catch (Exception e){
            log.error("[FAIL TO INSERT DISTRIBUTE SERVER]", e);
            tpsLogger.error(LoggerCodes.ActionType.INSERT, "[FAIL TO INSERT DISTRIBUTE SERVER]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    @ApiOperation(value = "배포서버 수정")
    @PutMapping("/distribute-server/{serverSeq}")
    public ResponseEntity<?> putDistributeServer(@ApiParam("서버번호") @PathVariable("serverSeq") @Min(value = 0, message = "") Long serverSeq,
                                                 @Valid DistributeServerUpdateDTO distServerUpdateDTO,
                                                 @ApiParam(hidden = true) @NotNull Principal principal) throws Exception {

        String infoMessage = msg("tps.common.error.no-data");
        distServerService
                .findDistributeServerById(serverSeq)
                .orElseThrow(() -> new NoDataException((infoMessage)));

        try{
            DistributeServer distServer = modelMapper.map(distServerUpdateDTO, DistributeServer.class);
            setPassword(distServer);
            distServer.setModId(getUserId(principal));  //수정자ID 추가

            distServer.setServerSeq(serverSeq);
            DistributeServer returnValue = distServerService.updateDistributeServer(distServer);
            DistributeServerDTO dto = modelMapper.map(returnValue, DistributeServerDTO.class);

            String message = msg("tps.common.success.update");
            ResultDTO<DistributeServerDTO> resultDTO = new ResultDTO<DistributeServerDTO>(dto, message);
            tpsLogger.success(LoggerCodes.ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch(Exception e){
            log.error("[FAIL TO UPDATE DISTRIBUTE SERVER]", e);
            tpsLogger.error(LoggerCodes.ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.update"), e);

        }
    }

    @ApiOperation(value = "배포서버 삭제")
    @PutMapping("/distribute-server/{serverSeq}/delete")
    public ResponseEntity<?> deleteDistributeServer(@ApiParam("서버번호") @PathVariable("serverSeq") @Min(value = 0, message = "") Long serverSeq,
                                                 @ApiParam(hidden = true) @NotNull Principal principal) throws Exception {

        String infoMessage = msg("tps.common.error.no-data");
        DistributeServer distServer = distServerService
                .findDistributeServerById(serverSeq)
                .orElseThrow(() -> new NoDataException((infoMessage)));

        try{
            distServer.setDelYn(MokaConstants.YES);
            distServer.setModId(getUserId(principal));  //수정자ID 추가

            distServer.setServerSeq(serverSeq);
            DistributeServer returnValue = distServerService.updateDistributeServer(distServer);
            DistributeServerDTO dto = modelMapper.map(returnValue, DistributeServerDTO.class);

            String message = msg("tps.common.success.update");
            ResultDTO<DistributeServerDTO> resultDTO = new ResultDTO<DistributeServerDTO>(dto, message);
            tpsLogger.success(LoggerCodes.ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);


        } catch(Exception e){
            log.error("[FAIL TO DELETE(UPDATE DELYN) DISTRIBUTE SERVER]", e);
            tpsLogger.error(LoggerCodes.ActionType.UPDATE, e);
            throw new Exception(msg("tps.common.error.update"), e);

        }
    }

    //패스워드 암호화 적용
    private void setPassword(DistributeServer distServer){
        if(McpString.isNotEmpty(distServer.getAccessPwd())) {
            try{
                distServer.setAccessPwd(mokaCrypt.encrypt(distServer.getAccessPwd()));
            } catch(Exception e){
                log.error("[FAIL TO DISTRIBUTESERVER PASSWORD] password: {} {}", distServer.getAccessPwd(), e.getMessage());
            }
        }
    }

    //현재 사용자ID 반환
    private String getUserId(Principal principal){
        UserDTO userDTO = (UserDTO) ((UsernamePasswordAuthenticationToken) principal).getDetails();
        return userDTO.getUserId();
    }






    //@ApiOperation(value = "배포서버 목록조회2")
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
