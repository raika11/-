package jmnet.moka.web.bulk.task.bulkdump.env.sub;

import java.io.Serializable;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.env.Sub
 * ClassName : BulkDumpEnvGlobal
 * Created : 2020-12-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-28 028 오후 5:37
 */
@Getter
@Setter
@XmlRootElement(name = "Global")
@XmlAccessorType(XmlAccessType.FIELD)
public class BulkDumpEnvGlobal implements Serializable {
    private static final long serialVersionUID = -7101528553026147185L;

    @XmlAttribute(name = "opEmail")
    private String opEmail;

    @XmlAttribute(name = "DirDump")
    private String dirDump;

    @XmlElementWrapper(name = "Targets")
    @XmlElement(name = "Target")
    private List<BulkDumpEnvTarget> dumpEnvTargets;
}
