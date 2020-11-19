package jmnet.moka.web.rcv.task.cppubxml.vo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import jmnet.moka.web.rcv.task.cppubxml.vo.sub.CpPubNewsEnvelope;
import jmnet.moka.web.rcv.task.cppubxml.vo.sub.CpPubNewsItem;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cpxml.vo
 * ClassName : CpArticleListVo
 * Created : 2020-11-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-10 010 오후 5:05
 */
@Getter
@Setter
@XmlRootElement(name = "NewsML")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubNewsMLVo extends BasicVo {
    private static final long serialVersionUID = -7352195509963411996L;

    @XmlElement(name = "NewsEnvelope")
    private CpPubNewsEnvelope newsEnvelope;

    @XmlElement(name = "NewsItem")
    private CpPubNewsItem newsItem;
}
