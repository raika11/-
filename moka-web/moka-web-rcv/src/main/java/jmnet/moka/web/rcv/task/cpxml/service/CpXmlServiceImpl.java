package jmnet.moka.web.rcv.task.cpxml.service;

import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.mapper.moka.CpXmlMapper;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleTotalVo;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpCategoryVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpComponentVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpReporterVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
public class CpXmlServiceImpl implements CpXmlService {
    private final CpXmlMapper cpXmlMapper;

    private static final int ErrCode_Rid_Basic = -800;
    private static final int ErrCode_Rid_Etc = -900;

    public CpXmlServiceImpl(CpXmlMapper cpXmlMapper) {
        this.cpXmlMapper = cpXmlMapper;
    }

    private boolean isReturnErr(Integer ret) {
        if (ret == null) {
            return true;
        }
        return ret == ErrCode_Rid_Basic || ret == ErrCode_Rid_Etc;
    }

    @Override
    @Transactional
    public void doInsertUpdateArticleData(CpArticleTotalVo cpArticleTotal)
            throws RcvDataAccessException {

        final CpArticleVo article = cpArticleTotal.getCurArticle();

        final Integer rid = cpXmlMapper.callUspRcvArticleBasicIns(cpArticleTotal);
        if (isReturnErr(rid)) {
            throw new RcvDataAccessException("기사 기본 정보 입력 오류");
        }
        cpArticleTotal.setRid(rid);

        if (article.getIud().equals("D")) {
            return;
        }

        if (isReturnErr(cpXmlMapper.callUspRcvArticleComponentDel(cpArticleTotal))) {
            throw new RcvDataAccessException("기사 기존 Component 정보 삭제 오류");
        }

        if (isReturnErr(cpXmlMapper.callUspRcvArticleReporterDel(cpArticleTotal))) {
            throw new RcvDataAccessException("기사 기존 Reporter 정보 삭제 오류");
        }

        if (isReturnErr(cpXmlMapper.callUspRcvArticleCodeDel(cpArticleTotal))) {
            throw new RcvDataAccessException("기사 기존 Code 정보 삭제 오류");
        }

        if (isReturnErr(cpXmlMapper.callUspRcvArticleKeywordDel(cpArticleTotal))) {
            throw new RcvDataAccessException("기사 기존 Keyword 정보 삭제 오류");
        }

        for (CpComponentVo component : article.getComponents()) {
            cpArticleTotal.setCurComponent(component);
            if (isReturnErr(cpXmlMapper.callUspRcvArticleComponentIns(cpArticleTotal))) {
                throw new RcvDataAccessException("기사 Component 정보 입력 오류");
            }
        }

        for(CpReporterVo reporter : article.getReporters() ){
            cpArticleTotal.setCurReporter(reporter);
            if (isReturnErr(cpXmlMapper.callUspRcvArticleReporterIns(cpArticleTotal))) {
                throw new RcvDataAccessException("기사 Reporter 정보 입력 오류");
            }
        }

        int curIndex = 1;
        for(CpCategoryVo category : article.getCategoies()){
            cpArticleTotal.setCurCategory(category);
            cpArticleTotal.setCurIndex(Integer.toString(curIndex++));
            if (isReturnErr(cpXmlMapper.callUspRcvArticleCodeIns(cpArticleTotal))) {
                throw new RcvDataAccessException("기사 Code 정보 입력 오류");
            }
        }

        for(String tag : article.getTags()){
            cpArticleTotal.setCurKeyword(tag);
            cpArticleTotal.setCurIndex(Integer.toString(curIndex++));
            if (isReturnErr(cpXmlMapper.callUspRcvArticleKeywordIns(cpArticleTotal))) {
                throw new RcvDataAccessException("기사 Keyword 정보 입력 오류");
            }
        }
    }

    @Override
    public void insertReceiveJobStep(CpArticleTotalVo articleTotal, String errorMessage)
            throws RcvDataAccessException {
        try {
            articleTotal.setErrorMessage(errorMessage);
            if( articleTotal.getArtHistoryId() == 0 )
                this.cpXmlMapper.callUpaCpRcvArtHistIns(articleTotal);
            else
                this.cpXmlMapper.callUpaCpRcvArtHistUpd(articleTotal);

        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }
}
