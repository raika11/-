package jmnet.moka.web.rcv.task.cppubxml.vo.sub;

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
 * Package : jmnet.moka.web.rcv.task.cppubxml.vo.sub
 * ClassName : CpNewsItem
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 4:54
 */
@Data
@XmlRootElement(name = "NewsItem")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubNewsItem implements Serializable {
    private static final long serialVersionUID = -431841268342857217L;

    @XmlElement(name = "Identification")
    CpPubIdentification identification;

    @XmlElement(name = "NewsManagement")
    CpPubNewsManagement newsManagement;

    @XmlElement(name = "NewsComponent")
    CpPubNewsComponentParent newsComponents;
}
