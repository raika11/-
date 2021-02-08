package jmnet.moka.web.bulk.task.bulkdump.process.joongang;

import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkProcessCommon;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.joongang
 * ClassName : BulkJoongangProcessEx
 * Created : 2021-01-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-27 027 오후 2:03
 */
public class BulkJoongangProcessEx extends BulkProcessCommon<BulkJoongangArticleEx> {
    public BulkJoongangProcessEx(BulkDumpEnv bulkDumpEnv) {
        super(bulkDumpEnv);
    }

    @Override
    protected BulkJoongangArticleEx newArticle(TotalVo<BulkDumpTotalVo> totalVo) {
        return new BulkJoongangArticleEx(totalVo);
    }

    @Override
    protected void doProcess_Ready(BulkJoongangArticleEx article, BulkDumpService dumpService) {
        article.setBulkDumpEnvTarget(this.bulkDumpEnv.getBulkDumpEnvTargetByTargetName("JA"));
        article.getMedia2().setData("SO");
        article.processMediaFullName();
    }

    @Override
    protected boolean doProcess_InsertUpdate(BulkJoongangArticleEx article, BulkDumpTask bulkDumpTask, BulkDumpService dumpService) {
        if( !dumpService.doGetBulkNewstableJoongangEx( article ) )
            return false;

        // SP(sp_load_joongang_articles)에서 벌크 플래그와 상관 없이 우선 MMData 로 모두 입력
        if ( article.getImageBulkFlag().equals("Y") || article.getTargetCode().startsWith("SOM") ) {
            article.processContent_ImageBlock();
        }

        return true;
    }

    @Override
    protected boolean doProcess_Delete(BulkJoongangArticleEx article, BulkDumpTask bulkDumpTask, BulkDumpService dumpService) {
        article.getMedia1().setData( article.getTargetCode().substring(2, 3));
        article.getMedia3().setData( article.getMedia2().toString() + article.getMedia1().toString() );

        article.getContCode1().setData("000");
        article.getContCode2().setData("000");
        article.getContCode3().setData("000");

        dumpService.doGetBulkNewstableJoongangEx( article );

        return true;
    }
}
