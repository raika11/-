package jmnet.moka.core.tps.mvc.push.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.entity.CommonCode;
import jmnet.moka.core.tps.mvc.push.dto.PushAppDTO;
import jmnet.moka.core.tps.mvc.push.dto.PushAppSearchDTO;
import jmnet.moka.core.tps.mvc.push.entity.PushApp;
import jmnet.moka.core.tps.mvc.push.service.PushAppService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.push.controller
 * ClassName : PushAppController
 * Created : 2021-03-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-23 09:21
 */
@RestController
@RequestMapping("/api/push/apps")
@Slf4j
@Api(tags = {"푸시 앱 API"})
public class PushAppController extends AbstractCommonController {

    @Autowired
    private PushAppService pushAppService;

    /**
     * 푸시 앱 목록 조회
     *
     * @param search 검색조건
     * @return 푸시앱목록
     */
    @ApiOperation(value = "푸시 앱 목록 조회")
    @GetMapping
    public ResponseEntity<?> getPushAppList(@SearchParam PushAppSearchDTO search) {

        ResultListDTO<PushAppDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        List<PushApp> returnValue = pushAppService.findAllPushApp(search);

        // 리턴값 설정
        List<PushAppDTO> quizList = modelMapper.map(returnValue, PushAppDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(quizList);


        ResultDTO<ResultListDTO<PushAppDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 푸시 앱 종류 조회
     *
     * @return 푸시앱목록
     */
    @ApiOperation(value = "푸시 앱 종류 조회")
    @GetMapping("/divs")
    public ResponseEntity<?> getPushAppDivList() {

        // 조회
        List<CommonCode> returnValue = pushAppService.findAllAppDiv();

        ResultDTO<List<CommonCode>> resultDto = new ResultDTO<>(returnValue);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 푸시 앱 종류별 디바이스 조회
     *
     * @return 푸시앱목록
     */
    @ApiOperation(value = "푸시 앱 종류별 디바이스 조회")
    @GetMapping("/divs/{appDiv}/devs")
    public ResponseEntity<?> getPushAppDevDivList(@SearchParam PushAppSearchDTO search) {

        // 조회
        List<CommonCode> returnValue = pushAppService.findAllDevDiv(search);

        ResultDTO<List<CommonCode>> resultDto = new ResultDTO<>(returnValue);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 푸시 앱 디바이스 종류별 OS 조회
     *
     * @return 푸시앱목록
     */
    @ApiOperation(value = "푸시 앱 디바이스 종류별 OS 조회")
    @GetMapping("/divs/{appDiv}/devs/{devDiv}")
    public ResponseEntity<?> getPushAppOsDivList(@SearchParam PushAppSearchDTO search) {

        // 조회
        List<CommonCode> returnValue = pushAppService.findAllDevDiv(search);

        ResultDTO<List<CommonCode>> resultDto = new ResultDTO<>(returnValue);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
