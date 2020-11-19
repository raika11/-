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
 * ClassName : CpPubIdentification
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 4:55
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "Identification")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubIdentification implements Serializable {
    private static final long serialVersionUID = 6676577845118142652L;

    @XmlElement(name = "NewsIdentifier")
    CpPubNewsIdentifier newsIdentifier;
}
