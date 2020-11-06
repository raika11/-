package jmnet.moka.web.rcv.task.jamxml.vo.sub;

import java.io.Serializable;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Data;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.vo.jamarticle
 * ClassName : ItemVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 1:18
 */
@Data
@XmlRootElement(name = "item")
@XmlAccessorType(XmlAccessType.FIELD)
public class ItemVo implements Serializable {
    private static final long serialVersionUID = 3158666626339765822L;

    @XmlAttribute(name = "type")
    private String type;

    @XmlElement(name = "url")
    private String url;

    @XmlElement(name = "desc")
    private DescVo desc;

    @XmlElement(name = "width")
    private String width;

    @XmlElement(name = "height")
    private String height;

    @XmlElement(name = "ksize")
    private String ksize;

    @XmlElement(name = "bulk")
    private String bulk;

    @XmlElement(name = "thumbnail")
    private String thumbnail;

    @XmlElement(name = "water-mark")
    private String waterMark;

    @XmlElement(name = "joinKey")
    private String joinKey;

    @XmlElement(name = "rel_art")
    private List<RelArtVo> relArt;

    @XmlElement(name = "poster")
    private String poster;
}
