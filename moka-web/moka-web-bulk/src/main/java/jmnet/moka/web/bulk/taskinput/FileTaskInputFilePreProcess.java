package jmnet.moka.web.bulk.taskinput;

import java.io.File;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.taskinput
 * ClassName : FileTaskInputFilePreProcess
 * Created : 2020-11-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-17 017 오전 9:32
 */
@SuppressWarnings("SameReturnValue")
public interface FileTaskInputFilePreProcess {
    default boolean preProcess(File file) {
        return true;
    }
}
