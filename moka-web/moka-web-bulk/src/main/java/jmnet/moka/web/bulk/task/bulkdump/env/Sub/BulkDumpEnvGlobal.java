package jmnet.moka.web.bulk.task.bulkdump.env.Sub;

import java.io.Serializable;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.web.bulk.task.bulkdump.env.Sub.BulkDumpEnvTarget;
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

    @XmlElement(name = "opEmail")
    private String opEmail;

    @XmlElementWrapper(name = "Targets")
    @XmlElement(name = "Target")
    private List<BulkDumpEnvTarget> dumpEnvTargets;
}
