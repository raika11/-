package jmnet.moka.web.rcv.task.jamxml.vo.sub;

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
 * Package : jmnet.moka.web.rcv.vo.jamarticle
 * ClassName : RelArtVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 1:31
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "rel_art")
@XmlAccessorType(XmlAccessType.FIELD)
public class RelArtVo implements Serializable {
    private static final long serialVersionUID = -1392550983622705556L;

    @XmlElement(name = "title")
    private String title;

    @XmlElement(name = "url")
    private String url;
}
