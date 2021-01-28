package jmnet.moka.web.bulk.task.bulkdump.process.joongang;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkProcessCommon;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkTagUtil;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.process
 * ClassName : BulkDumpClientProcess_BulkJoongang6
 * Created : 2020-12-23 023 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-23 023 오후 5:11
 */
public class BulkJoongangProcess extends BulkProcessCommon<BulkJoongangArticle> {
    public BulkJoongangProcess(BulkDumpEnv bulkDumpEnv) {
        super(bulkDumpEnv);
    }

    @Override
    protected BulkJoongangArticle newArticle(BulkDumpTotalVo bulkDumpTotal) {
        return new BulkJoongangArticle(bulkDumpTotal);
    }

    @Override
    protected void doProcess_Ready(BulkJoongangArticle article, BulkDumpService dumpService) {
        article.setBulkDumpEnvTarget(this.bulkDumpEnv.getBulkDumpEnvTargetByTargetName("JA"));

        article.getMedia2().setData( article.getTargetCode().substring(0, 2) );
        article.processMediaFullName();
    }

    @Override
    protected boolean doProcess_InsertUpdate(BulkJoongangArticle article, BulkDumpTask bulkDumpTask, BulkDumpService dumpService) {
        if( !dumpService.doGetBulkNewstableJoongang( article ) )
            return false;

        article.processContentTag_ab_ds_timeline();

        // 네이버 면판정보 추가관련 변경건 - 지창현 (2016.04.27 ) <-- read while 문 안에 넣어져 있어서 밖으로 이동(Sean)
        article.processNaverMyunPan();

        // 2019 동적차트 제거하고 이미지만 추출하여 삽입
        article.processContentTag_ab_dynamic_chart();

        // 2020.03.20 포토 슬라이드 개별 이미지로 추출
        article.processContentTag_tag_photoslide();

        // 2020.03.20 포토 fix 개별 이미지로 추출
        article.processContentTag_ab_photofix();

        //본문 태그 처리되기 전 이미지 정보 수집 2019-01-02
        List<Map<String,String>> images = article.processContent_getImages();

        article.getMedia3().setData( article.getMedia2().toString() + article.getMedia1().toString());

        // 태그 벗겨내기 - 제목
        article.processTitle_clearTag();

        // HTML 버전도 치환되었던것들 되돌리기 위해서(<br> 태그 \n 개행으로 변환처리포함)
        article.processContent_restoreSpecialHtmlTagForContent();

        article.processContent_etcLevel1();

        // 인물정보 제거
        article.processContentTag_ab_people();

        article.processContent_etcLevel2();

        // `12.10.13 이승인 : ms 용은 xxx 의 블로그가 없어야 하므로 추가
        article.processContent_contentHtmlMs();

        article.processReporter();

        // 벌크용 본문내용으로 변집하지 않은 본문
        article.processContent_contentHtmlEx4();

        // region 2018-11-01 quiz 변환 by ethan
        article.processContentTag_quiz_question_screen_open();

        article.processContentTag_tag_interview();

        //아티클개선 관련기사 태그제거(공통) by sean 2016-09-02 - http://pms.joins.com/task/view_task.asp?tid=13408  /////////////////////////////////////////////////
        //관련기사 <div class="ab_related_article">.....<div> 제거
        article.processContentTag_ab_related_article();

        // 벌크이미지 사용 안할 경우 본문 이미지묶음 삭제
        // 2016-07-07 본문 이미지 묶음 div 제거
        article.processImageBulkFlag();

        // 싸이월드 전용변수(m_content_html_cyworld) - 정보구성
        article.processContentCyworld();

        // 네이트 전용변수(m_content_html_nate) - 정보구성
        article.processContentNate();

        //카카오다음 전용변수(m_content_html_ig_daum)
        Map<String, String> daumVideoMap = new HashMap<>();
        Map<String, String> daumVideoKakaoTvMap = new HashMap<>();
        Map<String, String> daumPhotoBundleMap = new HashMap<>();
        Map<String, String> daumImageMap = new HashMap<>();
        article.processContentDaumBefore(daumVideoMap, daumVideoKakaoTvMap, daumPhotoBundleMap, daumImageMap);

        String tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(article.getContentHtml().toString(), "class=\"ab_photo photo_center", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px;\"", 50 );
        tmpContentHtml = tmpContentHtml.replaceAll("(?i)<(\\s)*iframe(\\s)*class(\\s)*=(\\s)*\"ab_map\".*?<(\\s)*/(\\s)*iframe(\\s)*>", "");
        article.getContentHtml().setData(tmpContentHtml);

        article.processContentDaumAfter(daumVideoMap, daumVideoKakaoTvMap, daumPhotoBundleMap, daumImageMap);

        // zum 전용변수(m_content_html_zum) - 정보구성
        article.processContentZum();

        // 네이버 제공용 xml 2014.02.10
        article.processContentNaverXml( article.getContentHtml().toString() );

        article.getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule(article.getContentHtml().toString(), "<div class=\"tag_vod\"", "</div>"));  //동영상 제외
        article.getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule(article.getContentHtml().toString(), "<div class=\"tag_audio\"", "</div>")); //오디오 제외
        article.getContentHtml().setData(BulkTagUtil.outLinkBulkClearingTagEx(article.getContentHtml().toString()));
        article.getContentText().setData(BulkTagUtil.standardBulkClearingTag(article.getContentHtml().toString()));

        // 본문에 사용된 이미지중 1개라도 벌크서비스 안함이 있으면 html 형 본문도 태그제거
        if( article.getImageBulkFlag().equals("N") )
            article.getContentHtml().setData(article.getContentText().toString());

        if( article.getContentType().toString().equals("P"))
            article.getContentType().setData("PHN0");
        else
            article.getContentType().setData("AKR0");

        // 2019.01.04 이미지 벌크 정보 본문내에서 가져오는 방식으로 변경
        // 본문내용에서는 해당 이미지의 bulkYn 여부를 알수 없어 DB 조회 내용에서 확인
        if( images.size() > 0 )
            article.processContent_ImageBulkYn(images);

        // #region 우얄라 & 브라이트코브 동영상 처리
        if( article.getTargetCode().equals("SOY") && article.isOvpArticle()) {
            article.processContent_Ovp( bulkDumpTask.getTaskManager() );
        }

        article.processContent_JHotClick();

        article.processContent_CopyRight();

        return true;
    }

    @Override
    protected boolean doProcess_Delete(BulkJoongangArticle article, BulkDumpTask bulkDumpTask, BulkDumpService dumpService) {
        article.getMedia1().setData( article.getTargetCode().substring(2, 3));
        article.getMedia3().setData( article.getMedia2().toString() + article.getMedia1().toString() );

        article.getContCode1().setData("000");
        article.getContCode2().setData("000");
        article.getContCode3().setData("000");

        return true;
    }
}
