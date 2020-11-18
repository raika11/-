package jmnet.moka.web.rcv.task.cppubxml;

import java.util.Map;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.cppubxml.vo.CpPubNewsMLTotalVo;

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
public interface CpPubXmlRcvService {
    Map<String, String> doInsertUpdateArticleData( CpPubNewsMLTotalVo newsMLTotal )
        throws RcvDataAccessException;
}
