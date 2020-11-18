package jmnet.moka.web.rcv.task.cppubxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Data;

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
@Data
@XmlRootElement(name = "AdministrativeMetadata")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubNewsAdministrativeMetadata implements Serializable {
    private static final long serialVersionUID = 4374112095234678005L;

    @XmlElement(name = "FileName")
    private String fileName;
}
