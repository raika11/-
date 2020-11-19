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
 * ClassName : MediaCodeVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오전 11:58
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "media_code")
@XmlAccessorType(XmlAccessType.FIELD)
public class MediaCodeVo implements Serializable {
    private static final long serialVersionUID = -2258841495552311108L;

    @XmlAttribute(name = "name")
    private String name;

    @XmlValue
    private String value;
}
