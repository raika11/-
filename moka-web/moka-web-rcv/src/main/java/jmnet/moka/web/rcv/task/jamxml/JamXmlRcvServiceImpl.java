package jmnet.moka.web.rcv.task.jamxml;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.jamxml.mapper.JamXmlRcvMapper;
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
public class JamXmlRcvServiceImpl implements JamXmlRcvService {
    private final JamXmlRcvMapper jamXmlRcvMapper;

    public JamXmlRcvServiceImpl(JamXmlRcvMapper jamXmlRcvMapper) {
        this.jamXmlRcvMapper = jamXmlRcvMapper;
    }

    @Override
    public Map<String, String> selectSectCodeByContCode(JamArticleTotalVo jamArticle)
            throws RcvDataAccessException {
        try {
            return jamXmlRcvMapper.selectSectCodeByContCode(jamArticle);
        } catch (DataAccessException e ) {
            throw new RcvDataAccessException( e.getCause() );
        }
    }

    @Override
    public List<Map<String, String>> selectIssueSeriesReporter(String tmpRepList, String tmpKwdList)
            throws RcvDataAccessException {
        try {
            Map<String, String> map = new HashMap<>();
            map.put("tmpRepList", tmpRepList );
            map.put("tmpKwdList", tmpKwdList );
            return jamXmlRcvMapper.selectIssueSeriesReporter(map);
        } catch (DataAccessException e ) {
            throw new RcvDataAccessException( e.getCause() );
        }
    }

    @Override
    public void insertReceiveJobStep(JamArticleTotalVo jamArticle)
            throws RcvDataAccessException {
        try {
            jamArticle.setArtHistoryStep(0);
            this.jamXmlRcvMapper.insertReceiveJobStep(jamArticle);
        } catch (DataAccessException e ) {
            throw new RcvDataAccessException( e.getCause() );
        }
    }
}
