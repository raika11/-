package jmnet.moka.web.rcv.task.cpxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Data;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cpxml.vo.sub
 * ClassName : OptionalVo
 * Created : 2020-11-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-10 010 오후 5:14
 */
@Data
@XmlRootElement(name = "category")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpOptionalVo implements Serializable {
    private static final long serialVersionUID = 8991259968383213340L;

    @XmlElement(name = "section")
    private String section;

    @XmlElement(name = "embargo")
    private String embargo;

    @XmlElement(name = "urgency")
    private String urgency;

    @XmlElement(name = "area")
    private String area;

    @XmlElement(name = "article_type")
    private String article_type;
}
