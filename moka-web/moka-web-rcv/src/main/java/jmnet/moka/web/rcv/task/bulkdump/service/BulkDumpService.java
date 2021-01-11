package jmnet.moka.web.rcv.task.bulkdump.service;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.task.bulkdump.process.joongang.BulkJoongangArticle;
import jmnet.moka.web.rcv.task.bulkdump.vo.BulkDumpNewsVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.bulkdump.service
 * ClassName : BulkDumpService
 * Created : 2020-12-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-17 017 오후 6:10
 */
public interface BulkDumpService  {
    List<Map<String, Object>> getUspBulkDdrefListSel(int topCount, int currentSeqNo);

    boolean doGetBulkNewstableJoongang( BulkJoongangArticle article );
}
