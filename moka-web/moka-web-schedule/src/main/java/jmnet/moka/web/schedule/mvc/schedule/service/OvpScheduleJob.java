package jmnet.moka.web.schedule.mvc.schedule.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.brightcove.BrightcoveCredentailVO;
import jmnet.moka.core.common.brightcove.BrightcoveProperties;
import jmnet.moka.web.schedule.mvc.brightcove.service.BrightcoveService;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.schedule.vo.OvpVideoRssVO;
import jmnet.moka.web.schedule.support.StatusResultType;
import jmnet.moka.web.schedule.support.common.FileUpload;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

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
    private BrightcoveService brightcoveService;

    @Autowired
    private BrightcoveProperties brightcoveProperties;

    @Value("${pc-home.rss-url}")
    private String pcHomeRssUrl;

    protected String type;

    @Override
    public void invoke(GenContent info) {
        GenContent scheduleInfo = info;
        GenStatus scheduleResult = info.getGenStatus();

        BrightcoveCredentailVO credentail = brightcoveService.getClientCredentials();

        try {
            List<Map<String, Object>> list = brightcoveService.findAllOvp(credentail);

            List<Map<String, Object>> filteredList = list
                    .stream()
                    .filter(stringObjectMap -> {
                        Map<String, Object> fields = (Map<String, Object>) stringObjectMap.get("custom_fields");
                        long term = 0l;
                        try {
                            Date upd = McpDate.utcDate((String) stringObjectMap.get("updated_at"));
                            term = McpDate.term(upd, McpDate.dateMinus(McpDate.now(), getBeforeDay()));
                        } catch (Exception ex) {
                            term = 0;
                        }
                        /**
                         * 수정일시를 기준으로 현재일 보다 3일전 기사인 경우 제외
                         * type과 media_ratio 동일 하지 않은 경우 제외
                         */
                        return term > 0 && fields
                                .getOrDefault("media_ratio", "")
                                .toString()
                                .toLowerCase()
                                .equals(getOvpType().toLowerCase());
                    })
                    .sorted((o1, o2) -> {
                        //배포일시 내림차순 정렬
                        try {
                            Long p1 = McpDate
                                    .utcDate((String) o1.get("published_at"))
                                    .getTime();
                            Long p2 = McpDate
                                    .utcDate((String) o2.get("published_at"))
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
                Map<String, Object> source = getOvpSource(credentail, id, brightcoveProperties.getOvpDefaultSize());
                log.debug(source.toString());
                rssList.add(OvpVideoRssVO
                        .builder()
                        .container(getMediaType())
                        .description(String.valueOf(videoMap.get("description")))
                        .id(String.valueOf(videoMap.get("id")))
                        .size(Long.parseLong(String.valueOf(source.get("size"))))
                        .sourceUrl(String.valueOf(source.get("src")))
                        .pubDate(McpDate.utcDate((String) videoMap.get("published_at")))
                        .duration(TimeUnit.MILLISECONDS.toSeconds(Long.parseLong(String.valueOf(source.get("duration")))))
                        .title(String.valueOf(videoMap.get("name")))
                        .build());
            }

            //boolean success = stringFileUpload(generateNewsbriefingByGoogle(rssList));
            FileUpload fileUpload = new FileUpload(scheduleInfo, mokaCrypt);
            boolean success = fileUpload.stringFileUpload(generateNewsbriefingByGoogle(rssList), "");

            //업로드 성공 시 GenStatus.content에 파일생성에 사용된 String 저장
            if (success) {
                scheduleResult.setContent(generateNewsbriefingByGoogle(rssList));
            }

            //AbstractSchduleJob.finish() 에서 필요한 schedule 실행 결과 값 입력
            setFinish(success, info);

        } catch (Exception ex) {
            log.error(ex.toString());
            setFinish(StatusResultType.FAILED_JOB, ex.getMessage(), info);
        }
    }

    /**
     * brightcove ovp 목록 조회
     *
     * @return
     */
    public Map<String, Object> getOvpSource(BrightcoveCredentailVO credentail, String id, String size)
            throws IOException {

        List<Map<String, Object>> list = brightcoveService.findAllOvpSource(credentail, id, size);

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

    /**
     * 현재일부터 이전 몇일까지의 컨텐츠만 추출할지의 기준값
     *
     * @return beforeDay
     */
    public abstract int getBeforeDay();
}
