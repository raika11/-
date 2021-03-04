package jmnet.moka.web.bulk.task.bulkdump.service;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvTarget;
import jmnet.moka.web.bulk.task.bulkdump.process.joinsland.BulkJoinsLandArticle;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangArticle;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangArticleEx;
import jmnet.moka.web.bulk.task.bulkdump.process.sunday.BulkSundayArticle;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkDumpEnvCopyright;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.service
 * ClassName : BulkDumpService
 * Created : 2020-12-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-17 017 오후 6:10
 */
public interface BulkDumpService  {
    List<Map<String, Object>> getUspBulkDdrefListSel(int topCount, int currentSeqNo);
    void delUspBulkDdref( BulkDumpTotalVo bulkDumpTotal );

    void insertBulkLog(TotalVo<BulkDumpTotalVo> totalVo, int status, String message, boolean isError);
    @SuppressWarnings("unused")
    void insertBulkLog(TotalVo<BulkDumpTotalVo> totalVo, int status, String message);

    void insertBulkPortalLog( TotalVo<BulkDumpTotalVo> totalVo );

    BulkDumpEnvCopyright getBulkCopyright( BulkDumpEnvTarget bulkDumpEnvTarget );

    boolean doGetBulkNewstableJoongang( BulkJoongangArticle article );
    boolean doGetBulkNewstableJoongangEx( BulkJoongangArticleEx article );
    boolean doGetBulkNewstableSunday( BulkSundayArticle article );
    boolean doGetBulkNewstableJoinsLand( BulkJoinsLandArticle article );
}
