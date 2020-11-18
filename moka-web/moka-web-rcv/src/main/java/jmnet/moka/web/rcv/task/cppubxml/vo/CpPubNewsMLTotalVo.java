package jmnet.moka.web.rcv.task.cppubxml.vo;

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
public class CpPubNewsMLTotalVo extends TotalVo<CpPubNewsMLVo> {
    private static final long serialVersionUID = -9191740976232652254L;

    private CpPubXmlFileName xmlFileName = new CpPubXmlFileName();

    private String sourceCode;

    private String articleItemId;
    private String articleIssue;

    private String xmlBody;

    public CpPubNewsMLTotalVo(CpPubNewsMLVo mainData) {
        super(mainData);
    }
}
