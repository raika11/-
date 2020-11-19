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
 * ClassName : CoverImgVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 1:53
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "cover_img")
@XmlAccessorType(XmlAccessType.FIELD)
public class CoverImgVo implements Serializable {
    private static final long serialVersionUID = 5832742317608490626L;

    @XmlElement(name = "bg_color")
    private String bgColor;

    @XmlElement(name = "pc_url")
    private String pcUrl;

    @XmlElement(name = "mo_url")
    private String moUrl;
}
