package jmnet.moka.core.tps.mvc.schedule.server.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.schedule.server.dto.*;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import jmnet.moka.core.tps.mvc.schedule.server.service.DistributeServerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/schedule-server")
@Api(tags = {"스케쥴서버관리 API"})
public class ScheduleServerController extends AbstractCommonController {

    //배포서버
    private final DistributeServerService distServerService;

    public ScheduleServerController(DistributeServerService distServerService) {
        this.distServerService = distServerService;
    }

    @ApiOperation(value = "배포서버 목록조회(검색조건 코드)")
    @GetMapping("/distribute-server-code")
    public ResponseEntity<?> getDistributeServerCodeList() {
        List<DistributeServer> returnValue = distServerService.findDistibuteServerList();

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
        Page<DistributeServer> returnValue = distServerService.findList(search);

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
    public ResponseEntity<?> postDistributeServer(HttpServletRequest request, @Valid DistributeServerSaveDTO distServerSaveDTO) throws Exception {
        try{
            DistributeServer distServer = modelMapper.map(distServerSaveDTO, DistributeServer.class);
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
                                                 @Valid DistributeServerUpdateDTO distServerUpdateDTO) throws Exception {

        String infoMessage = msg("tps.common.error.no-data");
        distServerService
                .findDistributeServerById(serverSeq)
                .orElseThrow(() -> new NoDataException((infoMessage)));

        try{
            DistributeServer distServer = modelMapper.map(distServerUpdateDTO, DistributeServer.class);
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
