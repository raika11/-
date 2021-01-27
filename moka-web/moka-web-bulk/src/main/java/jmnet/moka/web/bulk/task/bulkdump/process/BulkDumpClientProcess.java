package jmnet.moka.web.bulk.task.bulkdump.process;

import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangProcess;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.process
 * ClassName : BulkDumpClientProcess
 * Created : 2020-12-23 023 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-23 023 오후 4:50
 */

@Slf4j
public class BulkDumpClientProcess {
    public static void doProcess(BulkDumpTotalVo bulkDumpTotal, BulkDumpTask bulkDumpTask) {
        final BulkDumpService bulkDumpService = bulkDumpTask.getTaskManager().getBulkDumpService();
        final BulkDumpEnv bulkDumpEnv = bulkDumpTask.getBulkDumpEnv();

        switch (bulkDumpTotal.getTargetCode()) {
            case "SOA":
            case "SOE":
            case "SOF":
            case "SOG":
            case "SOI":
            case "SOC":
            case "SOT":
            case "SOY":
                (new BulkJoongangProcess(bulkDumpEnv)).doProcess( bulkDumpTotal, bulkDumpTask, bulkDumpService);
                break;
            default:
                log.error("Not Defined DumpClientProcess TargetCode {}", bulkDumpTotal.getTargetCode());
                break;
        }
    }
}
