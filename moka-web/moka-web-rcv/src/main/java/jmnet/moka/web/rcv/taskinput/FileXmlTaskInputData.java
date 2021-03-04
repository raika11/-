package jmnet.moka.web.rcv.taskinput;

import java.io.File;
import java.nio.file.Path;
import java.util.Date;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.common.vo.TotalVo;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.util.RcvFileUtil;
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
public class FileXmlTaskInputData<P, C> extends TaskInputData {
    private final File file;
    private P totalData;
    private final FileXmlTaskInput<P, C> taskInput;

    public FileXmlTaskInputData(File file, C data, FileXmlTaskInput<P, C> taskInput, Class<P> parentObjectType, Class<C> objectType) {
        this.file = file;
        try {
            this.totalData = parentObjectType
                    .getDeclaredConstructor(objectType)
                    .newInstance(data);
        } catch (Exception ignore) {
            log.trace("FileXmlTaskInputData :: FileXmlTaskInputData Exception" );
        }
        this.taskInput = taskInput;
    }

    @SuppressWarnings("unchecked")
    @Override
    public void logError(String s, Object... message) {
        if (this.totalData == null) {
            log.error(s, message);
        } else {
            TotalVo<C> totalVo = (TotalVo<C>) this.totalData;
            totalVo.logError(s, message);
        }
    }

    public void doAfterProcess() {
        String targetDir = isSuccess() ? getTaskInput().getDirSuccess() : getTaskInput().getDirFailed();

        try {
            RcvFileUtil.moveFileToDateDir(getFile(), targetDir, McpDate.dateStr(new Date(), "yyyyMM/dd"));
        } catch (RcvException e) {
            log.error(e.getMessage());
            e.printStackTrace();
        }
    }

    public String getFileName() {
        //noinspection ConstantConditions,LoopStatementThatDoesntLoop
        do {
            if( getFile() == null )
                break;
            Path path = getFile().toPath();
            Path fileName = path.getFileName();
            if( fileName == null )
                break;

            return fileName.toString();

        }while( false );

        return "";
    }
}
