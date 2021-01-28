package jmnet.moka.web.bulk.config;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.config
 * ClassName : FtpConfig
 * Created : 2020-11-04 004 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-04 004 오후 5:50
 */

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "ftp")
@XmlRootElement(name = "ftpConfig")
@XmlAccessorType(XmlAccessType.FIELD)
public class FtpConfig implements Serializable {
    private static final long serialVersionUID = 7493819842676956169L;

    @XmlAttribute(name = "ip")
    private String ip;

    @XmlAttribute(name = "user")
    private String user;

    @XmlAttribute(name = "password")
    private String password;

    @XmlAttribute(name = "rootDir")
    private String rootDir;

    @XmlAttribute(name = "passive")
    private int passive;

    @XmlAttribute(name = "port")
    private int port;
}
