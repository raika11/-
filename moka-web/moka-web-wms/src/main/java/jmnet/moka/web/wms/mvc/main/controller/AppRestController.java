package jmnet.moka.web.wms.mvc.main.controller;

import io.swagger.annotations.ApiOperation;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.edit.DynamicFormDTO;
import jmnet.moka.core.tps.common.dto.edit.PartDTO;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.helper.DynamicFormHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.wms.mvc.main.controller
 * ClassName : AppRestController
 * Created : 2020-10-26 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-26 09:14
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/app")
public class AppRestController {

    @Value("${tps.upload.path.url}")
    private String uploadPathUrl;

    @Autowired
    private TpsLogger tpsLogger;

    @Autowired
    private DynamicFormHelper dynamicFormHelper;

    private final static String DEFAULT_SITE = "joongang";

    @ApiOperation(value = "서버변수 목록조회")
    @GetMapping("/init")
    public ResponseEntity<?> getAppInitData(HttpServletRequest request) {

        Map<String, Object> result = MapBuilder
                .getInstance()
                .add("UPLOAD_PATH_URL", uploadPathUrl) // 파일 서비스 prefix
                .add("PER_PAGE_COUNT", TpsConstants.PER_PAGE_COUNT) // 페이지당 건수
                .add("MAX_PAGE_COUNT", TpsConstants.MAX_PAGE_COUNT) // 최대 페이지수
                .add("DISP_PAGE_COUNT", TpsConstants.DISP_PAGE_COUNT) // 표출 페이지수
                .add("MORE_COUNT", TpsConstants.MORE_COUNT) // 더보기 건수
                .add("LIST_PARAGRAPH", TpsConstants.LIST_PARAGRAPH) // 컴포넌트 광고 리스트단락수
                .getMap();



        ResultMapDTO resultDTO = new ResultMapDTO(result);

        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }


    @ApiOperation(value = "Dynamic Form 데이터 조회")
    @GetMapping("/dynamic-form/{channelName}")
    public ResponseEntity<?> getDynamicForm(@PathVariable("channelName") String channelName,
            @RequestParam(value = "partId", required = false) String partId)
            throws MokaException {

        return getResponseDynamicFormDTO(DEFAULT_SITE, channelName, partId);
    }

    @ApiOperation(value = "Dynamic Form 저장")
    @PostMapping("/dynamic-form/{channelId}")
    public ResponseEntity<?> postDynamicForm(@PathVariable("channelId") String channelId, HttpServletRequest request, @Valid PartDTO partDTO)
            throws MokaException {

        return getResponseDynamicFormDTO(DEFAULT_SITE, channelId, partDTO.getId());
    }

    @ApiOperation(value = "Dynamic Form 데이터 조회")
    @GetMapping("/dynamic-form/{site}/{channelName}")
    public ResponseEntity<?> getDynamicForm(@PathVariable("site") String site, @PathVariable("channelName") String channelName,
            @RequestParam(value = "partId", required = false) String partId)
            throws MokaException {

        return getResponseDynamicFormDTO(site, channelName, partId);
    }

    private ResponseEntity<?> getResponseDynamicFormDTO(@PathVariable("site") String site, @PathVariable("channelName") String channelName,
            @RequestParam(value = "partId", required = false) String partId)
            throws MokaException {
        ResultDTO<?> resultDTO = null;

        if (McpString.isNotEmpty(partId)) {
            PartDTO partDTO = dynamicFormHelper.getPart(site, channelName, partId);
            resultDTO = new ResultDTO<PartDTO>(partDTO);
        } else {
            DynamicFormDTO dynamicFormDTO = dynamicFormHelper.getChannelFormat(site, channelName);
            resultDTO = new ResultDTO<DynamicFormDTO>(dynamicFormDTO);
        }

        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

}
