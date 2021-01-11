package jmnet.moka.web.rcv.task.pubxml.service;

import java.util.Map;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.pubxml.vo.PubNewsMLTotalVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cpxml
 * ClassName : CpXmlRcvService
 * Created : 2020-11-12 012 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-12 012 오전 9:48
 */
public interface PubXmlService {
    Map<String, String> doInsertUpdateArticleData( PubNewsMLTotalVo newsMLTotal )
        throws RcvDataAccessException;
}
