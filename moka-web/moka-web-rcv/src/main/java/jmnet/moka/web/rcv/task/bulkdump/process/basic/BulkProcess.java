package jmnet.moka.web.rcv.task.bulkdump.process.basic;

import jmnet.moka.web.rcv.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.rcv.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.rcv.task.bulkdump.vo.BulkDumpTotalVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.bulkdump.process.basic
 * ClassName : BulkProcessBasic
 * Created : 2020-12-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-29 029 오후 3:44
 */
public abstract class BulkProcess {
    protected final BulkDumpEnv bulkDumpEnv;
    public BulkProcess(BulkDumpEnv bulkDumpEnv) {
        this.bulkDumpEnv = bulkDumpEnv;
    }

    public abstract void doProcess( BulkDumpTotalVo bulkDumpTotal, BulkDumpService dumpService);
}
