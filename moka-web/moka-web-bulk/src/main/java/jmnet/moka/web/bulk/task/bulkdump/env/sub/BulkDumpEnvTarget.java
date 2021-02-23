package jmnet.moka.web.bulk.task.bulkdump.env.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.env.Sub
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

    @XmlAttribute(name = "TargetName")
    private String targetName;
}
