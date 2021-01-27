package jmnet.moka.web.bulk.task.bulkdump.process.basic;

import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import lombok.Getter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.basic
 * ClassName : BulkProcessBasic
 * Created : 2020-12-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-29 029 오후 3:44
 */
@Getter
public abstract class BulkProcess {
    protected final BulkDumpEnv bulkDumpEnv;
    public BulkProcess(BulkDumpEnv bulkDumpEnv) {
        this.bulkDumpEnv = bulkDumpEnv;
    }

    public abstract void doProcess(BulkDumpTotalVo bulkDumpTotal, BulkDumpTask bulkDumpTask, BulkDumpService dumpService);
}
