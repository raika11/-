package jmnet.moka.web.schedule.mvc.schedule.service;


import java.text.SimpleDateFormat;
import java.util.Date;
import jmnet.moka.core.common.brightcove.BrightcoveCredentailVO;
import jmnet.moka.core.common.brightcove.BrightcoveProperties;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.web.schedule.mvc.brightcove.service.BrightcoveService;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.ovp.dto.OvpSetJpotMetaJobDTO;
import jmnet.moka.web.schedule.mvc.ovp.mapper.OvpSetJpotMetaJobMapper;
import jmnet.moka.web.schedule.support.StatusResultType;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * 브라이트 코브에서 analytic 정보를 조회하여 jpod 메타데이터 입력 및 수정
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

    @Autowired
    private OvpSetJpotMetaJobMapper ovpSetJpotMetaJobMapper;

    @Override
    public void invoke(GenContent info) {
        GenContent scheduleInfo = info;
        GenStatus scheduleResult = info.getGenStatus();

        boolean success = true;

        BrightcoveCredentailVO credentail = brightcoveService.getClientCredentials();

        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String now = format.format(date);

        //GET 주소 + 파라미터 입력
        StringBuffer contentUrl = new StringBuffer();
        contentUrl.append(brightcoveProperties.getAnaliticsUrl() + "/data?accounts=" + brightcoveProperties.getBcAccountId());
        contentUrl.append("&dimensions=video");
        contentUrl.append("&fields=play_request,video,video_engagement_100,video_seconds_viewed,video.custom_fields.media_category");
        contentUrl.append("&where=video.q==+media_category:22_JPod");
        contentUrl.append("&from=" + now + "&to=" + now);

        try {
            //analytics API 호출
            JSONObject jsonObject = (JSONObject) brightcoveService.findJpodMetaAnalytics(credentail, contentUrl.toString());
            log.debug("item_count : {}", jsonObject.get("item_count"));
            JSONArray items = (JSONArray) jsonObject.get("items");
            for (Object item : items) {
                JSONObject tmp = (JSONObject) item;

                OvpSetJpotMetaJobDTO param = new OvpSetJpotMetaJobDTO();
                param.setStatDate(now);
                param.setVodCode(tmp
                        .get("video")
                        .toString());
                param.setPlayPv((Long) tmp.get("play_request"));
                param.setPlayUv(0L);
                param.setPlayTime((Long) tmp.get("video_seconds_viewed"));
                //log.debug("tmpValue : {} : {}", tmp.get("video_engagement_100"), tmp.get("video_engagement_100").getClass());
                if (tmp
                        .get("video_engagement_100")
                        .getClass() == Double.class) {
                    param.setCompleteCnt(Math.round((Double) tmp.get("video_engagement_100")));
                } else {
                    param.setCompleteCnt((Long) tmp.get("video_engagement_100"));
                }


                //데이터 갱신 procedure 실행
                int result = ovpSetJpotMetaJobMapper.findOne(param);
                log.debug("execute procedure result : {}", result);

                //procedure 실행 실패 시
                if (result == 0) {
                    throw new MokaException("데이터 갱신이 실패했습니다.");
                }
            }

            scheduleResult.setSendResult(0l);
            scheduleResult.setSendExecTime(0l);
            //AbstractScheduleJob.finish() 에서 필요한 schedule 실행 결과 값 입력
            setFinish(success, info);

        } catch (Exception e) {
            log.error(e.toString());
            scheduleResult.setSendExecTime(0l);
            setFinish(StatusResultType.FAILED_JOB, e.getMessage(), scheduleInfo);
        }
    }
}
