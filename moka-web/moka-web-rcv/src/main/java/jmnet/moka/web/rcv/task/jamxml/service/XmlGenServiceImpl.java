package jmnet.moka.web.rcv.task.jamxml.service;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.mapper.moka.XmlGenMapper;
import jmnet.moka.web.rcv.task.jamxml.process.XmlGenComponentManager;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.DescVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.RelArtVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ReporterVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.TotalBasicInfo;
import jmnet.moka.web.rcv.util.RcvUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml
 * ClassName : XmlGenServiceImpl
 * Created : 2020-12-03 003 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-03 003 오후 5:41
 */
@Service
@Slf4j
public class XmlGenServiceImpl implements XmlGenService {
    private final XmlGenMapper xmlGenMapper;

    public XmlGenServiceImpl(XmlGenMapper xmlGenMapper) {
        this.xmlGenMapper = xmlGenMapper;
    }

    @Override
    @Transactional
    public void deleteArticleData(JamArticleTotalVo articleTotal)
            throws RcvDataAccessException {
        xmlGenMapper.callUpaArticleBasicDelByJamIdOrRid(articleTotal);
        afterProcessArticleData( articleTotal );
    }

    @Override
    @Transactional
    public void stopArticleData(JamArticleTotalVo articleTotal)
            throws RcvDataAccessException {
        xmlGenMapper.callUspArticleIudStop(articleTotal);
        articleTotal.getMainData().setIud("D");
        afterProcessArticleData( articleTotal );
    }

