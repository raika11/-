package jmnet.moka.web.schedule.mvc.schedule.service;


import jmnet.moka.core.common.brightcove.BrightcoveCredentailVO;
import jmnet.moka.core.common.brightcove.BrightcoveProperties;
import jmnet.moka.web.schedule.mvc.brightcove.service.BrightcoveService;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * <pre>
 * 브라이트 코드에서 analytic 정보를 조회하여 jpod 메타데이터 입력 및 수정
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : OvpSetJpotMetaJob
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-09
 */
@Slf4j
@Component
public class OvpSetJpotMetaJob extends AbstractScheduleJob {

    @Autowired
    private BrightcoveService brightcoveService;

    @Autowired
    private BrightcoveProperties brightcoveProperties;

    @Value("${pc-home.rss-url}")
    private String pcHomeRssUrl;

    @Override
    public void invoke() {

        BrightcoveCredentailVO credentail = brightcoveService.getClientCredentials();
        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String now = format.format(date);

        StringBuffer content = new StringBuffer();
        content.append(brightcoveProperties.getAnaliticsUrl() +"/data?accounts="+ brightcoveProperties.getBcAccountId());
        content.append("&dimensions=video");
        content.append("&fields=play_request,video,video_engagement_100,video_seconds_viewed,video.custom_fields.media_category");
        content.append("&where=video.q==+media_category:22_JPod");
        content.append("&from="+ now +"&to="+ now);

        String url = content.toString();
        try {
            List<Map<String, Object>> list = brightcoveService.findAnalytics(credentail, url);
            log.debug("list : "+ list.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
