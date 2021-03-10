package jmnet.moka.web.schedule.mvc.schedule.service;


import jmnet.moka.core.common.brightcove.BrightcoveCredentailVO;
import jmnet.moka.core.common.brightcove.BrightcoveProperties;
import jmnet.moka.web.schedule.mvc.brightcove.service.BrightcoveService;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

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

    @Override
    public void invoke() {

        BrightcoveCredentailVO credentail = brightcoveService.getClientCredentials();
        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String now = format.format(date);

        //GET 주소 + 파라미터 입력
        StringBuffer contentUrl = new StringBuffer();
        contentUrl.append(brightcoveProperties.getAnaliticsUrl() +"/data?accounts="+ brightcoveProperties.getBcAccountId());
        contentUrl.append("&dimensions=video");
        contentUrl.append("&fields=play_request,video,video_engagement_100,video_seconds_viewed,video.custom_fields.media_category");
        contentUrl.append("&where=video.q==+media_category:22_JPod");
        contentUrl.append("&from="+ now +"&to="+ now);

        try {
            //analytics API 호출
            JSONObject jsonObject = (JSONObject) brightcoveService.findAnalytics(credentail, contentUrl.toString());
            log.debug("jsonObject : "+ jsonObject);
            log.debug("item_count : {}", jsonObject.get("item_count"));
            JSONArray items = (JSONArray) jsonObject.get("items");
            for(Object item : items){
                JSONObject tmp = (JSONObject) item;
                log.debug("now : {}", now);
                log.debug("video : {}", tmp.get("video"));
                log.debug("play_request : {}", tmp.get("play_request"));
                log.debug("0 : {}", 0);
                log.debug("video_seconds_viewed : {}", tmp.get("video_seconds_viewed"));
                log.debug("video_engagement_100 : {}", tmp.get("video_engagement_100"));
                log.debug("===============================================");
            }


        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
