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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSession;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.AgendaArticleProgressCode;
import jmnet.moka.core.tps.common.code.AnswerDivCode;
import jmnet.moka.core.tps.common.code.AnswerLoginSnsCode;
import jmnet.moka.core.tps.common.code.AnswerRelDivCode;
import jmnet.moka.core.tps.common.code.LinkTargetCode;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.common.code.PackageDivCode;
import jmnet.moka.core.tps.common.code.PhotoArchiveMenuCode;
import jmnet.moka.core.tps.common.code.TourStatusCode;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.helper.EditFormHelper;
import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.articlesource.service.ArticleSourceService;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentOrderType;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatCode;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkDTO;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkGroupDTO;
import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;
import jmnet.moka.core.tps.mvc.watermark.service.WatermarkService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
@Api(tags = {"??? ?????? ?????? ?????? API"})
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

    @Value("${package.compYn}")
    private String packageCompYn;

    @Autowired
    private TpsLogger tpsLogger;

    @Autowired
    private EditFormHelper editFormHelper;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ArticleSourceService articleSourceService;

    @Autowired
    private WatermarkService watermarkService;

    private final static String DEFAULT_SITE = "joongang";

    @ApiOperation(value = "???????????? ????????????")
    @GetMapping("/init")
    public ResponseEntity<?> getAppInitData(HttpServletRequest request) {

        Map<String, Object> result = MapBuilder
                .getInstance()
                .add("UPLOAD_PATH_URL", uploadPathUrl)                               // ?????? ????????? prefix
                .add("PER_PAGE_COUNT", TpsConstants.PER_PAGE_COUNT)                  // ???????????? ??????
                .add("MAX_PAGE_COUNT", TpsConstants.MAX_PAGE_COUNT)                  // ?????? ????????????
                .add("DISP_PAGE_COUNT", TpsConstants.DISP_PAGE_COUNT)                // ?????? ????????????
                .add("MORE_COUNT", TpsConstants.MORE_COUNT)                          // ????????? ??????
                .add("EXCLUDE_PAGE_SERVICE_NAME_LIST", excludePageServiceName)       // ????????????????????? ????????????
                .add("PAGE_TYPE_HTML", TpsConstants.PAGE_TYPE_HTML)                  // ????????? ????????????
                .add("DESKING_TITLE_WIDTH", deskingTitleWidth)                       // pc title width
                .add("DESKING_MTITLE_WIDTH", deskingMTitleWidth)                     // mobile title width
                .add("PDS_URL", pdsUrl)                                              // pds Url
                .add("WIMAGE_URL", wimageUrl)                                        // wimage Url
                .add("IR_URL", irUrl)                                                // ir Url
                .add("OVP_PREVIEW_URL", ovpPreviewUrl)                               // ovp ???????????? url
                .add("PHOTO_ARCHIVE_URL", photoArchiveUrl)                           // ?????????????????? url
                .add("PACKAGE_COMP_YN", packageCompYn)                               // ????????? ?????? ???????????? CompYn?????????
                .getMap();

        result.put("MEMBER_STATUS_CODE", MemberStatusCode.toList());

        result.put("PHOTO_ARCHIVE_CODE", PhotoArchiveMenuCode.toList());

        result.put("TRENDPOLL_STAT_CODE", PollStatCode.toList());

        // ???????????? ??????
        result.put("WATERMARK_LIST", getWatermarkGroupList());

        // ?????? ?????? ??????
        result.put("COMMENT_STATUS_CODE", CommentStatusType.toList());

        // ?????? ?????? ??????
        result.put("COMMENT_ORDER_CODE", CommentOrderType.toList());

        // ?????? ?????? ??????
        result.put("COMMENT_SITE_CODE", TpsConstants.COMMENT_SITE_CODE);

        // ?????? ?????? ??????
        result.put("COMMENT_TAG_DIV_CODE", TpsConstants.COMMENT_TAG_DIV_CODE);

        // API ?????? ?????? ???
        result.put("API_TYPE_CODE", TpsConstants.API_TYPE_CODE);

        // API ?????? ?????? ???
        List<Map<String, Object>> httpMethodCodes = new ArrayList<>();
        httpMethodCodes.add(MapBuilder
                .getInstance()
                .add(HttpMethod.GET.name(), HttpMethod.GET.name())
                .getMap());
        httpMethodCodes.add(MapBuilder
                .getInstance()
                .add(HttpMethod.POST.name(), HttpMethod.POST.name())
                .getMap());
        httpMethodCodes.add(MapBuilder
                .getInstance()
                .add(HttpMethod.PUT.name(), HttpMethod.PUT.name())
                .getMap());
        httpMethodCodes.add(MapBuilder
                .getInstance()
                .add(HttpMethod.DELETE.name(), HttpMethod.DELETE.name())
                .getMap());
        result.put(TpsConstants.API_METHOD, httpMethodCodes);

        // ????????????
        result.put("TOUR_STATUS", TourStatusCode.toList());

        // ??????????????? ????????? ??????
        result.put("AGENDA_ARTICLE_PROGRESS", AgendaArticleProgressCode.toList());

        // ?????? ??????
        result.put("ANSWER_DIV", AnswerDivCode.toList());

        // ?????? ???????????? ??????
        result.put("ANSWER_REL_DIV", AnswerRelDivCode.toList());

        // ?????? LOGIN_SNS
        result.put("ANSWER_LOGIN_SNS", AnswerLoginSnsCode.toList());

        // ?????? ?????? ??????
        result.put("LINK_TARGET", LinkTargetCode.toList());

        // ????????? ??????
        result.put("PACKAGE_DIV", PackageDivCode.toList());

        // ???????????? ????????????
        //        result.put("CHANNEL_TYPE", ChannelTypeCode.toList());

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();
        if (authentication != null) {
            // ????????? ?????? ??????
            result.put("AUTH", authentication.getDetails());
        }

        ResultMapDTO resultDTO = new ResultMapDTO(result);

        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    // https???????????? ip????????? ????????? host ????????? ?????? ????????? ??????
    static {
        HostnameVerifier allHostsValid = new HostnameVerifier() {
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };
        HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
    }

    /**
     * ????????? url proxy ?????????
     *
     * @param response HTTP ??????
     * @param url      image url
     * @throws NoDataException ???????????????
     */
    @ApiOperation(value = "????????? url proxy ?????????")
    @GetMapping(value = "/image-proxy")
    public void getImageProxy(HttpServletResponse response, @ApiParam("??????URL") @RequestParam(value = "url", required = true) String url)
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

                //mime type ??????
                response.setContentType(urlConnection.getContentType());

                //?????? ????????? ????????? ????????????. ???????????? ?????? ?????? ????????? ?????????.
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

    private List<WatermarkGroupDTO> getWatermarkGroupList() {

        List<WatermarkGroupDTO> watermarkGroups = new ArrayList<>();

        List<Watermark> watermarks = watermarkService.findAllWatermark();

        if (watermarks != null) {
            Set<String> sourceSet = watermarks
                    .stream()
                    .map(watermark -> watermark.getSourceCode())
                    .collect(Collectors.toSet());

            List<ArticleSource> articleSources = articleSourceService.findAllArticleSourceByDesking(sourceSet.toArray(new String[0]));

            articleSources.forEach(articleSource -> {

                watermarkGroups.add(WatermarkGroupDTO
                        .builder()
                        .sourceName(articleSource.getSourceName())
                        .images(modelMapper.map(watermarks
                                .stream()
                                .filter(watermark -> articleSource
                                        .getSourceCode()
                                        .equals(watermark.getSourceCode()))
                                .collect(Collectors.toList()), WatermarkDTO.TYPE))
                        .build());
            });
        }

        return watermarkGroups;

    }

}
