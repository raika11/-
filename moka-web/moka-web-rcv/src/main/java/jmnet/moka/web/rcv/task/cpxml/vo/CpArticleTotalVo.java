package jmnet.moka.web.rcv.task.cpxml.vo;

import java.util.Date;
import jmnet.moka.web.rcv.common.vo.TotalVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpCategoryVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpComponentVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpReporterVo;
import jmnet.moka.web.rcv.util.RcvUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cpxml.vo
 * ClassName : CpArticleTotalVo
 * Created : 2020-11-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-10 010 오후 5:27
 */
@Getter
@Setter
public class CpArticleTotalVo extends TotalVo<CpArticleListVo> {
    private static final long serialVersionUID = -4730334959295848238L;

    private CpArticleVo curArticle;
    private String sourceCode;
    private String editYn;
    private Date pressDT;

    private int rid;
    private CpComponentVo curComponent;
    private CpReporterVo curReporter;
    private CpCategoryVo curCategory;
    private String curIndex;
    private String curKeyword;

    private String xmlFileNM;
    private int artHistoryId;
    private int artHistoryStep;
    private String errorMessage;

    public CpArticleTotalVo(CpArticleListVo mainData) {
        super(mainData);
    }

    public void setPressDT(Date pressDT) {
        this.pressDT = RcvUtil.getDeepDate(pressDT);
    }

    @SuppressWarnings("unused")
    public Date getPressDT() {
        return RcvUtil.getDeepDate(pressDT);
    }
}
