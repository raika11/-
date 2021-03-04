package jmnet.moka.web.bulk.common.taskinput;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import jmnet.moka.web.bulk.util.BulkFileUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.input.base
 * ClassName : TaskInputData
 * Created : 2020-10-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-29 029 오전 9:48
 */
@Slf4j
@Getter
@Setter
public abstract class TaskInputData {
    private boolean isSuccess = false;
    private List<String> tempFileList = new ArrayList<>();

    @SuppressWarnings("unused")
    public String getTempFileName( String tempDir ) {
        final String tempFileName = BulkFileUtil.getTempFileName(tempDir);
        if( tempFileName != null )
            tempFileList.add(tempFileName);
        return tempFileName;
    }

    public void deleteTempFiles() {
        for( String fileName : this.tempFileList ) {
            try {
                Files.deleteIfExists(Path.of(fileName));
            } catch (IOException ignore) {
                log.trace( " TaskInputData :: deleteTempFiles exception");
            }
        }
        tempFileList.clear();
    }

    public abstract void logError(String s, Object...message);
}
