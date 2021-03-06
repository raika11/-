package jmnet.moka.web.schedule.mvc.brightcove.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.common.brightcove.BrightcoveCredentailVO;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.brightcove.service
 * ClassName : BrightcoveService
 * Created : 2021-02-19 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-19 08:42
 */
public interface BrightcoveService {
    /**
     * brightcove ovp 목록 조회
     *
     * @return
     */
    List<Map<String, Object>> findAllOvpSource(BrightcoveCredentailVO credentail, String id, String size)
            throws IOException;

    /**
     * brightcove ovp 목록 조회
     *
     * @return
     */
    List<Map<String, Object>> findAllOvp(BrightcoveCredentailVO credentail)
            throws IOException;

    /**
     * brightcove jpod meta analytics 목록 조회
     *
     * @return
     */
    JSONObject findJpodMetaAnalytics(BrightcoveCredentailVO credentail, String url)
            throws IOException, ParseException;

    /**
     * brightcove 인증 정보 조회
     *
     * @return BrightcoveCredentailVO
     */
    BrightcoveCredentailVO getClientCredentials();
}
