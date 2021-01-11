package jmnet.moka.web.rcv.task.rcvartreg.service;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.rcvartreg
 * ClassName : RcvArtRegService
 * Created : 2020-12-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-01 001 오후 5:57
 */
public interface RcvArtRegService {
    List<Map<String, Object>> getUspRcvArticleIudSelList();

    void setUspRcvArticleIudComplete(JamArticleTotalVo articleTotal);

    void setUspRcvArticleIudDelete(Map<String, Object> compMap);

    void getUspRcvCodeConvSelByRid(JamArticleTotalVo articleTotal);

    void getRcvArticleReporters(JamArticleTotalVo articleTotal);

    void getRcvArticleComponent(JamArticleTotalVo articleTotal, Map<String, Object> compMap, MokaRcvConfiguration rcvConfiguration);

    void getRcvArticleKeyword(JamArticleTotalVo articleTotal);

    void insertReceiveJobStep( Map<String, Object> compMap, String errorMessage )
            throws RcvDataAccessException;
}
