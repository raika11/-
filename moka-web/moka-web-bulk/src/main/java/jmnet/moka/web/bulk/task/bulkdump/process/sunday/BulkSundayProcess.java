package jmnet.moka.web.bulk.task.bulkdump.process.sunday;

import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkProcessCommon;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangArticle;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkTagUtil;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.sunday
 * ClassName : BulkSundayProcess
 * Created : 2021-01-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-27 027 오후 5:40
 */
public class BulkSundayProcess extends BulkProcessCommon<BulkSundayArticle> {
    public BulkSundayProcess(BulkDumpEnv bulkDumpEnv) {
        super(bulkDumpEnv);
    }

    @Override
    protected BulkSundayArticle newArticle(BulkDumpTotalVo bulkDumpTotal) {
        return new BulkSundayArticle(bulkDumpTotal);
    }

    @Override
    protected void doProcess_Ready(BulkSundayArticle article, BulkDumpService dumpService) {
        article.setBulkDumpEnvTarget(this.bulkDumpEnv.getBulkDumpEnvTargetByTargetName("SD"));

        article.getMedia1().setData(article.getSourceCode().substring(2, 3));
        article.getMedia2().setData(article.getSourceCode().substring(0, 2));
        article.getMedia3().setData(article.getSourceCode());
    }

    @Override
    protected boolean doProcess_InsertUpdate(BulkSundayArticle article, BulkDumpTask bulkDumpTask, BulkDumpService dumpService) {
        if( !dumpService.doGetBulkNewstableSunday( article ) )
            return false;

        // HTML 버전도 치환되었던것들 되돌리기 위해서(<br> 태그 \n 개행으로 변환처리포함)
        article.processContent_clearTag();

        article.processContentTag_tag_interview();

        //아티클개선 관련기사 태그제거(공통) by sean 2016-09-02 - http://pms.joins.com/task/view_task.asp?tid=13408  /////////////////////////////////////////////////
        //관련기사 <div class="ab_related_article">.....<div> 제거
        article.processContentTag_ab_related_article();

        //2019-07-23 SEO 관련 h2 태그 삭제
        article.getContentHtml().replace("<h2>", "");
        article.getContentHtml().replace("</h2>", "");

        // 벌크이미지 사용 안할 경우 본문 이미지묶음 삭제
        article.processImageBulkFlag();

        //카카오다음 전용변수(m_content_html_ig_daum) 2019.09.25
        //article.processContentDaum();



        return true;
    }

    @Override
    protected boolean doProcess_Delete(BulkSundayArticle article, BulkDumpTask bulkDumpTask, BulkDumpService dumpService) {
        return true;
    }
}
