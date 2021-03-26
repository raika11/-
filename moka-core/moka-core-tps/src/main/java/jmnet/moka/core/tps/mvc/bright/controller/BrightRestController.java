package jmnet.moka.core.tps.mvc.bright.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.bright.dto.OvpSaveDTO;
import jmnet.moka.core.tps.mvc.bright.dto.OvpSearchDTO;
import jmnet.moka.core.tps.mvc.bright.service.BrightcoveService;
import jmnet.moka.core.tps.mvc.bright.vo.OvpVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Validated
@Slf4j
@RequestMapping("/api")
@Api(tags = "브라이트 코브 API")
public class BrightRestController extends AbstractCommonController {

    @Value("${brightcove.jpod.folder-id}")
    private String jpodFolderId;

    @Autowired
    private BrightcoveService brightcoveService;

    //    @ApiOperation(value = "jpod ovp 목록 조회 예제")
    //    @GetMapping("/ovp")
    //    public ResponseEntity<?> getOvpList(OvpSearchDTO ovpSearchDTO)
    //            throws JsonProcessingException {
    //
    //        ovpSearchDTO.setFolderId(jpodFolderId);
    //
    //        return new ResponseEntity<>(brightcoveService.findAllOvp(ovpSearchDTO), HttpStatus.OK);
    //
    //    }

    @ApiOperation(value = "OVP 동영상 조회")
    @GetMapping("/bright/videos")
    public ResponseEntity<?> getVideoList(@Valid @SearchParam OvpSearchDTO search)
            throws Exception {
        try {
            List<OvpVO> returnValue = brightcoveService.findAllVideo(search);

            ResultListDTO<OvpVO> resultList = new ResultListDTO<OvpVO>();
            resultList.setList(returnValue);
            resultList.setTotalCnt(returnValue.size());

            ResultDTO<ResultListDTO<OvpVO>> resultModel = new ResultDTO<ResultListDTO<OvpVO>>(resultList);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultModel, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO LOAD OVP LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD OVP LIST]", e, true);
            throw new Exception(msg("tps.bright.error.video"), e);
        }
    }

    @ApiOperation(value = "LIVE 영상 목록조회")
    @GetMapping("/bright/lives")
    public ResponseEntity<?> getLiveList()
            throws Exception {
        try {
            List<OvpVO> returnValue = brightcoveService.findAllLive();

            ResultListDTO<OvpVO> resultList = new ResultListDTO<OvpVO>();
            resultList.setList(returnValue);
            resultList.setTotalCnt(returnValue.size());

            ResultDTO<ResultListDTO<OvpVO>> resultModel = new ResultDTO<ResultListDTO<OvpVO>>(resultList);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultModel, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO LOAD LIVE LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD LIVE LIST]", e, true);
            throw new Exception(msg("tps.bright.error.live"), e);
        }
    }

    /**
     * 영상 등록 아직 동작 않함
     *
     * @param ovpSave   영상 정보
     * @param mediaFile 영상 파일
     * @return 저장 결과
     * @throws Exception 오류 처리
     */
    @ApiOperation(value = "영상 등록")
    @PostMapping("/ovp")
    public ResponseEntity<?> postLive(@Valid OvpSaveDTO ovpSave, @RequestParam(value = "mediaFile") MultipartFile mediaFile)
            throws Exception {
        try {
            ResponseEntity<?> returnValue = brightcoveService.createVideo(ovpSave);

            ResultDTO<?> resultModel = new ResultDTO<>(returnValue);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(returnValue, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO SAVE OVP]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO SAVE OVP]", e, true);
            throw new Exception(msg("tps.bright.error.save"), e);
        }
    }

}
