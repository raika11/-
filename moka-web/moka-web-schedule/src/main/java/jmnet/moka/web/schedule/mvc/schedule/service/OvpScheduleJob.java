package jmnet.moka.web.schedule.mvc.schedule.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.brightcove.BrightcoveCredentailVO;
import jmnet.moka.core.common.brightcove.BrightcoveProperties;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.schedule.mvc.schedule.vo.OvpVideoRssVO;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <pre>
 * 브라이트 코드에서 OVP 목록을 조회하여 rss 파일을 FTP 서버로 전송한다.
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : OvpScheduleJob
 * Created : 2021-02-17 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-17 11:54
 */
@Slf4j
public abstract class OvpScheduleJob extends AbstractScheduleJob {

    @Autowired
    private BrightcoveProperties brightcoveProperties;

    @Value("${pc-home.rss-url}")
    private String pcHomeRssUrl;

    BrightcoveCredentailVO credentail;

    protected String type;

    public static final String ISO_8601_24H_FULL_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

    @Override
    public void invoke() {

        TimeZone UTC = TimeZone.getTimeZone("UTC");


        credentail = getClientCredentials();

        String result = findAllOvp();

        final SimpleDateFormat sdf = new SimpleDateFormat(ISO_8601_24H_FULL_FORMAT);
        sdf.setTimeZone(UTC);

        try {
            if (McpString.isNotEmpty(result)) {
                List<Map<String, Object>> list = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(result, new TypeReference<List<Map<String, Object>>>() {
                        });

                /**
                 * 동일 타입 목록만 필터링, 배포일시 내림차순 정렬
                 */
                List<Map<String, Object>> filteredList = list
                        .stream()
                        .filter(stringObjectMap -> {
                            Map<String, Object> fields = (Map<String, Object>) stringObjectMap.get("custom_fields");


                            return fields
                                    .getOrDefault("media_ratio", "")
                                    .toString()
                                    .toLowerCase()
                                    .equals(getOvpType().toLowerCase());
                        })
                        .sorted((o1, o2) -> {
                            try {
                                Long p1 = (Long) sdf
                                        .parse((String) o1.get("published_at"))
                                        .getTime();
                                Long p2 = (Long) sdf
                                        .parse((String) o2.get("published_at"))
                                        .getTime();
                                return (int) (p2 - p1);
                            } catch (Exception ex) {
                                return 0;
                            }
                        })
                        .collect(Collectors.toList());

                // rss 문서용 목록
                List<OvpVideoRssVO> rssList = new ArrayList<>();
                for (Map<String, Object> videoMap : filteredList) {
                    String id = (String) videoMap.get("id");
                    Map<String, Object> source = findAllVideoSource(id, brightcoveProperties.getOvpDefaultSize());
                    log.debug(source.toString());
                    rssList.add(OvpVideoRssVO
                            .builder()
                            .container(getMediaType())
                            .description(String.valueOf(videoMap.get("description")))
                            .id(String.valueOf(videoMap.get("id")))
                            .size(Long.parseLong(String.valueOf(source.get("size"))))
                            .sourceUrl(String.valueOf(source.get("src")))
                            .pubDate(sdf.parse((String) videoMap.get("published_at")))
                            .duration(TimeUnit.MILLISECONDS.toSeconds(Long.parseLong(String.valueOf(source.get("duration")))))
                            .title(String.valueOf(videoMap.get("name")))
                            .build());
                }
                log.debug(generateNewsbriefingByGoogle(rssList));

            }

        } catch (Exception ex) {
            log.error(ex.toString());
        }
    }

    /**
     * brightcove ovp 목록 조회
     *
     * @return
     */
    public Map<String, Object> findAllVideoSource(String id, String size)
            throws IOException {

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add(MokaConstants.AUTHORIZATION, String.format("%s %s", credentail.getTokenType(), credentail.getAccessToken()));
        String requestUrl = brightcoveProperties.getCmsBaseUrl();
        requestUrl = String.format(requestUrl + "/videos/%s/sources", id);
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.add("limit", brightcoveProperties.getOvpDefaultLimit());
        params.add("sort", brightcoveProperties.getOvpDefaultSort());
        ResponseEntity<String> responseEntity = restTemplateHelper.get(requestUrl, params, headers);

        List<Map<String, Object>> list = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(responseEntity.getBody(), new TypeReference<List<Map<String, Object>>>() {
                });

        Map<String, Object> mp4Video = list
                .stream()
                .filter(stringObjectMap -> {
                    boolean match = false;
                    if (stringObjectMap.containsKey("container")) {
                        String container = (String) stringObjectMap.getOrDefault("container", "");
                        String src = (String) stringObjectMap.getOrDefault("src", "");
                        // container가 MP4이고, src가 https로 시작하는 것만 필터링
                        if (container.equals("MP4") && src.startsWith("https://")) {
                            match = true;
                        }
                    }
                    return match;
                })
                .sorted((o1, o2) -> {
                    Integer i1 = (Integer) o1.get("size");
                    Integer i2 = (Integer) o2.get("size");
                    if (size.equals("large")) {
                        return i2 - i1;
                    } else {
                        return i1 - i2;
                    }
                })
                .findFirst()
                .orElseThrow();


        return mp4Video;
    }



