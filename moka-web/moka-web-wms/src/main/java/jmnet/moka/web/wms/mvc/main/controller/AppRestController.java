package jmnet.moka.web.wms.mvc.main.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.helper.EditFormHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    private EditFormHelper editFormHelper;

    @Autowired
    private ObjectMapper objectMapper;

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

}
