package jmnet.moka.web.rcv.task.jamxml.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.jamxml.mapper.JamXmlMapper;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml.vo
 * ClassName : JamXmlRcvServiceImpl
 * Created : 2020-11-02 002 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-02 002 오후 2:28
 */

@Service
@Slf4j
public class JamXmlServiceImpl implements JamXmlService {
    private final JamXmlMapper jamXmlMapper;

    public JamXmlServiceImpl(JamXmlMapper jamXmlMapper) {
        this.jamXmlMapper = jamXmlMapper;
    }

    @Override
    public List<Map<String, String>> selectIssueSeriesReporter(String tmpRepList, String tmpKwdList)
            throws RcvDataAccessException {
        try {
            Map<String, String> map = new HashMap<>();
            map.put("tmpRepList", tmpRepList);
            map.put("tmpKwdList", tmpKwdList);
            return jamXmlMapper.callUpaIssueSeriesReporterSelByRepseq(map);
        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }

    @Override
    public void insertReceiveJobStep(JamArticleTotalVo articleTotal, String errorMessage)
            throws RcvDataAccessException {
        try {
            articleTotal.setErrorMessage(errorMessage);
            if( articleTotal.getArtHistoryId() == 0 )
                this.jamXmlMapper.callUpaJamRcvArtHistIns(articleTotal);
            else
                this.jamXmlMapper.callUpaJamRcvArtHistUpd(articleTotal);

        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }

    @Override
    public boolean canLoadJamXmlRcvTask(String sourceCode) {
        Integer cnt = jamXmlMapper.callUpaArticleSourceSelByJamLoad(sourceCode);
        if( cnt == null )
            return false;
        return cnt > 0;
    }


}
