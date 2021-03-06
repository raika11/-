package jmnet.moka.web.bulk.task.bulkdump.process.sunday;

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
    protected BulkSundayArticle newArticle(TotalVo<BulkDumpTotalVo> totalVo) {
        return new BulkSundayArticle(totalVo);
    }

    @Override
    protected void doProcess_Ready(BulkSundayArticle article) {
        article.setBulkDumpEnvTarget(this.bulkDumpEnv.getBulkDumpEnvTargetByTargetName("SD"));

        article.getMedia1().setData(article.getSourceCode().substring(2, 3));
        article.getMedia2().setData(article.getSourceCode().substring(0, 2));
        article.getMedia3().setData(article.getSourceCode());
    }

    @Override
    protected BulkDumpResult doProcess_InsertUpdate(TotalVo<BulkDumpTotalVo> totalVo, BulkSundayArticle article, BulkDumpTask bulkDumpTask, BulkDumpService dumpService) {
        if( !dumpService.doGetBulkNewstableSunday( article ) )
            return BulkDumpResult.SKIP_DATABASE;

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

        //카카오다음 전용변수(m_content_html_ig_daum)
        article.processContentDaum();

        // 네이버 제공용 xml 2014.02.10
        article.processContentNaverXml( article.getContentHtml().toString() );

        if( article.getBulkDumpNewsImageList().size() > 0)
            article.processContent_ImageBulkYn();

        article.processContent_JHotClick(7);

        return BulkDumpResult.SUCCESS;
    }

    @Override
    protected BulkDumpResult doProcess_Delete( BulkSundayArticle article, BulkDumpService dumpService) {
        return BulkDumpResult.SUCCESS;
    }
}
