package jmnet.moka.web.rcv.task.cppubxml.vo.sub;

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
 * Package : jmnet.moka.web.rcv.task.cppubxml.vo.sub
 * ClassName : CpNewsEnvelope
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 4:51
 */


@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "NewsEnvelope")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubNewsEnvelope implements Serializable {
    private static final long serialVersionUID = -6490897375132951089L;

    @XmlElement(name = "DateAndTime")
    private String dateAndTime;
}
