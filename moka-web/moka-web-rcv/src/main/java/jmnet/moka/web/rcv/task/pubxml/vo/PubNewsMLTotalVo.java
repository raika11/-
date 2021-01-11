package jmnet.moka.web.rcv.task.pubxml.vo;

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
public class PubNewsMLTotalVo extends TotalVo<PubNewsMLVo> {
    private static final long serialVersionUID = -9191740976232652254L;

    private PubXmlFileName xmlFileName = new PubXmlFileName();

    private String sourceCode;

    private String articleItemId;
    private String articleIssue;

    private String xmlBody;

    public PubNewsMLTotalVo(PubNewsMLVo mainData) {
        super(mainData);
    }
}
