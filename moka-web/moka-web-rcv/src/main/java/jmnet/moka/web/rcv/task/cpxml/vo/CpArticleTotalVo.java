package jmnet.moka.web.rcv.task.cpxml.vo;

import jmnet.moka.web.rcv.common.vo.TotalVo;
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

    public CpArticleTotalVo(CpArticleListVo mainData) {
        super(mainData);
    }
}
