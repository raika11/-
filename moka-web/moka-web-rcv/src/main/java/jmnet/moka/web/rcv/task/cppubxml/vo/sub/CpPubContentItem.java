package jmnet.moka.web.rcv.task.cppubxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Data;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cppubxml.vo.sub
 * ClassName : CpPubContentItem
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 5:56
 */
@Data
@XmlRootElement(name = "ContentItem")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubContentItem implements Serializable {
    private static final long serialVersionUID = -2181839129201450337L;

    @XmlAttribute(name = "Href")
    private String href;

    @XmlElement(name = "MediaType")
    CpPubFormalNameItem mediaType;

    @XmlElement(name = "MimeType")
    CpPubFormalNameItem mimeType;

    @XmlElement(name = "DataContent")
    private String dataContent;

    @XmlElement(name = "Characteristics")
    private CpPubCharacteristics characteristics;
}
