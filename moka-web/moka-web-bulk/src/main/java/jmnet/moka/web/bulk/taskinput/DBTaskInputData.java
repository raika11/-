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
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.taskinput
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

    private DBTaskInputData(List<Map<String, Object>> inputData) {
        this.inputData = inputData;
    }

    static public DBTaskInputData newDBTaskInputData(List<Map<String, Object>> inputData) {
        //noinspection LoopStatementThatDoesntLoop
        do {
            if( inputData == null )
                break;
            if( inputData.size() == 0 )
                break;

            return new DBTaskInputData(inputData);
        }while( true );

        return null;
    }

    @Override
    public void logError(String s, Object... message) {
        log.error(BulkStringUtil.format(s, message));
    }
}
