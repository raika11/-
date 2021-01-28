package jmnet.moka.web.bulk.task.bulkdump.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.web.bulk.mapper.idb.BulkDumpIdbMapper;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangArticle;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangArticleEx;
import jmnet.moka.web.bulk.task.bulkdump.process.sunday.BulkSundayArticle;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsMMDataVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.service
 * ClassName : BulkDumpServiceImpl
 * Created : 2020-12-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-17 017 오후 6:11
 */

@Service
@Slf4j
public class BulkDumpServiceImpl implements BulkDumpService {
    final private BulkDumpIdbMapper bulkDumpIdbMapper;

    public BulkDumpServiceImpl(BulkDumpIdbMapper bulkDumpIdbMapper) {
        this.bulkDumpIdbMapper = bulkDumpIdbMapper;
    }

    @Override
    public List<Map<String, Object>> getUspBulkDdrefListSel(int topCount, int currentSeqNo) {
        Map<String, Integer> map = new HashMap<>();
        map.put("topCount", topCount);
        map.put("currentSeqNo", currentSeqNo );
        return this.bulkDumpIdbMapper.callUspBulkDdrefListSel(map);
    }

    @Override
    public void delUspBulkDdref(BulkDumpTotalVo bulkDumpTotal) {
        this.bulkDumpIdbMapper.callUspBulkDdrefDel(bulkDumpTotal);
    }

    @Override
    public boolean doGetBulkNewstableJoongang( BulkJoongangArticle article ) {
        List<BulkDumpNewsVo> dumpNewses;
        if (article.getTargetCode().startsWith("SS"))
            dumpNewses = this.bulkDumpIdbMapper.callUspBulkNewstableJoongangJopanSel(article);
        else if (article.getTargetCode().charAt(2) == 'M')
            dumpNewses = this.bulkDumpIdbMapper.callUspBulkNewstableJoongangMobileSel(article);
        else
            dumpNewses = this.bulkDumpIdbMapper.callUspBulkNewstableJoongangSel(article);

        final int dumpNewsesLength = dumpNewses.size();
        if( dumpNewsesLength == 0 )
            return false;

        final BulkDumpNewsVo newsVo = dumpNewses.get( dumpNewsesLength - 1);
        article.processBulkDumpNewsVo( newsVo, this.bulkDumpIdbMapper.callUspBulkNewsMMDataSel(article) );

        article.setBulkYn("YYN");

        //////////////////////////////////////////////////기자 정보 별도 조회 http://pms.joins.com/task/view_task.asp?tid=19225
        article.processBulkReporters( this.bulkDumpIdbMapper.callUspBulkReporterJoongangSel(article) );

        return true;
    }

    @Override
    public boolean doGetBulkNewstableJoongangEx(BulkJoongangArticleEx article) {
        List<BulkDumpNewsVo> dumpNewses = this.bulkDumpIdbMapper.callUspBulkNewstableJoongangExSel(article);

        final int dumpNewsesLength = dumpNewses.size();
        if( dumpNewsesLength == 0 )
            return false;

        List<BulkDumpNewsMMDataVo> bulkDumpNewsMMDataList = null;
        if( !article.getIud().toString().equals("D"))
            bulkDumpNewsMMDataList = this.bulkDumpIdbMapper.callUspBulkNewsMMDataSel(article);

        final BulkDumpNewsVo newsVo = dumpNewses.get( dumpNewsesLength - 1);
        article.processBulkDumpNewsVo( newsVo, bulkDumpNewsMMDataList );

        return true;
    }

    @Override
    public boolean doGetBulkNewstableSunday(BulkSundayArticle article) {
        List<BulkDumpNewsVo> dumpNewses = this.bulkDumpIdbMapper.callUspBulkNewstableSundaySel(article);

        final int dumpNewsesLength = dumpNewses.size();
        if( dumpNewsesLength == 0 )
            return false;

        final BulkDumpNewsVo newsVo = dumpNewses.get( dumpNewsesLength - 1);
        article.processBulkDumpNewsVo( newsVo, this.bulkDumpIdbMapper.callUspBulkNewsMMDataSel(article) );

        return true;
    }
}
