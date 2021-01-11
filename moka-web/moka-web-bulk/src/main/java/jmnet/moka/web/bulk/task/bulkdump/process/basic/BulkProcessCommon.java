package jmnet.moka.web.bulk.task.bulkdump.process.basic;

import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.process
 * ClassName : BulkDumpClientProcess_Common
 * Created : 2020-12-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-28 028 오전 9:31
 */
public abstract class BulkProcessCommon<T> extends BulkProcess {
    public BulkProcessCommon(BulkDumpEnv bulkDumpEnv) {
        super(bulkDumpEnv);
    }

    @Override
    public void doProcess( BulkDumpTotalVo bulkDumpTotal, BulkDumpService dumpService) {
        T newArticle = newArticle( bulkDumpTotal );
        BulkArticle article = (BulkArticle) newArticle;

        doProcess_Ready(newArticle, dumpService);

        boolean isSuccess = false;
        switch (article.getIud().toString()) {
            case "D":
                isSuccess = doProcess_Delete( newArticle, dumpService );
                break;
            case "I":
            case "U":
                isSuccess = doProcess_InsertUpdate( newArticle, dumpService );
        }
    }

    protected abstract T newArticle( BulkDumpTotalVo bulkDumpTotal );
    protected abstract void doProcess_Ready(T article, BulkDumpService dumpService);
    protected abstract boolean doProcess_InsertUpdate(T article, BulkDumpService dumpService);
    protected abstract boolean doProcess_Delete(T article, BulkDumpService dumpService);
}
