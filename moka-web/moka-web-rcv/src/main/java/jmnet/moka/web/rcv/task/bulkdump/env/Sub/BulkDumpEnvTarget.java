package jmnet.moka.web.rcv.task.bulkdump.env.Sub;

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
 * Package : jmnet.moka.web.rcv.task.bulkdump.env.Sub
 * ClassName : BulkDumpEnvTarget
 * Created : 2020-12-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-28 028 오후 5:44
 */
@Getter
@Setter
@XmlRootElement(name = "Target")
@XmlAccessorType(XmlAccessType.FIELD)
public class BulkDumpEnvTarget implements Serializable {
    private static final long serialVersionUID = -2841853322208992673L;

    @XmlElement(name = "TargetName")
    private String targetName;

    @XmlElement(name = "CrTxt")
    private String crTxt;

    @XmlElement(name = "CrHtml")
    private String crHtml;

    @XmlElement(name = "CrHtmlNaver")
    private String crHtmlNaver;

    public void init() {
        crTxt = initMember(crTxt);
        crHtml = initMember(crTxt);
        crHtmlNaver = initMember(crHtmlNaver);
    }

    private String initMember(String text) {
        if (text == null) {
            return "";
        }
        return text
                .replace("{_TAB_}", "\t")
                .replace("{_CRLF_}", "\r\n");
    }
}
