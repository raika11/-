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
 * ClassName : DescVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 1:21
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "desc")
@XmlAccessorType(XmlAccessType.FIELD)
public class DescVo implements Serializable {
    private static final long serialVersionUID = 2928026166350813799L;

    @XmlAttribute(name = "disp_yn")
    private String dispYn;

    @XmlValue
    private String value;
}
