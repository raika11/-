package jmnet.moka.web.schedule.mvc.schedule.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * 브라이트 코드에서 OVP 목록 중 오디오를 조회하여 rss 파일을 FTP 서버로 전송한다.
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
@Component
public class OvpAudioScheduleJob extends OvpScheduleJob {

    @Override
    public String getOvpType() {
        return "audio";
    }

    @Override
    public String getMediaType() {
        return "audio/mpeg";
    }

    @Override
    public int getBeforeDay() {
        return 3;
    }
}
