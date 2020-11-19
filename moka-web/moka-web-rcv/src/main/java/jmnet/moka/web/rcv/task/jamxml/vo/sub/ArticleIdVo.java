package jmnet.moka.web.rcv.task.jamxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlValue;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.vo.jamarticle
 * ClassName : ArticleIdVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 12:03
 */
@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "id")
@XmlAccessorType(XmlAccessType.FIELD)
public class ArticleIdVo implements Serializable {
    private static final long serialVersionUID = -9051404134574795832L;

    @XmlAttribute(name = "org_id")
    private String orgId;

    @XmlValue
    private String value;
}

