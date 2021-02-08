package jmnet.moka.web.rcv.task.joinsland.vo.sub;

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
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.joinsland.vo.sub
 * ClassName : JoinsLandImageVo
 * Created : 2021-02-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-01 001 오전 9:31
 */
@Getter
@Setter
@XmlRootElement(name = "images")
@XmlAccessorType(XmlAccessType.FIELD)
public class JoinsLandImageVo implements Serializable {
    private static final long serialVersionUID = -8993693169399309436L;

    @XmlElement(name = "imageurl")
    private String imageUrl;

    @XmlElement(name = "description")
    private String description;
}
