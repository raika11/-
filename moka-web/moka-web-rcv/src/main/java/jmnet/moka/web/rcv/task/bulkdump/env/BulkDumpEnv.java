package jmnet.moka.web.rcv.task.bulkdump.env;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import jmnet.moka.web.rcv.task.bulkdump.env.Sub.BulkDumpEnvGlobal;
import jmnet.moka.web.rcv.task.bulkdump.env.Sub.BulkDumpEnvTarget;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.bulkdump.vo
 * ClassName : BulkDumpEnv
 * Created : 2020-12-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-28 028 오후 5:14
 */

@Getter
@Setter
@XmlRootElement(name = "BulkDumpEnv")
@XmlAccessorType(XmlAccessType.FIELD)
public class BulkDumpEnv extends BasicVo {
    private static final long serialVersionUID = 3044304240513648801L;

    @XmlElement(name = "Global")
    private BulkDumpEnvGlobal bulkDumpEnvGlobal;

    public BulkDumpEnvTarget getBulkDumpEnvTargetByTargetName(String targetName) {
        if( this.bulkDumpEnvGlobal == null )
            return null;
        for( BulkDumpEnvTarget bulkDumpEnvTarget : bulkDumpEnvGlobal.getDumpEnvTargets()) {
            if( bulkDumpEnvTarget.getTargetName().equals(targetName) )
                return bulkDumpEnvTarget;
        }
        return null;
    }

    public void init() {
        if( this.bulkDumpEnvGlobal == null )
            return;
        for( BulkDumpEnvTarget bulkDumpEnvTarget : bulkDumpEnvGlobal.getDumpEnvTargets()) {
            bulkDumpEnvTarget.init();
        }
    }
}
