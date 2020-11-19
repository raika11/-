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
 * ClassName : CpPubNewsIdentifier
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 4:56
 */
@Data
@XmlRootElement(name = "NewsIdentifier")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubNewsIdentifier implements Serializable {
    private static final long serialVersionUID = -2823393948475441353L;

    @XmlElement(name = "ProviderID")
    private String providerId;

    @XmlElement(name = "DateId")
    private String dateId;

    @XmlElement(name = "NewsItemId")
    private String newsItemId;

    @XmlElement(name = "RevisionId")
    private String revisionId;

    @XmlElement(name = "PublicIdentifier")
    private String publicIdentifier;
}
