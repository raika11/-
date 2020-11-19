package jmnet.moka.web.rcv.taskinput;

import java.io.File;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.taskinput
 * ClassName : FileTaskInputFilePreProcess
 * Created : 2020-11-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-17 017 오전 9:32
 */
public interface FileTaskInputFilePreProcess {
    boolean preProcess( File file );
}
