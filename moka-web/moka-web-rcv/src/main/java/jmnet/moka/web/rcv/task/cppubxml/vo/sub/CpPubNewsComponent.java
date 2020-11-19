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
 * ClassName : CpPubNewsComponent
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 5:47
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "NewsComponent")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubNewsComponent implements Serializable {
    private static final long serialVersionUID = 4509593451780542785L;

    @XmlElement(name = "NewsLines")
    private CpPubNewsLines newsLines;

    @XmlElement(name = "DescriptiveMetadata")
    private CpPubDescriptiveMetadata descriptiveMetadata;

    @XmlElement(name = "ContentItem")
    private CpPubContentItem contentItem;
}
