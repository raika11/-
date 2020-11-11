package jmnet.moka.web.rcv.task.jamxml;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml
 * ClassName : JamXmlRcvService
 * Created : 2020-11-02 002 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-02 002 오후 2:28
 */
public interface JamXmlRcvService {
    Map<String, String> selectSectCodeByContCode( JamArticleTotalVo jamArticle)
            throws RcvDataAccessException;
    List<Map<String, String>> selectIssueSeriesReporter(String tmpRepList, String tmpKwdList)
            throws RcvDataAccessException;

    void insertReceiveJobStep( JamArticleTotalVo jamArticle )
            throws RcvDataAccessException;

    void updateReceiveJobStep(JamArticleTotalVo jamArticleTotalVo, int jobSeq, int jobStep)
        throws RcvDataAccessException;

    void doInsertUpdateArticleData(JamArticleTotalVo jamArticleTotalVo)
        throws RcvDataAccessException;
}