    /**
     * brightcove ovp 목록 조회
     *
     * @return
     */
    public String findAllOvp() {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add(MokaConstants.AUTHORIZATION, String.format("%s %s", credentail.getTokenType(), credentail.getAccessToken()));
        //headers.add("X-API-KEY", brightcoveProperties.getApiKey());
        String requestUrl = brightcoveProperties.getCmsBaseUrl();
        requestUrl = String.format(requestUrl + "/folders/%s/videos", brightcoveProperties.getOvpFolderId());
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.add("limit", brightcoveProperties.getOvpDefaultLimit());
        params.add("sort", brightcoveProperties.getOvpDefaultSort());
        ResponseEntity<String> responseEntity = restTemplateHelper.get(requestUrl, params, headers);


        return responseEntity.getBody();
    }

    /**
     * rss 문자열 생성
     *
     * @param newsBriefingList rss객체 목록
     * @return rss 문자열
     */
    private String generateNewsbriefingByGoogle(List<OvpVideoRssVO> newsBriefingList) {
        StringBuilder sb = new StringBuilder();
        sb.append("<rss xmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\">");
        sb.append(" <channel>");
        sb.append("     <title>중앙일보</title>");
        sb.append(String.format("<link>%s</link>", pcHomeRssUrl));
        sb.append("     <description>현장의 진실을 중앙에 두다. 중앙일보 뉴스입니다.</description>");
        sb.append("     <language>ko-KR</language>");
        sb.append("     <copyright>Copyright by JoongAng Ilbo Co., Ltd. All Rights Reserved</copyright>");
        sb.append("     <image>");
        sb.append("         <url>https://pds.joins.com/news/editimg/2020-06-24_f622b663-75d8-411a-88d7-271cd5ae19c8.png</url>");
        sb.append("         <title>중앙일보</title>");
        sb.append(String.format("<link>%s</link>", pcHomeRssUrl));
        sb.append("     </image>");

        for (OvpVideoRssVO newsBriefing : newsBriefingList) {
            String utcDate = McpDate.dateStr(newsBriefing.getPubDate(), "ddd, dd MMM yyy HH:mm:ss 'GMT'");

            sb.append("     <item>");
            sb.append("<title>중앙일보 뉴스픽</title>");
            sb.append("<itunes:title>중앙일보 뉴스픽</itunes:title>");
            sb.append("<description>중앙일보 주요뉴스를 매일 영상과 음성으로 전합니다.</description>");
            sb.append(String.format("<guid isPermaLink=\"false\">{0}</guid>", newsBriefing.getId()));
            sb.append(String.format("<enclosure length=\"%s\" type=\"%s\" url=\"https://apis.joins.com/ovp/temporary/proxy/%s\" />",
                    newsBriefing.getSize(), newsBriefing.getContainer(), newsBriefing.getId()));
            sb.append(String.format("<pubDate>%s</pubDate>", utcDate));
            sb.append(String.format("<itunes:duration>%s</itunes:duration>", newsBriefing.getDuration()));
            sb.append("     </item>");
        }

        sb.append(" </channel>");
        sb.append("</rss>");

        return sb.toString();
    }

    /**
     * brightcove 인증 처리
     *
     * @return
     */
    private BrightcoveCredentailVO getClientCredentials() {
        BrightcoveCredentailVO brightcoveCredentailVO = null;
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE);
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.add("client_id", brightcoveProperties.getClientId());
        params.add("client_secret", brightcoveProperties.getClientSecret());
        ResponseEntity<String> responseEntity =
                restTemplateHelper.post(brightcoveProperties.getBaseUrl() + brightcoveProperties.getTokenApi(), params, headers);
        try {
            BrightcoveCredentailVO newCredentialVO = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), BrightcoveCredentailVO.class);
            brightcoveCredentailVO = newCredentialVO;
            brightcoveCredentailVO.setExpireDt(McpDate.secondPlus(newCredentialVO.getExpiresIn()));
        } catch (Exception ex) {
            log.error(ex.toString());
        }

        return brightcoveCredentailVO;
    }

    /**
     * ovp type
     *
     * @return
     */
    public abstract String getOvpType();

    /**
     * rss용 미디어 type
     *
     * @return
     */
    public abstract String getMediaType();
}
