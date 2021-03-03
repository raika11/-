package jmnet.moka.web.bulk.task.bulkdump.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.mapper.idb.BulkDumpIdbMapper;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvTarget;
import jmnet.moka.web.bulk.task.bulkdump.process.joinsland.BulkJoinsLandArticle;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangArticle;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangArticleEx;
import jmnet.moka.web.bulk.task.bulkdump.process.sunday.BulkSundayArticle;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkDumpEnvCopyright;
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
    public void insertBulkLog(TotalVo<BulkDumpTotalVo> totalVo, int status, String message, boolean isError) {
        if( McpString.isNullOrEmpty(totalVo.getMainData().getContentDiv()) ) {
            if( "JL".equals(totalVo.getMainData().getOrgSourceCode()) )
                totalVo.getMainData().setContentDiv("joinsland");
            else
                totalVo.getMainData().setContentDiv("moka");
        }

        totalVo.getMainData().setDumpStatus( status );
        if( isError )
            totalVo.logError(message);
        else
            totalVo.logInfo(message);
        totalVo.setMsg(totalVo.getInfoMessageList());

        this.bulkDumpIdbMapper.callUspBulkLogInsByDump(totalVo);

        totalVo.setInfoMessageFlush();
    }

    @Override
    @SuppressWarnings("unused")
    public void insertBulkLog(TotalVo<BulkDumpTotalVo> totalVo, int status, String message) {
        insertBulkLog( totalVo, status, message, false);
    }

    @Override
    public void insertBulkPortalLog(TotalVo<BulkDumpTotalVo> totalVo) {
        this.bulkDumpIdbMapper.callUspBulkPortalLogInsByDump(totalVo);
    }

    @Override
    public BulkDumpEnvCopyright getBulkCopyright(BulkDumpEnvTarget bulkDumpEnvTarget) {
        return this.bulkDumpIdbMapper.callUspBulkCopyrightSel(bulkDumpEnvTarget);
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

    @Override
    public boolean doGetBulkNewstableJoinsLand(BulkJoinsLandArticle article) {
        List<BulkDumpNewsVo> dumpNewses = this.bulkDumpIdbMapper.callUspBulkNewstableJoinslandSel(article);

        final int dumpNewsesLength = dumpNewses.size();
        if( dumpNewsesLength == 0 )
            return false;

        final BulkDumpNewsVo newsVo = dumpNewses.get( dumpNewsesLength - 1);
        article.processBulkDumpNewsVo( newsVo, this.bulkDumpIdbMapper.callUspBulkJoinslandNewsMMDataSel(article) );

        return true;
    }
}
