package jmnet.moka.web.rcv.task.jamxml.vo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import jmnet.moka.web.rcv.common.vo.TotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.TotalBasicInfo;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml.vo
 * ClassName : JamArticleTotalVo
 * Created : 2020-11-03 003 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-03 003 오후 2:41
 */

@Getter
@Setter
@XmlRootElement(name = "article")
@XmlAccessorType(XmlAccessType.FIELD)
public class JamArticleTotalVo extends TotalVo<JamArticleVo> {
    private static final long serialVersionUID = 2421696644497762565L;

    private int sourceCode;
    private String xmlFileNM;

    private String servCode;
    private String sectCode;

    private int artHistoryId;
    private int artHistoryStep;

    private TotalBasicInfo totalBasicInfo;

    public JamArticleTotalVo(JamArticleVo value) {
        super(value);
    }
}
