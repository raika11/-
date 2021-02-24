package jmnet.moka.web.bulk.taskinput;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.bulk.common.taskinput.TaskInputData;
import jmnet.moka.web.bulk.util.BulkStringUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.taskinput
 * ClassName : ObjectTaskInputData
 * Created : 2021-02-24 024 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-24 024 오후 1:21
 */
@Getter
@Slf4j
public class ObjectTaskInputData<T> extends TaskInputData {
    final T inputData;

    public ObjectTaskInputData(T inputData) {
        this.inputData = inputData;
    }

    public void logError(String s, Object... message) {
        log.error(BulkStringUtil.format(s, message));
    }
}