package jmnet.moka.web.rcv.task.jamxml.vo.sub;

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
 * Package : jmnet.moka.web.rcv.vo.jamarticle
 * ClassName : EtcInfoVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 2:11
 */
@Data
@XmlRootElement(name = "etc_info")
@XmlAccessorType(XmlAccessType.FIELD)
public class EtcInfoVo implements Serializable {
    private static final long serialVersionUID = -8340764482483161382L;

    @XmlElement(name = "copyright")
    private String copyright;

    @XmlElement(name = "serviceurl")
    private String serviceUrl;
}
