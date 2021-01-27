package jmnet.moka.web.bulk.task.bulkdump.env;

import java.io.File;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.bulk.common.object.JaxbObjectManager;
import jmnet.moka.web.bulk.common.vo.BasicVo;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvCP;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvGlobal;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvTarget;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo
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
@Slf4j
public class BulkDumpEnv extends BasicVo {
    private static final long serialVersionUID = 3044304240513648801L;

    @XmlElement(name = "Global")
    private BulkDumpEnvGlobal bulkDumpEnvGlobal;

    @XmlElementWrapper(name = "CpList")
    @XmlElement(name = "Cp")
    private List<BulkDumpEnvCP> dumpEnvCPs;

    public static BulkDumpEnv loadFromFile(String bulkDumpEnvFile)
            throws BulkException {
        BulkDumpEnv bulkDumpEnv;
        try {
            final File file = new File(ResourceMapper.getAbsolutePath(bulkDumpEnvFile));
            if (!file.exists()) {
                throw new BulkException("bulkDumpEnvFile 파일을 찾을 수 없습니다.");
            }
            bulkDumpEnv = (BulkDumpEnv) JaxbObjectManager.getBasicVoFromXml(file, BulkDumpEnv.class);
            if( bulkDumpEnv == null )
                throw new BulkException("bulkDumpEnvFile 파일을 로드하는 중에 에러가 발생하였습니다. null");

            bulkDumpEnv.init();
            return bulkDumpEnv;
        } catch (Exception e) {
            log.error( "bulkDumpEnvFile 파일을 로드하는 중에 에러가 발생 {}", e.getMessage());
            e.printStackTrace();
            throw new BulkException("bulkDumpEnvFile 파일을 로드하는 중에 에러가 발생하였습니다.");
        }
    }

    public BulkDumpEnvTarget getBulkDumpEnvTargetByTargetName(String targetName) {
        if( this.bulkDumpEnvGlobal == null )
            return null;
        for( BulkDumpEnvTarget bulkDumpEnvTarget : bulkDumpEnvGlobal.getDumpEnvTargets()) {
            if( bulkDumpEnvTarget.getTargetName().equals(targetName) )
                return bulkDumpEnvTarget;
        }
        return null;
    }

    public void init()
            throws BulkException {
        if( this.bulkDumpEnvGlobal != null ) {
            for (BulkDumpEnvTarget bulkDumpEnvTarget : bulkDumpEnvGlobal.getDumpEnvTargets()) {
                bulkDumpEnvTarget.init();
            }
        }

        if( this.dumpEnvCPs != null ) {
            for( BulkDumpEnvCP cp : this.dumpEnvCPs ) {
                cp.init();
            }
        }
    }
}
