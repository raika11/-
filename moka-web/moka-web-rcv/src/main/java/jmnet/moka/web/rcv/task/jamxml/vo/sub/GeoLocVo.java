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
 * ClassName : GeoLocVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 2:09
 */
@Data
@XmlRootElement(name = "geo_loc")
@XmlAccessorType(XmlAccessType.FIELD)
public class GeoLocVo implements Serializable {
    private static final long serialVersionUID = 5177529627631736184L;

    @XmlElement(name = "addr_kr")
    private String addrKr;

    @XmlElement(name = "lat")
    private String lat;

    @XmlElement(name = "lng")
    private String lng;
}
