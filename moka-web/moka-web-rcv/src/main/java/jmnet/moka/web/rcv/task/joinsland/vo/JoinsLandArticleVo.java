package jmnet.moka.web.rcv.task.joinsland.vo;

import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import jmnet.moka.web.rcv.task.joinsland.vo.sub.JoinsLandImageVo;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.joinsland.vo
 * ClassName : JoinsLandArticleVo
 * Created : 2021-02-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-01 001 오전 9:26
 */

@Getter
@Setter
@XmlRootElement(name = "article")
@XmlAccessorType(XmlAccessType.FIELD)
public class JoinsLandArticleVo extends BasicVo {
    private static final long serialVersionUID = -5647502697755920925L;

    @XmlElement(name = "medianame")
    private String mediaName;

    @XmlElement(name = "aid")
    private String aid;

    @XmlElement(name = "iud")
    private String iud;

    @XmlElement(name = "serviceday")
    private String serviceDay;

    @XmlElement(name = "servicetime")
    private String serviceTime;

    @XmlElement(name = "code1")
    private String code1;

    @XmlElement(name = "title")
    private String title;

    @XmlElement(name = "subtitle")
    private String subTitle;

    @XmlElement(name = "reporter")
    private String reporter;

    @XmlElement(name = "email")
    private String email;

    @XmlElement(name = "content")
    private String content;

    @XmlElement(name = "serviceurl")
    private String serviceUrl;

    @XmlElement(name = "copyright")
    private String copyright;

    @XmlElement(name = "images")
    private List<JoinsLandImageVo> images;
}
