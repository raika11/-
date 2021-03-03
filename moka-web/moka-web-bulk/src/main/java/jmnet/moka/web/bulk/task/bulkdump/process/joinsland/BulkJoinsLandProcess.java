package jmnet.moka.web.bulk.task.bulkdump.process.joinsland;

import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkProcessCommon;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkDumpResult;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.joinsland
 * ClassName : JoinsLandProcess
 * Created : 2021-02-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-05 005 오후 9:19
 */
public class BulkJoinsLandProcess extends BulkProcessCommon<BulkJoinsLandArticle> {
    public BulkJoinsLandProcess(BulkDumpEnv bulkDumpEnv) {
        super(bulkDumpEnv);
    }

    @Override
    protected BulkJoinsLandArticle newArticle(TotalVo<BulkDumpTotalVo> totalVo) {
        return new BulkJoinsLandArticle(totalVo);
    }

    @Override
    protected void doProcess_Ready(BulkJoinsLandArticle article) {
        article.setBulkDumpEnvTarget(this.bulkDumpEnv.getBulkDumpEnvTargetByTargetName("JL"));

        article.getMedia1().setData(article.getSourceCode().substring(2, 3));
        article.getMedia2().setData(article.getSourceCode().substring(0, 2));
        article.getMedia3().setData(article.getSourceCode());

        article.processMediaFullName();
    }

    @Override
    protected BulkDumpResult doProcess_InsertUpdate(TotalVo<BulkDumpTotalVo> totalVo, BulkJoinsLandArticle article, BulkDumpTask bulkDumpTask, BulkDumpService dumpService) {
        if( !dumpService.doGetBulkNewstableJoinsLand( article ) )
            return BulkDumpResult.SKIP_DATABASE;

        article.getContCode2().setData("000");
        article.getContCode3().setData("000");

        // HTML 버전도 치환되었던것들 되돌리기 위해서(<br> 태그 \n 개행으로 변환처리포함)
        article.processContent_clearTag();

        article.processContentDaum();

        if( article.getBulkDumpNewsImageList().size() > 0)
            article.processContent_ImageBulkYn();

        article.processContent_JHotClick(10);

        return BulkDumpResult.SUCCESS;
    }

    @Override
    protected BulkDumpResult doProcess_Delete( BulkJoinsLandArticle article, BulkDumpService dumpService) {
        article.getContCode1().setData("000");
        article.getContCode2().setData("000");
        article.getContCode3().setData("000");

        return BulkDumpResult.SUCCESS;
    }
}
