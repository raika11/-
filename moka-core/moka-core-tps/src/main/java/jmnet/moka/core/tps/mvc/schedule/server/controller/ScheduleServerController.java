package jmnet.moka.core.tps.mvc.schedule.server.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerCodeDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.DistributeServerSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import jmnet.moka.core.tps.mvc.schedule.server.service.DistributeServerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
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

    @ApiOperation(value = "배포서버 목록조회(조회용 코드)")
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
}
