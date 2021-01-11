package jmnet.moka.web.rcv.task.pubxml.vo.sub;

import java.io.Serializable;
import java.util.List;
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
 * ClassName : CpPubNewsLines
 * Created : 2020-11-16 016 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-16 016 오후 5:49
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "NewsLines")
@XmlAccessorType(XmlAccessType.FIELD)
public class PubNewsLines implements Serializable {
    private static final long serialVersionUID = 7185572113414896805L;

    @XmlElement(name = "HeadLine")
    private String headLine;

    @XmlElement(name = "SubHeadLine")
    private String subHeadLine;

    @XmlElement(name = "ByLine")
    private String byLine;

    @XmlElement(name = "ByLineAddress")
    private String byLineAddress;

    @XmlElement(name = "ByLineDept")
    private String byLineDept;

    @XmlElement(name = "Issue")
    private List<String> issue;

    @XmlElement(name = "DateLine")
    private String dateLine;

    @XmlElement(name = "KisaType")
    private String kisaType;

    @XmlElement(name = "OnLineBatch")
    private String onLineBatch;

    @XmlElement(name = "OrgFileNameID")
    private String orgFileNameID;

    @XmlElement(name = "OrgID")
    private String orgID;

    @XmlElement(name = "TitleID")
    private String titleID;

    @XmlElement(name = "CopyrightLine")
    private String copyrightLine;

    @XmlElement(name = "KeywordLine")
    private String keywordLine;
}
