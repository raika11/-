package jmnet.moka.web.rcv.task.jamxml.service;

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

public interface JamXmlService {
    List<Map<String, String>> selectIssueSeriesReporter(String tmpRepList, String tmpKwdList)
            throws RcvDataAccessException;

    void insertReceiveJobStep( JamArticleTotalVo articleTotal, String errorMessage )
            throws RcvDataAccessException;

    boolean canLoadJamXmlRcvTask(String sourceCode);
}

