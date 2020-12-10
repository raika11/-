package jmnet.moka.web.rcv.taskinput;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import lombok.Getter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.taskinput
 * ClassName : DBTaskInputData
 * Created : 2020-12-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-01 001 오후 4:42
 */

@Getter
public class DBTaskInputData extends TaskInputData {
    final List<Map<String, Object>> inputData;

    public DBTaskInputData(List<Map<String, Object>> inputData) {
        this.inputData = inputData;
    }

    @Override
    public void logError(String s, Object... message) {

    }
}
