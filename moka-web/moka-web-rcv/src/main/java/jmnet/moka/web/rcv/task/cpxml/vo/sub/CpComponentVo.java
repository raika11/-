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
 * ClassName : ComponentVo
 * Created : 2020-11-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-10 010 오후 5:17
 */
@Data
@XmlRootElement(name = "component")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpComponentVo implements Serializable {
    private static final long serialVersionUID = -3660554049726012958L;

    @XmlElement(name = "type")
    private String type;

    @XmlElement(name = "url")
    private String url;

    @XmlElement(name = "desc")
    private String desc;

    @XmlElement(name = "width")
    private String width;

    @XmlElement(name = "height")
    private String height;

    @XmlElement(name = "etc")
    private String etc;
}
