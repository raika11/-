package jmnet.moka.core.tps.mvc.code.controller;

import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.dto.MastercodeDTO;
import jmnet.moka.core.tps.mvc.code.entity.Mastercode;
import jmnet.moka.core.tps.mvc.code.service.CodeService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Validated
@Slf4j
@RequestMapping("/api/codes")
public class CodeRestController {

    @Autowired
    private CodeService codeService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TpsLogger tpsLogger;

    @ApiOperation(value = "마스터코드 목록조회")
    @GetMapping("/masters")
    public ResponseEntity<?> getMastercodeList(@Valid @SearchParam CodeSearchDTO search) {

        // 조회
        List<Mastercode> returnValue = codeService.findAllMastercode(search);

        // 리턴값 설정
        ResultListDTO<MastercodeDTO> resultListMessage = new ResultListDTO<>();
        List<MastercodeDTO> dtoList = modelMapper.map(returnValue, MastercodeDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<MastercodeDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    //    @ApiOperation(value = "서비스맵 목록조회")
    //    @GetMapping("/service-maps")
    //    public ResponseEntity<?> getServiceMapList(@Valid @SearchParam CodeSearchDTO search) {
    //
    //        // 조회
    //        List<ServiceMap> returnValue = codeService.findAllServiceMap(search);
    //
    //        // 리턴값 설정
    //        ResultListDTO<ServiceMapDTO> resultListMessage = new ResultListDTO<>();
    //        List<ServiceMapDTO> dtoList = modelMapper.map(returnValue, ServiceMapDTO.TYPE);
    //        resultListMessage.setTotalCnt(returnValue.size());
    //        resultListMessage.setList(dtoList);
    //
    //        ResultDTO<ResultListDTO<ServiceMapDTO>> resultDto = new ResultDTO<>(resultListMessage);
    //        tpsLogger.success(ActionType.SELECT, true);
    //        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    //    }

}
