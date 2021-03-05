package jmnet.moka.web.rcv.taskinput;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.util.RcvStringUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

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
@Slf4j
public class DBTaskInputData extends TaskInputData {
    final List<Map<String, Object>> inputData;

    public DBTaskInputData(List<Map<String, Object>> inputData) {
        this.inputData = inputData;
    }

    static public DBTaskInputData newDBTaskInputData(List<Map<String, Object>> inputData) {
        //noinspection ConstantConditions,LoopStatementThatDoesntLoop
        do {
            if( inputData == null )
                break;
            if( inputData.size() == 0 )
                break;

            return new DBTaskInputData(inputData);
        }while( false );

        return null;
    }

    @Override
    public void logError(String s, Object... message) {
        log.error(RcvStringUtil.format(s, message));
    }
}
