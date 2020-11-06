package jmnet.moka.web.rcv.taskinput;

import java.io.File;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.common.vo.TotalVo;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.input
 * ClassName : FileTaskInputData
 * Created : 2020-10-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-29 029 오전 9:49
 */
@Slf4j
@Getter
@Setter
public class FileTaskInputData<P, C> extends TaskInputData {
    private final File file;
    private P totalData;
    private final FileTaskInput<P, C> taskInput;

    public FileTaskInputData(File file, C data, FileTaskInput<P, C> taskInput, Class<P> parentObjectType, Class<C> objectType) {
        this.file = file;
        try {
            this.totalData = parentObjectType.getDeclaredConstructor( objectType ).newInstance(data);
        } catch (Exception e) {
            // no
        }
        this.taskInput = taskInput;
    }

    @SuppressWarnings("unchecked")
    @Override
    public void logError(String s, Object... message) {
        if( this.totalData == null )
            log.error(s, message);
        else{
            TotalVo<C> totalVo = (TotalVo<C>) this.totalData;
            totalVo.logError( s, message );
        }
    }
}
