package jmnet.moka.web.rcv.task.jamxml.vo.sub;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
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
    private String category1;
    private String category2;
    private String category3;
    private String category4;
    private String breakingNews;
    private int breakingNewsCnt;

    public TotalBasicInfo(JamArticleTotalVo jamArticleTotalVo) {
        final JamArticleVo article = jamArticleTotalVo.getMainData();

        if (article
                .getArticleProp()
                .getBreakingNewsCount() > 0) {
            this.setBreakingNews(article
                    .getArticleProp()
                    .getBreakingNews());
            this.setBreakingNewsCnt(article
                    .getArticleProp()
                    .getBreakingNewsCount());
        }
        String reporters = "";
        for (ReporterVo reporter : article.getReporters()) {
            if (!McpString.isNullOrEmpty(reporters)) {
                reporters = reporters.concat(".");
            }
            reporters = reporters.concat(reporter.getName());
        }
        this.setReporters(reporters);

        this.setCategory1(article
                .getCategoies()
                .get(0)
                .getCode());
        this.setCategory2(article
                .getCategoies()
                .size() >= 2 ? article
                .getCategoies()
                .get(1)
                .getCode() : "");
        this.setCategory3(article
                .getCategoies()
                .size() >= 3 ? article
                .getCategoies()
                .get(1)
                .getCode() : "");
        this.setCategory4(article
                .getCategoies()
                .size() >= 4 ? article
                .getCategoies()
                .get(1)
                .getCode() : "");
    }
}
