package jmnet.moka.web.rcv.task.cppubxml.vo.sub;

import java.io.Serializable;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cppubxml.vo.sub
 * ClassName : CpPubNewsComponentParent
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 5:35
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "NewsComponent")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubNewsComponentParent implements Serializable {
    private static final long serialVersionUID = -8175426458026250369L;

    @XmlAttribute(name = "EquivalentsList")
    private String equivalentsList;

    @XmlElement(name = "BasisForChoice")
    private String basisForChoice;

    @XmlElement(name = "AdministrativeMetadata")
    private CpPubNewsAdministrativeMetadata administrativeMetadata;

    @XmlElement(name = "DescriptiveMetadata")
    private String descriptiveMetadata;

    @XmlElement(name = "NewsComponent")
    private List<CpPubNewsComponent> components;
}
