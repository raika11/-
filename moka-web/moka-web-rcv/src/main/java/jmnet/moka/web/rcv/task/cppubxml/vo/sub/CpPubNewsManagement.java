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
 * ClassName : CpPubNewsManagement
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 5:00
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "NewsItem")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubNewsManagement implements Serializable {
    private static final long serialVersionUID = 2902987005378183866L;

    @XmlElement(name = "NewsItemType")
    private CpPubFormalNameItem newsItemType;

    @XmlElement(name = "FirstCreated")
    private String firstCreated;

    @XmlElement(name = "ThisRevisionCreated")
    private String thisRevisionCreated;

    @XmlElement(name = "Status")
    private CpPubFormalNameItem status;
}
