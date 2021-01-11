package jmnet.moka.web.rcv.task.pubxml.vo.sub;

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
 * ClassName : CpPubNewsAdministrativeMetadata
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 5:37
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "AdministrativeMetadata")
@XmlAccessorType(XmlAccessType.FIELD)
public class PubNewsAdministrativeMetadata implements Serializable {
    private static final long serialVersionUID = 4374112095234678005L;

    @XmlElement(name = "FileName")
    private String fileName;
}
