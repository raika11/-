package jmnet.moka.web.rcv.task.cppubxml.service;

import java.util.Map;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.cppubxml.mapper.CpPubXmlMapper;
import jmnet.moka.web.rcv.task.cppubxml.vo.CpPubNewsMLTotalVo;
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
public class CpPubXmlServiceImpl implements CpPubXmlService {
    private final CpPubXmlMapper cpPubXmlMapper;

    public CpPubXmlServiceImpl(CpPubXmlMapper cpPubXmlMapper) {
        this.cpPubXmlMapper = cpPubXmlMapper;
    }

    @Override
    public Map<String, String> doInsertUpdateArticleData(CpPubNewsMLTotalVo newsMLTotal)
            throws RcvDataAccessException {
        try {
            return cpPubXmlMapper.callUspRcvArticleJiXmlIns(newsMLTotal);
        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }
}
