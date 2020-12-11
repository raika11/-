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
 * ClassName : PaperPropVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 2:05
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "paper_prop")
@XmlAccessorType(XmlAccessType.FIELD)
public class PaperPropVo implements Serializable {
    private static final long serialVersionUID = -6644049564223828746L;

    @XmlElement(name = "press_date")
    private String pressDate;

    @XmlElement(name = "ho")
    private String ho;

    @XmlElement(name = "pan")
    private String pan;

    @XmlElement(name = "section")
    private String section;

    @XmlElement(name = "myun")
    private String myun;

    @XmlElement(name = "position")
    private int position;
}
