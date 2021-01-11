package jmnet.moka.web.rcv.task.pubxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

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

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "NewsItem")
@XmlAccessorType(XmlAccessType.FIELD)
public class PubNewsItem implements Serializable {
    private static final long serialVersionUID = -431841268342857217L;

    @XmlElement(name = "Identification")
    PubIdentification identification;

    @XmlElement(name = "NewsManagement")
    PubNewsManagement newsManagement;

    @XmlElement(name = "NewsComponent")
    PubNewsComponentParent newsComponents;
}
