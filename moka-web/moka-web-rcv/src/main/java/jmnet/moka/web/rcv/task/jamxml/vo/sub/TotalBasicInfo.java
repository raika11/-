package jmnet.moka.web.rcv.task.jamxml.vo.sub;

import java.util.Date;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.task.jamxml.process.XmlGenCodeConverter;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.util.RcvUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml.vo.sub
 * ClassName : totalBasicInfo
 * Created : 2020-11-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-10 010 오후 2:25
 */
@Getter
@Setter
@XmlRootElement(name = "totalBasicInfo")
@XmlAccessorType(XmlAccessType.FIELD)
public class TotalBasicInfo {
    private String reporters;
    private Integer breakingNews;
    private int breakingNewsCnt;

    public TotalBasicInfo(JamArticleTotalVo articleTotal) {
        final JamArticleVo article = articleTotal.getMainData();

        articleTotal.setServiceDatetime(RcvUtil.getDateFromJamDateString(article.getArticleProp().getServiceDate()));
        if (articleTotal.getServiceDatetime() == null) {
            articleTotal.setServiceDatetime(new Date());
        }

        if( article.getArticleProp().getBreakingNewsCount() != null ) {
            if (article.getArticleProp().getBreakingNewsCount() > 0) {
                this.setBreakingNews(RcvUtil.parseInt(article.getArticleProp().getBreakingNews()));
                this.setBreakingNewsCnt(article.getArticleProp().getBreakingNewsCount());
            }
        }
        this.setReporters(article.getReporterNameList());

        articleTotal.setServiceDate( McpDate.dateStr(articleTotal.getServiceDatetime(), "yyyyMMdd"));
        if (McpString.isNullOrEmpty(article.getPaperProp().getPressDate())) {
            article.getPaperProp().setPressDate(McpDate.dateStr(articleTotal.getServiceDatetime(), "yyyyMMdd"));
        }

        articleTotal.setPressCategoryCode(XmlGenCodeConverter.convertSectionCode(article.getMediaCode().getValue(),
                article.getPaperProp().getSection()));

        if (McpString.isNullOrEmpty(article.getArticleProp().getLoginFlag())) {
            article.getArticleProp().setLoginFlag("N");
        }
        if (McpString.isNullOrEmpty(article.getArticleProp().getAdultFlag())) {
            article.getArticleProp().setAdultFlag("N");
        }

        article.setTitle( RcvUtil.remvConvSpecialChar(article.getTitle() ) );
        article.setMoTitle( RcvUtil.remvConvSpecialChar(article.getMoTitle() ) );
        article.setPcTitle( RcvUtil.remvConvSpecialChar(article.getPcTitle() ) );
        article.setListTitle( RcvUtil.remvConvSpecialChar(article.getListTitle() ) );
        article.setSubTitle( RcvUtil.remvConvSpecialChar(article.getSubTitle() ) );
        article.getContents().setBody( RcvUtil.remvConvSpecialChar(article.getContents().getBody() ) );

        // summary 는 UPA_15RE_ARTICLE_IUD_PROC procedure 에서 처리한다.
        // articleTotal.setSummary( RcvUtil.getSummaryText( article.getContents().getBody()));
    }
}
