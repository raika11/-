package jmnet.moka.web.bulk.task.bulkdump.env.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.config.FtpConfig;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.util.BulkFileUtil;
import jmnet.moka.web.bulk.util.BulkStringUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.env.Sub
 * ClassName : BulkDumpEnvCP
 * Created : 2021-01-21 021 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-21 021 오후 4:54
 */
@Getter
@Setter
@XmlRootElement(name = "CP")
@XmlAccessorType(XmlAccessType.FIELD)
public class BulkDumpEnvCP implements Serializable {
    private static final long serialVersionUID = 8904214866750684898L;

    @XmlAttribute(name = "Name")
    private String name;

    @XmlAttribute(name = "Comment")
    private String comment;

    @XmlAttribute(name = "Dir")
    private String dir;

    @XmlAttribute(name = "Content")
    private String content;

    @XmlAttribute(name = "FileExt")
    private String fileExt;

    @XmlAttribute(name = "DnVideo")
    private String dnVideo;

    @XmlAttribute(name = "Type")
    private String type;

    @XmlAttribute(name = "SendSiteCode")
    private String sendSiteCode;

    @XmlElement(name = "Format")
    private String format;

    @XmlElement(name = "FormatDelete")
    private String formatDelete;

    @XmlElement(name = "EncodeType")
    private String encodeType;

    @XmlElement(name = "FtpConfig")
    private FtpConfig ftpConfig;

    public void init()
            throws BulkException {
        if (McpString.isNullOrEmpty(this.dir)) {
            throw new BulkException(BulkStringUtil.format("[{}]-{} Input Path is Blank", this.name, this.comment ) );
        }
        if (!BulkFileUtil.createDirectories(this.dir)) {
            throw new BulkException(BulkStringUtil.format("[{}]-{} Input Path can't create", this.name, this.comment ) );
        }

        if (!McpString.isNullOrEmpty(format)) {
            format = format
                    .replace("{_TAB_}", "\t")
                    .replace("{_CRLF_}", "\r\n")
                    .replace("{_CDATA_S_}", "<![CDATA[")
                    .replace("{_CDATA_E_}", "]]>");

        }

        if (!McpString.isNullOrEmpty(formatDelete)) {
            formatDelete = formatDelete
                    .replace("{_TAB_}", "\t")
                    .replace("{_CRLF_}", "\r\n")
                    .replace("{_CDATA_S_}", "<![CDATA[")
                    .replace("{_CDATA_E_}", "]]>");
        }

        if( this.sendSiteCode == null)
            this.sendSiteCode = "";
    }
}
