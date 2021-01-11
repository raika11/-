package jmnet.moka.web.rcv.task.pubxml.service;

import java.util.Map;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.mapper.moka.PubXmlMapper;
import jmnet.moka.web.rcv.task.pubxml.vo.PubNewsMLTotalVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cpxml
 * ClassName : CpXmlRcvServiceImpl
 * Created : 2020-11-12 012 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-12 012 오전 9:50
 */
@Service
@Slf4j
public class PubXmlServiceImpl implements PubXmlService {
    private final PubXmlMapper pubXmlMapper;

    public PubXmlServiceImpl(PubXmlMapper pubXmlMapper) {
        this.pubXmlMapper = pubXmlMapper;
    }

    @Override
    public Map<String, String> doInsertUpdateArticleData(PubNewsMLTotalVo newsMLTotal)
            throws RcvDataAccessException {
        try {
            return pubXmlMapper.callUspRcvArticleJiXmlIns(newsMLTotal);
        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }
}
