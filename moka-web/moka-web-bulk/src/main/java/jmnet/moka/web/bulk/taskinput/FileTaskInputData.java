package jmnet.moka.web.bulk.taskinput;

import java.io.File;
import java.util.List;
import jmnet.moka.web.bulk.common.taskinput.TaskInputData;
import jmnet.moka.web.bulk.util.BulkStringUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.taskinput
 * ClassName : FileTaskInputData
 * Created : 2021-01-26 026 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-26 026 오후 1:15
 */

@Getter
@Slf4j
public class FileTaskInputData extends TaskInputData {
    final List<File> inputData;
    public FileTaskInputData(List<File> fileList) {
        super();
        this.inputData = fileList;
    }

    @Override
    public void logError(String s, Object... message) {
        log.error(BulkStringUtil.format(s, message));
    }
}
