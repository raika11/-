package jmnet.moka.web.wms.mvc.main.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.MemberRequestCode;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
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

    @Value("${tps.page.servicename.excludes}")
    private String[] excludePageServiceName;

    @Value("${desking.title.width}")
    private Long[] deskingTitleWidth;

    @Value("${desking.mtitle.width}")
    private Long deskingMTitleWidth;

    @Value("${pds.url}")
    private String pdsUrl;

    @Value("${wimage.url}")
    private String wimageUrl;

    @Value("${ir.url}")
    private String irUrl;

    @Value("${brightcove.preview.url}")
    private String ovpPreviewUrl;

    @Value("${photo.archive.url}")
    private String photoArchiveUrl;

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
                .add("UPLOAD_PATH_URL", uploadPathUrl)                               // 파일 서비스 prefix
                .add("PER_PAGE_COUNT", TpsConstants.PER_PAGE_COUNT)                  // 페이지당 건수
                .add("MAX_PAGE_COUNT", TpsConstants.MAX_PAGE_COUNT)                  // 최대 페이지수
                .add("DISP_PAGE_COUNT", TpsConstants.DISP_PAGE_COUNT)                // 표출 페이지수
                .add("MORE_COUNT", TpsConstants.MORE_COUNT)                          // 더보기 건수
                .add("EXCLUDE_PAGE_SERVICE_NAME_LIST", excludePageServiceName)       // 페이지서비스명 제외명칭
                .add("PAGE_TYPE_HTML", TpsConstants.PAGE_TYPE_HTML)                  // 페이지 기본타입
                .add("DESKING_TITLE_WIDTH", deskingTitleWidth)                       // pc title width
                .add("DESKING_MTITLE_WIDTH", deskingMTitleWidth)                     // mobile title width
                .add("PDS_URL", pdsUrl)                                              // pds Url
                .add("WIMAGE_URL", wimageUrl)                                        // wimage Url
                .add("IR_URL", irUrl)                                                // ir Url
                .add("OVP_PREVIEW_URL", ovpPreviewUrl)                               // ovp 미리보기 url
                .add("PHOTO_ARCHIVE_URL", photoArchiveUrl)                           // 포토아카이브 url
                .getMap();

        result.put("MEMBER_STATUS_CODE", MemberStatusCode.toList());

        /**
         * 사용자 신규 등록 요청
         */
        result.put("NEW_REQUEST", MemberRequestCode.NEW_REQUEST.getCode());
        /**
         * 사용자 신규 등록 SMS 인증 문자 발송
         */
        result.put("NEW_SMS", MemberRequestCode.NEW_SMS.getCode());
        /**
         * 잠금해제 요청
         */
        result.put("UNLOCK_REQUEST", MemberRequestCode.UNLOCK_REQUEST.getCode());
        /**
         * 잠금해제 요청 SMS인증문자
         */
        result.put("UNLOCK_SMS", MemberRequestCode.UNLOCK_SMS.getCode());



        ResultMapDTO resultDTO = new ResultMapDTO(result);

        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

}
