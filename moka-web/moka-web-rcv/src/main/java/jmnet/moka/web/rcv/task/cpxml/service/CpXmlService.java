package jmnet.moka.web.rcv.task.cpxml.service;

import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleTotalVo;

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
public interface CpXmlService {
    void doInsertUpdateArticleData( CpArticleTotalVo cpArticleTotalVo )
            throws RcvDataAccessException;

    void insertReceiveJobStep( CpArticleTotalVo articleTotal, String errorMessage )
            throws RcvDataAccessException;
}
