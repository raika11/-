package jmnet.moka.web.rcv.task.joinsland.service;

import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.joinsland.vo.JoinsLandArticleTotalVo;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.joinsland.service
 * ClassName : JoinsLandService
 * Created : 2021-02-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-01 001 오전 11:41
 */
public interface JoinsLandService {
    void doInsertUpdateArticleData( JoinsLandArticleTotalVo articleTotal )
            throws RcvDataAccessException;
}
