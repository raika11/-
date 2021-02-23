package jmnet.moka.web.rcv.mapper.moka;

import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml
 * ClassName : JamXmlRcvMapper
 * Created : 2020-11-02 002 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-02 002 오후 2:30
 */
@Repository
@Mapper
public interface XmlGenMapper {
    Integer callUpaArticleBasicInsByJamIdOrRid(JamArticleTotalVo articleTotal);
    void callUpaArticleServiceIns( JamArticleTotalVo articleTotal);
    void callUpaArticleTitleIns( JamArticleTotalVo articleTotal);
    void callUpaArticleCodeListDel( JamArticleTotalVo articleTotal);
    void callUpaArticleCodeListIns( JamArticleTotalVo articleTotal);
    void callUpa15ReArticleReporterDel( JamArticleTotalVo articleTotal);
    void callUpa15ReArticleReporterIns( JamArticleTotalVo articleTotal);
    void callUpaArticleKeywordDel( JamArticleTotalVo articleTotal);
    void callUpaArticleKeywordIns( JamArticleTotalVo articleTotal);
    void callUpa15ReComponentMgtIns( JamArticleTotalVo articleTotal);
    void callUpa15ReComponentDel( JamArticleTotalVo articleTotal);
    void callUpa15ReComponentIns( JamArticleTotalVo articleTotal);
    void callUpa15ArticleMultiDel( JamArticleTotalVo articleTotal);
    void callUpa15ArticleMultiIns( JamArticleTotalVo articleTotal);
    void callUpa15ArticleMultiOvpIns( JamArticleTotalVo articleTotal);
    void callUpaArticleContentIns( JamArticleTotalVo articleTotal);
    void callUpaArticleHistoryIns( JamArticleTotalVo articleTotal);

    void callUpaArticleBasicDelByJamIdOrRid( JamArticleTotalVo articleTotal);
    void callUsp15ReXmlZenArtIudComplete( JamArticleTotalVo articleTotal);
    void callUspArticleIudStop( JamArticleTotalVo articleTotal);
    void callUspBulkMgtIns(JamArticleTotalVo articleTotal);
}
