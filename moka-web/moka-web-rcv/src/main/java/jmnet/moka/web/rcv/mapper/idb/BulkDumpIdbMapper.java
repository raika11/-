package jmnet.moka.web.rcv.mapper.idb;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.task.bulkdump.process.joongang.BulkJoongangArticle;
import jmnet.moka.web.rcv.task.bulkdump.vo.BulkDumpNewsVo;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.mapper.idb
 * ClassName : BulkDumpIdbMapper
 * Created : 2020-12-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-17 017 오후 6:09
 */
@Repository
@Mapper
public interface BulkDumpIdbMapper {
    List<Map<String, Object>> callUspBulkDdrefListSel(Map<String, Integer> map);

    List<BulkDumpNewsVo> callUspBulkNewstableJoongangSel( BulkJoongangArticle article );
    List<BulkDumpNewsVo> callUspBulkNewstableJoongangJopanSel( BulkJoongangArticle article );
    List<BulkDumpNewsVo> callUspBulkNewstableJoongangMobileSel( BulkJoongangArticle article );

    List<Map<String, String>> callUspBulkReporterJoongangSel( BulkJoongangArticle article );
}
