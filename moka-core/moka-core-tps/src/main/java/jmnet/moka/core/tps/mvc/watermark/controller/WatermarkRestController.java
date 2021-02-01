package jmnet.moka.core.tps.mvc.watermark.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkDTO;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkSearchDTO;
import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;
import jmnet.moka.core.tps.mvc.watermark.service.WatermarkService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

/**
 * <pre>
 * 워터마크 관리
 * 2020. 10. 22. ssc 최초생성
 * RequestMapping 생성 규칙
 * </pre>
 *
 * @author ssc
 * @since 2020. 10. 22. 오후 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/watermark")
@Api(tags = {"워터마크 관리 API"})
public class WatermarkRestController extends AbstractCommonController {

    private final WatermarkService watermarkService;

    public WatermarkRestController(WatermarkService watermarkService) {
        this.watermarkService = watermarkService;
    }

    /**
     * 워터마크관리 목록 조회
     *
     * @param search 검색조건 : 사용여부
     * @return 워터마크목록
     */
    @ApiOperation(value = "워터마크 목록 조회")
    @GetMapping
    public ResponseEntity<?> getWatermarkList(@Valid @SearchParam WatermarkSearchDTO search) {

        ResultListDTO<WatermarkDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<Watermark> returnValue = watermarkService.findAllWatermark(search);

        // 리턴값 설정
        List<WatermarkDTO> watermarkList = modelMapper.map(returnValue.getContent(), WatermarkDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(watermarkList);

        // 결과값 셋팅
        ResultDTO<ResultListDTO<WatermarkDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

}