    @Override
    @Transactional
    public void insertUpdateArticleData(JamArticleTotalVo articleTotal, XmlGenComponentManager componentManager)
            throws RcvDataAccessException {
        try {
            final JamArticleVo article = articleTotal.getMainData();

            articleTotal.setTotalBasicInfo(new TotalBasicInfo(articleTotal));

            // TB_ARTICLE_BASIC
            final Integer totalId = xmlGenMapper.callUpaArticleBasicInsByJamIdOrRid(articleTotal);
            if( totalId == null || totalId == 0 )
                throw new RcvDataAccessException( "callUpaArticleBasicIncByJamId totalId 생성 에러");
            articleTotal.setTotalId(totalId);

            // TB_ARTICLE_SERVICE
            xmlGenMapper.callUpaArticleServiceIns(articleTotal);

            // TB_ARTICLE_TITLE
            xmlGenMapper.callUpaArticleTitleIns(articleTotal);

            // TB_ARTICLE_CODELIST
            xmlGenMapper.callUpaArticleCodeListDel(articleTotal);

            articleTotal.setCurIndex(0);
            for( String masterCode : articleTotal.getMasterCodeList() ) {
                articleTotal.setCurIndex(articleTotal.getCurIndex() + 1);
                articleTotal.setCurMasterCode( masterCode );
                xmlGenMapper.callUpaArticleCodeListIns(articleTotal);
            }

            // TB_15RE_COMPONENT_MGT
            // TB_15RE_COMPONENT
            // TB_15RE_ARTICLE_MULTI
            insertUpdateArticleData_Component(articleTotal, componentManager);

            // TB_ARTICLE_CONTENT
            xmlGenMapper.callUpaArticleContentIns(articleTotal);

            // TB_15RE_ARTICLE_REPORTER
            xmlGenMapper.callUpa15ReArticleReporterDel(articleTotal);
            int curIndex = 1;
            for(ReporterVo reporter : article.getReporters()) {
                articleTotal.setCurIndex(curIndex++);
                articleTotal.setCurReporter(reporter);
                xmlGenMapper.callUpa15ReArticleReporterIns(articleTotal);
            }

            // TB_ARTICLE_KEYWORD
            xmlGenMapper.callUpaArticleKeywordDel(articleTotal);
            curIndex = 1;
            for(String keyword : article.getKeywords()) {
                articleTotal.setCurIndex(curIndex++);
                articleTotal.setCurKeyword(keyword);
                xmlGenMapper.callUpaArticleKeywordIns(articleTotal);
            }

            afterProcessArticleData( articleTotal );
        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }

    @Override
    public void afterProcessArticleData(JamArticleTotalVo articleTotal)
            throws RcvDataAccessException {
        xmlGenMapper.callUspBulkMgtIns(articleTotal);
        xmlGenMapper.callUsp15ReXmlZenArtIudComplete(articleTotal);
    }

    private void insertUpdateArticleData_Component(JamArticleTotalVo articleTotal, XmlGenComponentManager componentManager) {
        if( componentManager.getHpItems().size() > 0 ) {
            articleTotal.setCurCompType("HP");
            articleTotal.setCurCompId(0);
            xmlGenMapper.callUpa15ReComponentMgtIns(articleTotal);

            xmlGenMapper.callUpa15ReComponentDel(articleTotal);
            int curIndex = 0;
            for(ItemVo item : componentManager.getHpItems()) {
                if( McpString.isNullOrEmpty(item.getDesc().getDispYn()) )
                    item.getDesc().setDispYn("Y");
                if( item.getDesc().getValue().length() > 500 )
                    item.getDesc().setValue( item.getDesc().getValue().substring(0, 500) );
                item.getDesc().setValue( RcvUtil.remvConvSpecialChar( item.getDesc().getValue()));
                item.setUrl(item.getArtUrl());
                if( McpString.isNullOrEmpty(item.getBulk()))
                    item.setBulk( "N");
                if( item.getTitle() == null )
                    item.setTitle("");
                articleTotal.setCurIndex(++curIndex);
                articleTotal.setCurItem(item);
                articleTotal.setIsSrc(0);
                xmlGenMapper.callUpa15ReComponentIns(articleTotal);
            }

            //noinspection serial
            componentManager.getMultiItems().add( new ItemVo() {{
                setType("HP");
                setCompId(Integer.toString(articleTotal.getCurCompId()));
                setTitle( articleTotal.getMainData().getPcTitle());
            }});
        }

        if( componentManager.getRaItems().size() >0 ) {
            articleTotal.setCurCompType("RA");
            articleTotal.setCurCompId(0);
            xmlGenMapper.callUpa15ReComponentMgtIns(articleTotal);

            xmlGenMapper.callUpa15ReComponentDel(articleTotal);
            int curIndex = 0;
            for(ItemVo item : componentManager.getRaItems()) {
                for( RelArtVo rel : item.getRelArt()) {
                    if( item.getDesc() == null )
                        item.setDesc( new DescVo());
                    item.getDesc().setDispYn("Y");
                    item.getDesc().setValue("");
                    item.setUrl( Integer.toString(articleTotal.getTotalId()));
                    if( McpString.isNullOrEmpty(rel.getTitle()))
                        item.setTitle( articleTotal.getMainData().getPcTitle());
                    else
                        item.setTitle(rel.getTitle());
                    item.setWidth("0");
                    item.setHeight("0");
                    item.setKsize("0");
                    item.setBulk( "N");

                    articleTotal.setCurIndex(++curIndex);
                    articleTotal.setCurItem(item);
                    articleTotal.setIsSrc(0);
                    xmlGenMapper.callUpa15ReComponentIns(articleTotal);
                }
            }

            //noinspection serial
            componentManager.getMultiItems().add( new ItemVo() {{
                setType("RA");
                setCompId(Integer.toString(articleTotal.getCurCompId()));
                setTitle( articleTotal.getMainData().getPcTitle());
            }});
        }

        // 현재 RL은 처리하지 않는다.

        xmlGenMapper.callUpa15ArticleMultiDel(articleTotal);
        if( componentManager.getMultiItems().size() > 0 ) {
            int curIndex = 0;
            for(ItemVo item : componentManager.getMultiItems()) {

                if( ("MB,MD,MU").contains(item.getType()) )
                    item.setCompId( item.getJoinKey() );

                if( ("MY").contains(item.getType()) )
                    item.setVarcharKey( item.getUrl() );
                else if( ("MC,ME").contains(item.getType()) )
                    item.setVarcharKey( item.getJoinKey() );
                else
                    item.setVarcharKey( "" );

                if( !("HP,RA,RL,MC,ME").contains(item.getType()) )
                    item.setTitle( item.getDesc() == null ? "" : item.getDesc().getValue());

                if( ("ML,MJ,MW,MY,MC,ME,MF,MH,NY,NF,NN,NK").contains(item.getType()))
                    item.setLink( item.getUrl() );
                else
                    item.setLink( "" );

                if( ("MF,MH").contains(item.getType()))
                    item.setThumbImg( item.getPoster() );
                else
                    item.setThumbImg( "" );

                if( item.getCompId() == null ){
                    item.setCompId("0");
                }

                articleTotal.setCurIndex(++curIndex);
                articleTotal.setCurItem(item);
                xmlGenMapper.callUpa15ArticleMultiIns(articleTotal);
            }
        }
    }
}
