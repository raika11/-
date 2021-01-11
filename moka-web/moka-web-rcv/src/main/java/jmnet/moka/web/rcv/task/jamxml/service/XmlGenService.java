package jmnet.moka.web.rcv.task.jamxml.service;

import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.jamxml.process.XmlGenComponentManager;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml
 * ClassName : XmlGenService
 * Created : 2020-12-03 003 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-03 003 오후 5:40
 */
public interface XmlGenService {
    void insertUpdateArticleData(JamArticleTotalVo jamArticleTotalVo, XmlGenComponentManager componentManager)
            throws RcvDataAccessException;

    void afterProcessArticleData(JamArticleTotalVo articleTotal)
            throws RcvDataAccessException;

    void deleteArticleData(JamArticleTotalVo articleTotal)
            throws RcvDataAccessException;

    void stopArticleData(JamArticleTotalVo articleTotal)
            throws RcvDataAccessException;
}
