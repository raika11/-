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
 * ClassName : CpPubCharacteristics
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 5:59
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "Characteristics")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubCharacteristics implements Serializable {
    private static final long serialVersionUID = 3412433586589693011L;

    @XmlElement(name = "SizeInBytes")
    String sizeInBytes;

    @XmlElement(name = "PageCoordinate")
    String pageCoordinate;

    @XmlElement(name = "ItemCoordinate")
    String itemCoordinate;

    @XmlElement(name = "Property")
    CpPubFormalNameWithValueItem property;
}
