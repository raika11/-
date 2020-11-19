package jmnet.moka.web.rcv.task.cppubxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Data;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cppubxml.vo.sub
 * ClassName : CpNewsItemType
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 5:03
 */
@Data
@XmlRootElement(name = "NewsItemType")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubFormalNameItem implements Serializable {
    private static final long serialVersionUID = 3352420652187260920L;

    @XmlAttribute(name = "FormalName")
    private String formalName;
}
