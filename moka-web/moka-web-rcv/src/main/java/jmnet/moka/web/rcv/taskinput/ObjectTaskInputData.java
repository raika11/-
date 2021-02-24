package jmnet.moka.web.rcv.taskinput;

import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.util.RcvStringUtil;
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
        log.error(RcvStringUtil.format(s, message));
    }
}
