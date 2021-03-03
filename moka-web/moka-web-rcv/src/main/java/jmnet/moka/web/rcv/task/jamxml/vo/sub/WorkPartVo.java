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
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.jamxml.vo.sub
 * ClassName : WorkPartVo
 * Created : 2021-03-03 003 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-03-03 003 오후 3:52
 */
@Getter
@Setter
@XmlRootElement(name = "work_part")
@XmlAccessorType(XmlAccessType.FIELD)
public class WorkPartVo implements Serializable {
    private static final long serialVersionUID = 532256174299360108L;

    @XmlAttribute(name = "seq")
    private Integer seq;

    @XmlValue
    private String value;
}
