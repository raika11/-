package jmnet.moka.web.bulk.task.bulkdump.process.basic;

import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobTotalVo;
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
    public BulkDumpResult doProcess(TotalVo<BulkDumpTotalVo> totalVo, BulkDumpTask bulkDumpTask, BulkDumpService dumpService, BulkDumpJobTotalVo dumpJobTotal) {
        T newArticle = newArticle( totalVo );
        BulkArticle article = (BulkArticle) newArticle;

        doProcess_Ready(newArticle);

        article.setBulkDumpEnvCopyright( dumpService.getBulkCopyright(article.getBulkDumpEnvTarget()));

        BulkDumpResult result = BulkDumpResult.SUCCESS;
        switch (article.getIud().toString()) {
            case "D":
                result = doProcess_Delete( newArticle, dumpService );
                break;
            case "I":
            case "U":
                result = doProcess_InsertUpdate( totalVo, newArticle, bulkDumpTask, dumpService );
        }
        if(result != BulkDumpResult.SUCCESS)
            return result;

        return BulkDumpProcess.doProcess(totalVo, article, getBulkDumpEnv(), bulkDumpTask, dumpJobTotal);
    }

    protected abstract T newArticle( TotalVo<BulkDumpTotalVo> totalVo );
    protected abstract void doProcess_Ready(T article);
    protected abstract BulkDumpResult doProcess_InsertUpdate(TotalVo<BulkDumpTotalVo> totalVo, T article, BulkDumpTask bulkDumpTask, BulkDumpService dumpService);
    @SuppressWarnings("SameReturnValue")
    protected abstract BulkDumpResult doProcess_Delete( T article, BulkDumpService dumpService);
}
