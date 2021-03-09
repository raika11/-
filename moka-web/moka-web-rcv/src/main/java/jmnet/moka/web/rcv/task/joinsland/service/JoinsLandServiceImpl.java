package jmnet.moka.web.rcv.task.joinsland.service;

import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.mapper.moka.JoinsLandMapper;
import jmnet.moka.web.rcv.task.joinsland.vo.JoinsLandArticleTotalVo;
import jmnet.moka.web.rcv.task.joinsland.vo.JoinsLandArticleVo;
import jmnet.moka.web.rcv.task.joinsland.vo.sub.JoinsLandImageVo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.joinsland.service
 * ClassName : JoinsLandServiceImpl
 * Created : 2021-02-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-01 001 오전 11:42
 */
@Service
public class JoinsLandServiceImpl implements JoinsLandService {
    private final JoinsLandMapper joinsLandMapper;

    public JoinsLandServiceImpl(JoinsLandMapper joinsLandMapper) {
        this.joinsLandMapper = joinsLandMapper;
    }

    @Transactional
    @Override
    public void doInsertUpdateArticleData(JoinsLandArticleTotalVo articleTotal)
            throws RcvDataAccessException {

        joinsLandMapper.callUspBulkJoinslandNewstableIns(articleTotal);

        final JoinsLandArticleVo article = articleTotal.getMainData();
        if( article.getImages() != null ) {
            for (JoinsLandImageVo image : article.getImages()) {
                articleTotal.setCurImage(image);
                joinsLandMapper.callUspBulkJoinslandNewsMMdataIns(articleTotal);
            }
        }
    }
}
