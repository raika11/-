package jmnet.moka.core.tps.mvc.jpod.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.Map;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.jpod.dto.PodtyEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.service.PodtyService;
import jmnet.moka.core.tps.mvc.jpod.vo.PodtyChannelVO;
import jmnet.moka.core.tps.mvc.jpod.vo.PodtyEpisodeVO;
import jmnet.moka.core.tps.mvc.jpod.vo.PodtyResultVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.controller
 * ClassName : PodtyEpisodeController
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 14:10
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/podty")
@Api(tags = {"Podty Proxy API"})
public class PodtyProxyRestController extends AbstractCommonController {

    private final PodtyService podtyService;



    public PodtyProxyRestController(PodtyService podtyService) {
        this.podtyService = podtyService;
    }

    /**
     * Podty 에피소드목록조회
     *
     * @return Podty 에피소드목록
     */
    @ApiOperation(value = "Podty 에피소드 목록 조회")
    @GetMapping("/channels")
    public ResponseEntity<?> getChannelList() {

        ResultListDTO<PodtyChannelVO> resultListMessage = new ResultListDTO<>();

        // 조회
        PodtyResultVO<PodtyChannelVO> returnValue = podtyService.findAllChannel();

        // 리턴값 설정
        resultListMessage.setTotalCnt(returnValue
                .getList()
                .size());
        resultListMessage.setList(returnValue.getList());

        ResultDTO<ResultListDTO<PodtyChannelVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * Podty 에피소드목록조회
     *
     * @param search 검색조건
     * @return Podty 에피소드목록
     */
    @ApiOperation(value = "Podty 에피소드 목록 조회")
    @GetMapping("/channels/{castSrl}/episodes")
    public ResponseEntity<?> getEpisodeList(@ApiParam("Podty 채널 일련번호") @PathVariable("castSrl") String castSrl,
            @SearchParam PodtyEpisodeSearchDTO search) {

        ResultListDTO<PodtyEpisodeVO> resultListMessage = new ResultListDTO<>();

        // 조회
        PodtyResultVO<PodtyEpisodeVO> returnValue = podtyService.findAllEpisode(castSrl, search);

        // 리턴값 설정
        Map<String, Object> pager = returnValue.getPager();
        if (pager != null) {
            resultListMessage.setTotalCnt((Integer) pager.get("totalCount"));
        }
        resultListMessage.setList(returnValue.getList());

        ResultDTO<ResultListDTO<PodtyEpisodeVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



}
