package jmnet.moka.web.bulk.mapper.idb;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkArticle;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangArticle;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsMMDataVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.mapper.idb
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
    void callUspBulkDdrefDel( BulkDumpTotalVo bulkDumpTotal );

    List<BulkDumpNewsVo> callUspBulkNewstableJoongangSel( BulkJoongangArticle article );
    List<BulkDumpNewsVo> callUspBulkNewstableJoongangJopanSel( BulkJoongangArticle article );
    List<BulkDumpNewsVo> callUspBulkNewstableJoongangMobileSel( BulkJoongangArticle article );

    List<Map<String, String>> callUspBulkReporterJoongangSel( BulkJoongangArticle article );

    List<BulkDumpNewsMMDataVo> callUspBulkNewsMMDataSel( BulkArticle article );
}
