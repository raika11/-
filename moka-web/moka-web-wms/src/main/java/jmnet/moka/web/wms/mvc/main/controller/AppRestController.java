package jmnet.moka.web.wms.mvc.main.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.common.code.PhotoArchiveMenuCode;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.EditFormHelper;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
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
@Api(tags = {"앱 기본 설정 조회 API"})
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

    @Value("${watermark.path}")
    private String watermarkPath;

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
                .add("WATERMARK_PATH", watermarkPath)                                // 워터마크 이미지 경로
                .getMap();

        result.put("MEMBER_STATUS_CODE", MemberStatusCode.toList());

        result.put("PHOTO_ARCHIVE_CODE", PhotoArchiveMenuCode.toList());

        result.put("TRENDPOLL_STAT_CODE", PollStatCode.toList());

        ResultMapDTO resultDTO = new ResultMapDTO(result);

        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 이미지 url proxy 서비스
     *
     * @param response HTTP 응답
     * @param url      image url
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "이미지 url proxy 서비스")
    @GetMapping(value = "/image-proxy")
    public void getImageProxy(HttpServletResponse response, @ApiParam("사진URL") @RequestParam(value = "url", required = true) String url)
            throws Exception {

        InputStream is = null;
        BufferedOutputStream bos = null;
        BufferedInputStream bis = null;

        if (McpString.isEmpty(url)) {
            log.debug("[NO FILE PATH] {}", url);
        } else {
            try {
                URLConnection urlConnection = new URL(URLDecoder.decode(url, Charset.defaultCharset())).openConnection();
                is = urlConnection.getInputStream();

                bis = new BufferedInputStream(is);

                response.setHeader("Accept-Ranges", "bytes");
                response.setHeader("Pragma", "No-cache");
                response.setHeader("Cache-Control", "no-cache");
                response.setHeader("Expires", "0");
                String acceptRange = urlConnection.getHeaderField("Accept-Ranges");
                String contentLength = urlConnection.getHeaderField("Content-Length");
                String contentRange = urlConnection.getHeaderField("Content-Range");

                //mime type 지정
                response.setContentType(urlConnection.getContentType());

                //전송 내용을 헤드에 넣어준다. 마지막에 파일 전체 크기를 넣는다.
                if (contentRange != null) {
                    response.setHeader("Content-Range", contentRange);
                }
                if (acceptRange != null) {
                    response.setHeader("Accept-Ranges", acceptRange);
                }
                if (contentLength != null) {
                    response.setHeader("Content-Length", contentLength);
                }

                bos = new BufferedOutputStream(response.getOutputStream());

                int bufferSize = 1024 * 5;
                byte[] buf = new byte[bufferSize];
                int read;
                while ((read = bis.read(buf, 0, buf.length)) > 0) {
                    bos.write(buf, 0, read);
                } // while
            } catch (Exception e) {
                log.debug("[FAIL TO FILE LOAD] {}", url);
            } finally {
                if (is != null) {
                    is.close();
                    is = null;
                }

                if (bos != null) {
                    bos.flush();
                    bos.close();
                }
                if (bis != null) {
                    bis.close();
                }

            }
        }
    }

}
