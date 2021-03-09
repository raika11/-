package jmnet.moka.web.bulk.task.bulkdump.process.joongang;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.config.MokaBulkConfiguration;
import jmnet.moka.web.bulk.service.SlackMessageService;
import jmnet.moka.web.bulk.task.base.TaskManager;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkArticle;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.MediaFullName;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsMMDataVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkBrightCoveUtil;
import jmnet.moka.web.bulk.util.BulkJsoupUtil;
import jmnet.moka.web.bulk.util.BulkTagUtil;
import jmnet.moka.web.bulk.util.BulkUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.joongang6
 * ClassName : BulkArticleJoongang
 * Created : 2020-12-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-29 029 오후 3:19
 */
@SuppressFBWarnings("VA_FORMAT_STRING_USES_NEWLINE")
@SuppressWarnings("DuplicatedCode")
@Getter
@Setter
@Slf4j
public class BulkJoongangArticle extends BulkArticle {
    private static final long serialVersionUID = 3365048610646802498L;

    public BulkJoongangArticle(TotalVo<BulkDumpTotalVo> totalVo) {
        super(totalVo);
    }

    @SuppressWarnings("DuplicatedCode")
    @Override
    public void processBulkDumpNewsVo(BulkDumpNewsVo newsVo, List<BulkDumpNewsMMDataVo> bulkDumpNewsMMDataList) {
        super.processBulkDumpNewsVo(newsVo, bulkDumpNewsMMDataList);

        getTotalId().setData(newsVo.getContentId());
        getTotalId10().setData(String.format("%010d", BulkUtil.parseInt(newsVo.getContentId())));

        getOrgSourceCode().setData(newsVo.getOrgSourceCode());
        getMedia1().setData(newsVo.getDep());
        getContCode1().setData(newsVo.getContCode1());
        getContCode2().setData(newsVo.getContCode2());
        getContCode3().setData(newsVo.getContCode3());

        setFrstCode(newsVo.getFrstCode());

        getTitle().setData(newsVo.getTitle());
        getSubTitle().setData(newsVo.getSubTitle());
        getArtReporter().setData(newsVo.getArtReporter());

        if ( newsVo.getEmail() != null && !newsVo.getEmail().isEmpty()) {
            getEmail().setData(newsVo.getEmail());
        }

        getContentHtml().setData(newsVo.getContent());
        getServiceurl().setData(newsVo.getServiceUrl());
        getAddr().setData(newsVo.getAddr());
        getLat().setData(newsVo.getLat());
        getLng().setData(newsVo.getLng());

        getPressDate().setData(newsVo.getPressDate());
        getContentType().setData(newsVo.getContentType());

        setImageBulkFlag(newsVo.getImageBulkFlag());
        setBulkSendSite(newsVo.getBulkSite()); // 전송매체 리스트  "1:네이버", "2:다음", "3:네이트", "4:줌", "9:기타"
        setBulkDelSite(newsVo.getDelSite());

        getPressCategory().setData(newsVo.getPressCategory());
        getMyun().setData(newsVo.getMyun());
        getPan().setData(newsVo.getPan());
        getNaverMyun().setData(newsVo.getMyun());
        getNaverPan().setData(newsVo.getPan());

        if (!McpString.isNullOrEmpty(newsVo.getMyun())) {
            if (!McpString.isNullOrEmpty(newsVo.getPressPosition())) {
                getNaverPosition().setData(newsVo.getPressPosition());
            } else {
                getNaverPosition().setData("9");
            }
        }

        //2019-05 네이버 속보
        getNaverBreakingNewsGrade().setData(newsVo.getBreakingNews());
        getNaverBreakingNewsId().setData(newsVo.getBreakingNewsCnt());
        if( !getNaverBreakingNewsId().isEmpty() ) {
            if( getNaverBreakingNewsGrade().isEmpty() ) {
                getNaverBreakingNewsGrade().setData("0");
            }
            getNaverBreakingNewsTitle().setData("<![CDATA[" + newsVo.getTitle().trim() + "]]>");
            getNaverBreakingNewsDate().setData(McpDate.dateStr(getInsDt(), "yyyy-MM-dd"));
            getNaverBreakingNewsTime().setData(McpDate.dateStr(getInsDt(), "HH:mm:ss"));
        }

        //2019-05 네이버 현장값
        if( !McpString.isNullOrEmpty(newsVo.getOnTheSceneReporting()))
            getNaverOnTheSceneReporting().setData(newsVo.getOnTheSceneReporting().toUpperCase().trim());
    }

    public void processMediaFullName() {
        getMediaFullName().setData(MediaFullName.getJoongangMediaFullName( getTargetCode().substring(getTargetCode().length() - 1)));
    }

    public void processBulkReporters(List<Map<String, String>> reporters) {
        if( reporters.size() > 0 ) {
            getArtReporterDaum().setData( BulkUtil
                    .getMapStringData( reporters.get(0), "REP_NAME").trim() );

            String artReporterNaver = "";
            for (Map<String, String> reporter : reporters) {
                if(!McpString.isNullOrEmpty(artReporterNaver))
                    artReporterNaver += ",";
                artReporterNaver += BulkUtil
                        .getMapStringData( reporter, "REP_NAME").trim();

                final String strEmail = BulkUtil
                        .getMapStringData( reporter, "REP_EMAIL").trim();
                if( !McpString.isNullOrEmpty(strEmail)) {
                    artReporterNaver += "(" + strEmail + ")";
                }
            }
            getArtReporterNaver().setData(artReporterNaver);
        }
    }

    public void processNaverMyunPan() {
        //네이버 면판정보 추가관련 변경건 - 지창현 (2016.04.27 ) <-- read while 문 안에 넣어져 있어서 밖으로 이동(Sean)
        if (!McpString.isNullOrEmpty(getPressCategory()) && !McpString.isNullOrEmpty(getNaverMyun())
                && ("1".equals( getOrgSourceCode().toString().trim())))
        {
            if(!"A_C_E_S_T_M_U_Q_Y".contains(getPressCategory().toString()))
                getPressCategory().setData("Z");
            getNaverMyun().setData(getPressCategory().toString() + BulkUtil.parseInt(getNaverMyun().toString()));
        }
        else
        {
            getNaverMyun().setData("");
            getNaverPan().setData("");
        }

        //지면발행일자 처리
        try {
            //날짜데이터 유효성 및 포맷변환
            Date tm = McpDate.date("yyyyMMdd", getPressDate().toString());
            getPressDate().setData(McpDate.dateStr(tm, "yyyy-MM-dd"));
        } catch (Exception ignore) {
            //예외시 출고일자지정(협의됨)
            getPressDate().setData( McpDate.dateStr(getInsDt(), "yyyy-MM-dd"));
        }
    }

    public void processContentTag_ab_dynamic_chart() {
        // 2019 동적차트 제거하고 이미지만 추출하여 삽입
        if( getContentHtml().toString().contains("ab_dynamic_chart")) {
            final String chartPattern = "(?i)<div\\s*?class\\s*?=\\s*?\"ab_dynamic_chart\"\\s*?data-chartImgUrl\\s*?=\\s*?['|\"](?<imgUrl>.*?)['|\"].*?</figure></div>";
            getContentHtml().replaceAll(chartPattern, "<img alt=\"\" src=\"$1\"/>");
        }
    }

    private static final Pattern PATTERN_ContentTag_tag_photoslide = Pattern.compile("<div(\\s*?)class=\"tag_photoslide\"(?<entry>.*?)</p></div></div>", Pattern.CASE_INSENSITIVE);
    private static final Pattern PATTERN_ContentTag_tag_photoslide_Sub = Pattern.compile("<(\\s*?)img(?<entry>.*?)>", Pattern.CASE_INSENSITIVE);

    public void processContentTag_tag_photoslide() {
        // 2020.03.20 포토 슬라이드 개별 이미지로 추출
        if( getContentHtml().toString().contains("tag_photoslide")) {
            Matcher matcher = PATTERN_ContentTag_tag_photoslide.matcher(getContentHtml().toString());
            StringBuffer sb = new StringBuffer( getContentHtml().toString().length() * 2 );
            while( matcher.find() ) {
                String subText = matcher.group();
                StringBuilder subChangeText = new StringBuilder();
                Matcher matcherSub = PATTERN_ContentTag_tag_photoslide_Sub.matcher(subText);
                while( matcherSub.find() ){
                    subChangeText.append(matcherSub.group()).append("\r\n");
                }
                matcher.appendReplacement(sb, subChangeText.toString());
            }
            matcher.appendTail(sb);
            getContentHtml().setData(sb.toString());
        }
    }

    public void processContentTag_ab_photofix() {
        // 2020.03.20 포토 fix 개별 이미지로 추출
        if( getContentHtml().toString().contains("ab_photofix")) {
            final String photofixPattern = "(?i)<div(\\s*?)class=\"ab_photofix\">.*?background-image:url\\('(?<src>.*?)'.*?<p class=\"caption\">(?<alt>.*?)</p>(\\s*?)</div>";
            getContentHtml().replaceAll(photofixPattern, "<img alt=\"$3\" src=\"$2\"/>" );
        }
    }

    public void processContent_etcLevel1() {
        //2019-05-09 <hr><hr> 더보기 제거
        getContentHtml().replace("<hr><hr>", "");

        //2016.01.14 by song
        getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule( getContentHtml().toString(), "<div class=\"tag_pictorial\" ", "</div>")); //화보 제외
        getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule( getContentHtml().toString(), "<div class=\"tag_poll\"", "</div>")); //투표 제외
        getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule( getContentHtml().toString(), "<div class=\"tag_sns\"", "</div>")); //sns 제외

        //2020.03.18
        getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule( getContentHtml().toString(), "<div id=\"htmlTag\"", "</div>")); //htmltag 파티클 제외

        getContentHtml().replace("pds.joinsmsn.com", "pds.joins.com");
    }

    public void processContentTag_ab_people() {
        if( getContentHtml().toString().contains("ab_people")) {
            final String peoplePattern = "(?i)<div(\\s *?)class.{1,5}(\\bab_people\\b)[^>]+>(\\s*?)(.*?)<div(\\s*?)class.{1,5}(\\bab_people_hd\\b)[^>]+>(\\s*?)(.*?)</div>(\\s*?)(.*?)<div(\\s*?)class.{1,5}(\\bab_people_bd\\b)[^>]+>(\\s*?)(.*?)</div>(\\s*?)(.*?)</div>";
            getContentHtml().replaceAll(peoplePattern, "" );
        }
    }

    public void processContent_etcLevel2() {
        if (getContentHtml().toString().contains("<a style=\"display:none\"")) {
            getContentHtml().replace("<a style=\"display:none\"", "<a ");
        }
        if (getContentHtml().toString().contains("Copyright(C) JTBC Contents Hub. All rights reserved.")) {
            getContentHtml().setData(getContentHtml().toString().replace("Copyright(C) JTBC Contents Hub. All rights reserved.", "").trim() + "\r\n");
        }
    }

    public void processContent_contentHtmlMs() {
        // `12.10.13 이승인 : ms 용은 xxx 의 블로그가 없어야 하므로 추가
        getContentHtmlMs().setData(BulkTagUtil.standardBulkClearingTag(getContentHtml().toString()));
        if (getContentHtmlMs().isEmpty()) {
            getContentHtmlMs().setData(".");
        }
    }

    public void processReporter() {
        if( getEmail().isEmpty()){
            getArtReporterWithEmail().setData(getArtReporter().toString());
        }
        else{
            getArtReporterWithEmail().setData( getArtReporter().toString() + "(" + getEmail().toString() + ")");
        }

        if( getArtReporter().isEmpty()){
            getArtReporter().setData("n/a");
        }

    }

    public void processContent_contentHtmlEx4() {
        getContentHtmlEx4().setData( getContentHtml().toString() );
        getContentHtmlEx4().setData( BulkTagUtil.ripTagWithOrderRule( getContentHtmlEx4().toString(), "style=\"width:", "px\"", 50 ) );
        getContentHtmlEx4().setData( BulkTagUtil.ripTagWithOrderRule( getContentHtmlEx4().toString(), "style=\"width:", "px;\"", 50 ) );
        getContentHtmlEx4().setData( BulkTagUtil.ripTagWithOrderRule( getContentHtmlEx4().toString(), "wrapperwidth=", "px\"", 50 ) );
        getContentHtmlEx4().setData( BulkTagUtil.ripTagWithOrderRule( getContentHtmlEx4().toString(), "wrapperwidth=", "px;\"", 50 ) );
        getContentHtmlEx4().setData( BulkTagUtil.ripTagWithOrderRule( getContentHtmlEx4().toString(), "<div class=\"tag_vod\"", "</div>") ); //동영상 제외
        getContentHtmlEx4().setData( BulkTagUtil.ripTagWithOrderRule( getContentHtmlEx4().toString(), "<div class=\"tag_audio\"", "</div>") ); //오디오 제외
    }

    private static final Pattern PATTERN_ContentTag_quiz_question_screen_open = Pattern.compile("<!--(\\s*?)quiz_open(\\s*?)-->.*?<!--(\\s*?)quiz_close(\\s*?)-->", Pattern.CASE_INSENSITIVE);
    private static final Pattern PATTERN_ContentTag_quiz_question_screen_open_Title = Pattern.compile("<!--(\\s*?)quiz_start_screen_open(\\s*?)-->.*<p class=\"quiz_group\">(?<group>.*?)</p>.*<p class=\"quiz_title\">(?<title>.*?)</p>.*<p class=\"quiz_description\">(?<desc>.*?)</p>.*<!--(\\s*?)quiz_start_screen_close(\\s*?)-->", Pattern.CASE_INSENSITIVE);
    private static final Pattern PATTERN_ContentTag_quiz_question_screen_open_Content = Pattern.compile("<!--(\\s*?)quiz_question_screen_open(\\s*?)-->(?<questionText>.*?)<!--(\\s*?)quiz_question_screen_close(\\s*?)-->", Pattern.CASE_INSENSITIVE);
    private static final Pattern PATTERN_ContentTag_quiz_question_screen_open_Question = Pattern.compile("<p class=\"quiz_question\"><span class=\"hide\">(?<seq>.*?)</span>(?<question>.*?)</p>", Pattern.CASE_INSENSITIVE);
    public void processContentTag_quiz_question_screen_open() {
        // region 2018-11-01 quiz 변환 by ethan

        if( getContentHtml().contains("quiz_question_screen_open")) {
            Matcher matcher = PATTERN_ContentTag_quiz_question_screen_open.matcher(getContentHtml().toString());
            StringBuffer sb = new StringBuffer( getContentHtml().toString().length() * 2 );

            while( matcher.find() ) {
                StringBuilder quizText = new StringBuilder();

                Matcher matcherTitle = PATTERN_ContentTag_quiz_question_screen_open_Title.matcher(matcher.group());
                if( matcherTitle.find() ){
                    quizText = new StringBuilder(
                            "\r\n<b># 재미로 풀어보는 오늘의 퀴즈</b>\r\n<b>" + matcherTitle.group("title") + "</b>\r\n" + matcherTitle.group("desc") + "\r\n");
                }

                Matcher matcherContent = PATTERN_ContentTag_quiz_question_screen_open_Content.matcher(matcher.group());
                while( matcherContent.find() ) {
                    Matcher matcherQuestion = PATTERN_ContentTag_quiz_question_screen_open_Question.matcher(matcherContent.group());
                    if( matcherQuestion.find()) {
                        quizText.append(matcherQuestion.group("seq").trim())
                                .append(matcherQuestion.group("question").trim())
                                .append("\r\n");
                    }
                }
                quizText.append("-정답확인 : ")
                        .append( getServiceurl() )
                        .append("\r\n");
                matcher.appendReplacement(sb, quizText.toString());
            }
            matcher.appendTail(sb);
            getContentHtml().setData(sb.toString());
        }
    }

    private static final Pattern PATTERN_ContentTag_cyworld = Pattern.compile("<(\\s*?)img.[^>]+>", Pattern.CASE_INSENSITIVE);
    public void processContentCyworld() {
        // 싸이월드 전용변수(m_content_html_cyworld) - 정보구성
        String contentHtmlCyworld = getContentHtml().toString()
                                                    .replaceAll("(?i)<!--img_tag_s-->.*?<!--img_tag_e-->", "")
                                                    .replaceAll("(?i)<!--@img_tag_s@-->.*?<!--@img_tag_e@-->", "");

        Map<String, String> imgMap = new HashMap<>();
        contentHtmlCyworld = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_cyworld, contentHtmlCyworld, "cy_imgs", imgMap );

        //<b></b>, <br/>, <strong> 태그 제외 .. 뿐만 아니라 대부분 삭제..
        contentHtmlCyworld = contentHtmlCyworld.replaceAll( "[<]([/]?)[ac-oq-zAC-OQ-Z](\\s*?)(.*?)[>]", "");

        //<p class>...<p> 제외
        contentHtmlCyworld = contentHtmlCyworld.replaceAll( "(?i)[<][p](\\s*?)(class)[^>]+>(\\s*?)(.*?)[^<]+</p>", "")
                                               .replaceAll( "(?i)[「|」]", "");

        for (Map.Entry<String, String> entry : imgMap.entrySet()) {
            contentHtmlCyworld = contentHtmlCyworld.replace( entry.getKey(), entry.getValue().replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }

        getContentHtmlCyworld().setData( contentHtmlCyworld.trim());
    }

    private static final Pattern PATTERN_ContentTag_nateImg = Pattern.compile("<(\\s*?)img.[^>]+>", Pattern.CASE_INSENSITIVE);
    // ssc sapark : 정규식 오류 확인 정규식 수정
    private static final Pattern PATTERN_ContentTag_nateYoutube = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(http.*?youtube.*?))\"(?:\\s*?)data-service=\"youtube[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    public void processContentNate() {
        // 네이트 전용변수(m_content_html_nate) - 정보구성
        String contentHtmlNate = getContentHtml().toString()
                                                 .replaceAll("(?i)<!--img_tag_s-->.*?<!--img_tag_e-->", "")
                                                 .replaceAll("(?i)<!--@img_tag_s@-->.*?<!--@img_tag_e@-->", "");

        Map<String, String> imgMap = new HashMap<>();
        contentHtmlNate = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_nateImg, contentHtmlNate, "nt_imgs", imgMap );

        //영상  처리(현재는 유튜브만 삽입되도록) 2018-09-05
        contentHtmlNate = contentHtmlNate.replaceAll("(?i)<(\\s*?)/(\\s*?)div(\\s*?)><(\\s*?)div(\\s*?)class=\"tag_vod\"", "</div>\r\n<div class=\"tag_vod\"" );
        Map<String, String> videoMap = new HashMap<>();
        contentHtmlNate = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_nateYoutube, contentHtmlNate, "nt_vod", videoMap );

        //<b></b>, <br/>, <strong> 태그 제외 .. 뿐만 아니라 대부분 삭제..
        contentHtmlNate = contentHtmlNate.replaceAll( "[<]([/]?)[ac-oq-zAC-OQ-Z](\\s*?)(.*?)[>]", "");
        //<p class>...<p> 제외
        contentHtmlNate = contentHtmlNate.replaceAll( "(?i)[<][p](\\s*?)(class)[^>]+>(\\s*?)(.*?)[^<]+</p>", "")
                                               .replaceAll( "(?i)[「|」]", "");


        for( Map.Entry<String, String> entry : imgMap.entrySet() ){
            contentHtmlNate = contentHtmlNate.replace( entry.getKey(), entry.getValue().replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }

        contentHtmlNate = "<b>" + getSubTitle().toString() + "</b>\r\n\r\n" + contentHtmlNate.trim();

        for( Map.Entry<String, String> entry : videoMap.entrySet() ){
            contentHtmlNate = contentHtmlNate.replace(entry.getKey(),
                    entry.getValue().replaceAll(
                            "(?i)<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(http.+youtube.+))\"(?:\\s*?)data-service=\"youtube[^>]+>(?:\\s*?)</div>",
                            "<iframe src=\"$1\" width=\"605\" height=\"339\" allowfullscreen=\"true\"></iframe>"));
        }

        getContentHtmlNate().setData( contentHtmlNate);
    }

    // ssc Sapark 패턴 수정..
    private static final Pattern PATTERN_ContentTag_zumVod = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id[^>].*?>(\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_zumVodNaverCast = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"navercast[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_zumVodKakaoTv = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"kakaotv[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_zumVodYouTube = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(http.*?youtube.*?))\"(?:\\s*?)data-service=\"youtube[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_zumVodOvp = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"(ovp|ooyala)[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    public void processContentZum() {
        // zum 전용변수(m_content_html_zum) - 정보구성
        String contentHtmlZum = getContentHtml().toString().replaceAll("(?i)<(\\s*?)/(\\s*?)div(\\s*?)><(\\s*?)div(\\s*?)class=\"tag_vod\"", "</div>\r\n<div class=\"tag_vod\"");

        Map<String, String> videoMap = new HashMap<>();
        contentHtmlZum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_zumVod, contentHtmlZum, "zum_vod_", videoMap );

        for( Map.Entry<String, String> entry : videoMap.entrySet() ){
            final String videoKey = entry.getKey();
            final String videoStr = entry.getValue();
            // 네이버 cast
            Matcher matcherNaver = PATTERN_ContentTag_zumVodNaverCast.matcher(videoStr);
            if( matcherNaver.find() ) {
                contentHtmlZum = contentHtmlZum.replace(videoKey, String.format("<iframe src=\"%s\" width=\"530\" height=\"306\" allowfullscreen=\"true\"></iframe>", matcherNaver.group("url")));
                continue;
            }

            // 카카오 TV
            Matcher matcherKakaoTv = PATTERN_ContentTag_zumVodKakaoTv.matcher(videoStr);
            if( matcherKakaoTv.find()) {
                contentHtmlZum = contentHtmlZum.replace(videoKey, String.format("<iframe src=\"%s\" width=\"530\" height=\"306\" allowfullscreen=\"true\"></iframe>", matcherKakaoTv.group("url")));
                continue;
            }

            // YouTube
            Matcher matcherYouTube = PATTERN_ContentTag_zumVodYouTube.matcher(videoStr);
            if( matcherYouTube.find()) {
                contentHtmlZum = contentHtmlZum.replace(videoKey, String.format("<iframe src=\"%s\" width=\"530\" height=\"306\" allowfullscreen=\"true\"></iframe>", matcherYouTube.group("url")));
                continue;
            }

            // ovp
            Matcher matcherOvp = PATTERN_ContentTag_zumVodOvp.matcher(videoStr);
            if( matcherOvp.find()){
                contentHtmlZum = contentHtmlZum.replace(videoKey, "");
            }
        }

        contentHtmlZum = contentHtmlZum.replaceAll( "(?i)[<][p](\\s*?)(class)[^>]+>(\\s*?)(.*?)[^<]+</p>", "")
                                       .replaceAll( "[「|」]", "");
        contentHtmlZum = BulkTagUtil.outLinkBulkClearingTagEx( contentHtmlZum );

        getContentHtmlZum().setData(contentHtmlZum);
    }

    private static final Pattern PATTERN_ContentTag_naverVodOoyala = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"(ovp|ooyala)[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    public void processContentNaverXml(String contentHtml) {
        //네이버 제공용 xml 2014.02.10
        //2019-07-23 SEO 관련 h2 태그 삭제
        //네이버용 유투브 정보 변환
        //2019-01-29 네이버 유튜브 지원 중지
        String contentNaver = contentHtml
                .replace("http://ir.joins.com/?u=", "")
                .replace("&w=550", "")
                .replace("<h2>", "")
                .replace("</h2>", "")
                .replaceAll("(?i)<(\\s*?)/(\\s*?)div(\\s*?)><(\\s*?)div(\\s*?)class=\"tag_vod\"", "</div>\r\n<div class=\"tag_vod\"")
                .replaceAll("(?i)<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(http.*?youtube.*?))\"(?:\\s*?)data-service=\"youtube[^>]+>(?:\\s*?)</div>", "");

        //네이버 TV
        contentNaver = contentNaver.replaceAll("(?i)<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(https://.+))\"(?:\\s*?)data-service=\"navercast[^>]+>(?:\\s*?)</div>",
                "<iframe src=\"$1\" allowfullscreen=\"true\"></iframe>");

        //네이버 멀티 우얄라 영상 포지셔닝 2018-08-16
        Matcher matcherOvp = PATTERN_ContentTag_naverVodOoyala.matcher(contentNaver);
        int naverOvpCount = 1;
        while( matcherOvp.find() ) {
            contentNaver = StringUtils.replaceOnce(contentNaver, matcherOvp.group(),  String.format("<!-- naver_news_vod_%d -->", naverOvpCount++));
        }

        contentNaver = BulkTagUtil.ripTagWithOrderRule(contentNaver, "<div class=\"tag_audio\"", "</div>"); //오디오 제외

        // e 글중심 (정규식 그룹캡처) 구현시작
        contentNaver = processContentNaverXmlTag_ab_box_article_eGul( contentNaver );

        // ab_box_article (정규식 그룹핑) 구현시작
        contentNaver = processContentNaverXmlTag_ab_box_article( contentNaver );

        // 스타기자(ab_emphasis) 구현시작
        contentNaver = processContentNaverXmlTag_ab_emphasis( contentNaver );

        //ab_sub_heading(Bold 처리) - 공통사용, 아티클 박스 내부에서 사용하는 ab_sub_heading, ab_sub_headingline 태그가 전부 변경된 뒤 처리
        contentNaver = processContentNaverXmlTag_etc( contentNaver );

        getContentHtmlNaver().setData(contentNaver);
    }

    public String processContentNaverXmlTag_etc(String contentNaver) {
        //ab_sub_heading(Bold 처리) - 공통사용, 아티클 박스 내부에서 사용하는 ab_sub_heading, ab_sub_headingline 태그가 전부 변경된 뒤 처리
        //ab_table class 적용
        contentNaver = contentNaver.replaceAll("(?i)<div class(\\s)*=(\\s)*([\"'])ab_sub_heading([\"'])(\\s)*>","<div class=\"ab_sub_heading\" style=\"position:relative;margin-top:17px;margin-bottom:16px;padding-top:15px;padding-bottom:14px;border-top:1px solid #444446;border-bottom:1px solid #ebebeb;color:#3e3e40;font-size:20px;line-height:1.5;\">")
                                   .replaceAll("(?i)<div class(\\s)*=(\\s)*([\"'])ab_sub_headingline([\"'])(\\s)*>","<div class=\"ab_sub_headingline\" style=\"font-weight:bold;\">")
                                   .replaceAll("(?i)<table class(\\s)*=(\\s)*([\"'])ab_table([\"'])(\\s)*>", "<table style=\"width:100%;border-collapse:collapse;border-spacing:0;\">")
                                   .replaceAll("(?i)<td class(\\s)*=(\\s)*(]\"'])ab_table_td([\"'])(\\s)*>", "<table style=\"padding: 6px; border: 1px solid #ebebeb;\">")
                                   .replace("&middot;", "·");

        return contentNaver;
    }

    public String processContentNaverXmlTag_ab_emphasis(String contentNaver) {
        // 스타기자(ab_emphasis) 구현시작
        final Pattern PATTERN_ContentTag_naverEmphasisHeader = Pattern.compile("(?<abEmphasis><div(\\s*?)class.{1,5}(\\bab_emphasis\\b)[^>]+)>(\\s*?)(.*?)(?<emphasisDimLt><span(\\s*?)(.*?)(\\bab_emphasis_dim_lt\\b)[^>]+)>", Pattern.CASE_INSENSITIVE);
        StringBuilder sb = new StringBuilder(contentNaver.length() * 3);
        Matcher adBoxEmphasisHeader = PATTERN_ContentTag_naverEmphasisHeader.matcher(contentNaver);
        if( !adBoxEmphasisHeader.find() )
            return contentNaver;
        do {
            final String replace = adBoxEmphasisHeader
                    .group("abEmphasis")
                    .concat(" style=\"position:relative;margin:23px 0;padding:0 70px;font-size:20px; font-weight:bold; line-height:28px; text-align:center; \">")
                    .concat(adBoxEmphasisHeader.group("emphasisDimLt"))
                    .concat(" style=\"display:block;position:absolute;top:0;left:-45px;width:74px;height:74px;font-size:68px;font-weight:normal;line-height:76px;overflow:hidden;\">");
            adBoxEmphasisHeader.appendReplacement(sb, replace);
        } while( adBoxEmphasisHeader.find() );
        adBoxEmphasisHeader.appendTail(sb);
        contentNaver = sb.toString();

        final Pattern PATTERN_ContentTag_naverEmphasisTail = Pattern.compile("<div(\\s*?)class.{1,5}(\\bab_emphasis\\b)[^>]+>(\\s*?)(.*?)<span(\\s*?)(.*?)(\\bab_emphasis_dim_lt\\b)[^>]+>(\\s*?)(.*?)</span>(\\s*?)(.*?)<p(\\s*?)class.{1,5}(\\bab_emphasis_content\\b)[^>]+>(\\s*?)(.*?)</p>(\\s*?)(.*?)(?<emphasisDimRt><span(\\s*?)class.{1,5}(\\bab_emphasis_dim_rt\\b)[^>]+)>(\\s*?)(.*?)</span>", Pattern.CASE_INSENSITIVE);
        contentNaver = BulkTagUtil.regexReplaceGroup( contentNaver, PATTERN_ContentTag_naverEmphasisTail,
                "emphasisDimRt", "<span class=\"ab_emphasis_dim_rt\" style =\"display:block;position:absolute;bottom:-8px;right:-45px;width:74px;height:74px;font-size:68px;font-weight:normal;line-height:70px; overflow: hidden;\"");

        return contentNaver;
    }

    public String processContentNaverXmlTag_ab_box_article_eGul(String contentNaver) {
        // e 글중심 (정규식 그룹캡처) 구현시작
        final Pattern PATTERN_ContentTag_naverAdboxArticleHeader = Pattern.compile("(?<abBoxArticleTotal><div(\\s*)class.{1,5}(\\bab_box_article\\sab_division\\s(division_center|division_left|division_right)\\b)[^>])+>(\\s*)(.*?)(?<abBoxInner><div(\\s*)(.*?)(\\bab_box_inner\\b)[^>])+>(\\s*)(.*?)(?<abBoxTitle><div(\\s*)class.{1,5}(\\bab_box_title\\b)[^>])+>(\\s*)(.*?)(?<abBoxBullet><span(\\s*)class.{1,5}(\\bab_box_bullet\\b)[^>])+>", Pattern.CASE_INSENSITIVE);

        StringBuilder sb = new StringBuilder(contentNaver.length() * 3);

        Matcher adBoxArticleHeader = PATTERN_ContentTag_naverAdboxArticleHeader.matcher(contentNaver);
        if( !adBoxArticleHeader.find() )
            return contentNaver;
        do {
            final String replace = adBoxArticleHeader
                    .group("abBoxArticleTotal")
                    .concat(" style=\"padding-bottom:16px;line-height:26px;letter-spacing:0px;font-family:돋움,dotum,sans-serif;\">")
                    .concat(adBoxArticleHeader.group("abBoxInner"))
                    .concat(" style=\"padding:24px 20px 0px;border:1px solid rgb(221,221,221);border-image:none;overflow:hidden;clear:both;\" >")
                    .concat(adBoxArticleHeader.group("abBoxTitle"))
                    .concat(" style=\"color:rgb(166,152,134);line-height:1.5;font-size:14px;margin-bottom:1px;\">")
                    .concat(adBoxArticleHeader.group("abBoxBullet"))
                    .concat(" style=\"display:none;\">");
            adBoxArticleHeader.appendReplacement(sb, replace);
        } while( adBoxArticleHeader.find() );
        adBoxArticleHeader.appendTail(sb);
        contentNaver = sb.toString().replace("division_right", "division_left"); // 기존 룰에 맞춘다.

        // <span class="dim" style="display: none;">■</span> 유형 전부 지우기 - 아티클박스 관련 전부 지운다.
        contentNaver = contentNaver.replaceAll("(?i)<div(\\s *?)class=\"(\\bdim\\b)[^>]+>(\\s*?)(.*?)</div>", "");
        contentNaver = contentNaver.replaceAll("(?i)<span(\\s*?)class=\"(\\bdim\\b)[^>]+>.</span>", "");


        final Pattern PATTERN_ContentTag_naverAdboxArticleTitleLine = Pattern.compile("<div(\\s*?)(.*?)(\\bab_box_article\\sab_division\\s(division_center|division_left|division_right)\\b)[^>]+>(.*?)(?<AbBoxTitleline><div(\\s *?)class=\"(\\bab_box_titleline\\b)[^>]+>)(\\s*?)(.*?)</div>", Pattern.CASE_INSENSITIVE);
        contentNaver = BulkTagUtil.regexReplaceGroup( contentNaver, PATTERN_ContentTag_naverAdboxArticleTitleLine, "AbBoxTitleline", "<div class=\"ab_box_titleline\" style=\"font-weight:bold;\">");

        ////article_box 요소 중 나머지 태그(ab_box_content | ab_sub_heading | ab_sub_headingline | ab_quotation) 처리
        final Pattern PATTERN_ContentTag_naverAdboxArticleEtc = Pattern.compile("<div(\\s*)(.*?)(\\bab_box_article\\sab_division\\s(division_center|division_left|division_right)\\b)[^>]+>(\\s*)(.*?)(\\bab_box_inner\\b)(\\s*)(.*?)(\\bab_box_title\\b)(\\s*)(.*?)(\\bab_box_bullet\\b)(\\s*)(.*?)<div(\\s*)(.*?)(\\bab_box_titleline\\b)(\\s*)(.*?)(?<abBoxContent><div(\\s*?)(.*?)(\\bab_box_content\\b)[^>]+>)(\\s*?)(.*?)(?<abSubHeading><div(\\s*?)(.*?)(\\bab_sub_heading\\b)[^>]+>)(\\s*?)(.*?)(?<abSubHeadingline><div(\\s*?)(.*?)(\\bab_sub_headingline\\b)[^>]+>)(\\s*?)(.*?)(?<tagQuotation><div(\\s*)(.*?)(\\btag_quotation\\b)[^>]+>)", Pattern.CASE_INSENSITIVE);
        contentNaver = BulkTagUtil.regexReplaceGroup( contentNaver, PATTERN_ContentTag_naverAdboxArticleEtc
                , Arrays.asList( "abBoxContent", "abSubHeading", "abSubHeadingline", "tagQuotation" )
                , Arrays.asList(
                        "<div class=\"ab_box_content\" style=\"color:rgb(60,62,64);line-height:20px;font-size:14px;\">",
                        "<div class=\"ab_sub_heading\" style=\"color:rgb(35,31,32);line-height:1.5;font-size:16px;margin-bottom:15px;position:relative;\">",
                        "<div class=\"ab_sub_headingline\" style=\"color:rgb(60, 62, 64);font-weight:bold;\">",
                        "<div class=\"tag_quotation\" style=\"padding:22px 0px;color:rgb(115,116,117);line-height:28px;letter-spacing:-0.07em;font-size:13px;position:relative;\">" ) );

        return contentNaver;
    }

    // ab_box_article (정규식 그룹핑) 구현시작
    public String processContentNaverXmlTag_ab_box_article( String contentNaver ){
        final Pattern PATTERN_ContentTag_naverAdboxArticleFootHeader = Pattern.compile("(?<abBoxArticle><div(\\s*?)class=\"(\\bab_box_article\\b)(\\s*?)[^>])+>(\\s*?)(?<abBoxInner><div(\\s*)class=\"(\\bab_box_inner\\b)[^>])+><div(\\s*?)class=\"(\\bdim\\b)[^>]+>(\\s*?)(.*?)(?<abBoxTitle><div(\\s*)class=\"(\\bab_box_title\\b)[^>])+>(\\s*?)(.*?)(?<abBoxBullet><span(\\s*)class=\"(\\bab_box_bullet\\b)[^>])+>", Pattern.CASE_INSENSITIVE);

        StringBuilder sb = new StringBuilder(contentNaver.length() * 3);
        Matcher adBoxArticleFootHeader = PATTERN_ContentTag_naverAdboxArticleFootHeader.matcher(contentNaver);
        if( !adBoxArticleFootHeader.find() )
            return contentNaver;
        do {
            final String replace = adBoxArticleFootHeader
                    .group("abBoxArticle")
                    .concat(" style=\"padding-top:17px;padding-bottom:16px;position:relative;\">")
                    .concat(adBoxArticleFootHeader.group("abBoxInner"))
                    .concat(" style=\"padding:42px 20px 24px;border:1px solid rgb(221, 221, 221);border-image:none;overflow:hidden;\">")
                    .concat(adBoxArticleFootHeader.group("abBoxTitle"))
                    .concat(" style=\"color:rgb(93,129,195);line-height:1.5;font-size:20px;margin-bottom:17px;\">")
                    .concat(adBoxArticleFootHeader.group("abBoxBullet"))
                    .concat(" style=\"background:rgb(93,129,195);left:20px;top:12px;width:18px;height:28px;overflow:hidden;display:block;position:absolute;\">");
            adBoxArticleFootHeader.appendReplacement(sb, replace);
        } while( adBoxArticleFootHeader.find() );
        adBoxArticleFootHeader.appendTail(sb);
        contentNaver = sb.toString();

        //<span class="dim" style="display: none;">■</span> 유형 전부 지우기 - 아티클박스 관련 전부 지운다.
        //contentNaver = contentNaver.replaceAll("(?i)<div(\\s *?)class=\"(\\bdim\\b)[^>]+>(\\s*?)(.*?)</div>", "");
        contentNaver = contentNaver.replaceAll("(?i)<div(\\s *?)class=\"(\\bdim\\b)((.|\\n|\\r\\n)*?)</div>", "");
        //final Pattern PATTERN_ContentTag_dim = Pattern.compile("(?<dimGroup><div(\\s *?)class=\"(\\bdim\\b)((.|\\r\\n|\\n)*?)</div>)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);
        //contentNaver = BulkTagUtil.regexReplaceGroup( contentNaver, PATTERN_ContentTag_dim, "dimGroup", "");
        contentNaver = contentNaver.replaceAll("(?i)<span(\\s*?)class=\"(\\bdim\\b)[^>]+>.</span>", "");

        final Pattern PATTERN_ContentTag_naverAdBoxTail = Pattern.compile("<div(\\s*?)(.*?)(\\bab_box_article\\b)[^\"]\"[^>]+>(\\s*?)(.*?)(\\bab_box_inner\\b)[^>]+>(\\s*)(.*?)(\\bab_box_bullet\\b)(\\s*?)(.*?)[^>]+>(\\s*?)</span>(\\s*?)(?<abBoxTitleline><div(\\s*?)class.+(\\bab_box_titleline\\b)[^>]+>)(\\s*?)(.*?)(</div>?)(\\s*?)(.*?)(</div>?)(\\s*?)(.*?)(?<aBboxContent><div(\\s*?)class.+(\\bab_box_content\\b)[^>]+>)", Pattern.CASE_INSENSITIVE);
        contentNaver = BulkTagUtil.regexReplaceGroup(contentNaver, PATTERN_ContentTag_naverAdBoxTail, "abBoxTitleline", "<div class=\"ab_box_titleline\" style=\"font-weight:bold;\">" );

        final Pattern PATTERN_ContentTag_naverAdBoxContent = Pattern.compile("<div(\\s*?)(.*?)(\\bab_box_article\\b)[^\"]\"[^>]+>(\\s*?)(.*?)(\\bab_box_inner\\b)[^>]+>(\\s*)(.*?)(\\bab_box_bullet\\b)(\\s*?)(.*?)[^>]+>(</span>?)(\\s*?)(.*?)(\\bab_box_article\\b)[^>]+>(\\s*?)(.*?)(</div>?)(\\s*?)(.*?)(</div>?)(\\s*?)(.*?)(?<aBboxContent><div(\\s*?)class.+(\\bab_box_content\\b)[^>]+>)", Pattern.CASE_INSENSITIVE);
        contentNaver = BulkTagUtil.regexReplaceGroup(contentNaver, PATTERN_ContentTag_naverAdBoxContent, "aBboxContent", "<div class=\"ab_box_content\" style=\"color:rgb(60,62,64);line-height:1.8;font-size:16px;\">" );

        return contentNaver;
    }

    public void processContent_ImageBulkYn(List<Map<String, String>> images) {
        // 2019.01.04 이미지 벌크 정보 본문내에서 가져오는 방식으로 변경
        String firstThumbImg = "";
        boolean firstProcess = true;
        //본문내용에서는 해당 이미지의 bulkYn 여부를 알수 없어 DB 조회 내용에서 확인
        for( Map<String, String> map : images ) {
            final String imgSrc = map.get("src");
            String imgDesc = map.get("alt");
            String noBulkImage = "";

            boolean bulkFlag = true;
            if( hasImageList() ) {
                for( BulkDumpNewsMMDataVo mmData : getBulkDumpNewsImageList() ) {
                    //본문내 첫번째 이미지와 DB에 저장되어 있는 이미지리스트 첫번째 건이 맞지 않을 경우(본문내 이미지중 대표이미지 지정한 경우)
                    if( firstProcess ){
                        firstProcess = false;
                        if( !imgSrc.equals( mmData.getUrl()) && mmData.getImageBulkFlag().equals("Y") )
                            firstThumbImg = mmData.getUrl();
                    }

                    if( imgSrc.equals(mmData.getUrl()) && mmData.getImageBulkFlag().equals("N")) {
                        bulkFlag = false;
                        noBulkImage = FilenameUtils.getName(mmData.getUrl());
                    }
                }
            }

            if (bulkFlag) {
                //2018-08-28 네이버 영상별 cover_img 따로 기술
                if (imgSrc.contains("ooyala")) continue; //우얄라 이미지는 이미지 벌크에서 제외(네이버, 네이트)

                getImageBlockTxt2().addDelimiterConcat(imgSrc, ";");
                getImageBlockTxtNate().setData( getImageBlockTxt2().toString());

                getImageBlockXml().concat("<images>\r\n");
                getImageBlockXml().concat("\t<imageurl><![CDATA[" + imgSrc + "]]></imageurl>\r\n");
                getImageBlockXml().concat("\t<description><![CDATA[" + imgDesc + "]]></description>\r\n");
                getImageBlockXml().concat("</images>\r\n");

                getImageBlockXmlZum().setData( getImageBlockXml().toString().replace("&amp;", "&"));

                getImageBlockXml4().concat("<component>\r\n");
                getImageBlockXml4().concat("\t<type>I</type>\r\n");
                getImageBlockXml4().concat( "\t<url><![CDATA[" + imgSrc + "]]></url>\r\n");
                getImageBlockXml4().concat( "\t<desc><![CDATA[" + imgDesc + "]]></desc>\r\n");
                getImageBlockXml4().concat( "\t<width />\r\n");
                getImageBlockXml4().concat( "\t<height />\r\n");
                getImageBlockXml4().concat( "\t<etc><![CDATA[]]></etc>\r\n");
                getImageBlockXml4().concat( "</component>\r\n");

                imgDesc = imgDesc.replace("<", "(")
                                 .replace(">", ")")
                                 .replace("&", "&amp;")
                                 .replace("&amp;amp;", "&amp;");    //&amp; 를 변환하는 경우만 예외 처리

                getImageBlockXmlNaver().concat(String.format("<image caption_content=\"%s\" href=\"%s\"/>\r\n", imgDesc, imgSrc));
            }
            else if( !McpString.isNullOrEmpty(noBulkImage)) {
                //개별이미지, 아티클 박스유형 패턴 검색 및 본문삭제
                final String findImagePattern = "(?i)(<div[^>]+>)(\\s)*(<div\\s+[^>]+>)(\\s)*(<img[^>]+" + noBulkImage + "[^>]+>)(\\s)*(<span[^>]+>(\\w)*(\\s)*</span>)(\\s)*(</div>)(\\s)*(<p[^>]+>(\\w)*(\\s)*</p>)?(\\s)*(</div>)";
                processContent_replaceAll( findImagePattern, "" );

                // 이미지번들(묶음) 전송 포함
                //                <div class="tag_photobundle">
                //                    <img alt="스토닉의 &amp;#39;통통한 엉덩이&amp;#39;. 윤정민 기자" caption="스토닉의 &amp;#39;통통한 엉덩이&amp;#39;. 윤정민 기자" index="0" iscoverimage="false" link="" linktarget="" src="http://pds.joins.com/news/component/htmlphoto_mmdata/201707/26/0782da2f-6233-45a8-a6a2-d5822041a48a.jpg" wrappercss="photo_center" wrapperwidth="580px"/>
                //                    <img alt="스토닉의 &amp;#39;통통한 엉덩이&amp;#39;. 윤정민 기자" caption="스토닉의 &amp;#39;통통한 엉덩이&amp;#39;. 윤정민 기자" index="1" iscoverimage="false" link="" linktarget="" src="http://pds.joins.com/news/component/htmlphoto_mmdata/201707/26/6dab7e6a-35b0-4532-a06b-c5989851c9d6.jpg" wrappercss="photo_center" wrapperwidth="580px"/>
                //                </div>
                final String findImagePattern2 = "(?i)(<img[^>]+" + noBulkImage + "[^>]+(\\s)*>)";
                processContent_replaceAll( findImagePattern2, "" );
            }
        }

        //<div class="ab_box_article">.....</div> 아티클 빈박스 지우기
        final String emptyBoxDelPattern = "<div(\\s*)class.*\\bab_box_article\\b[^>]+>(\\s*)<div[^>]+>(\\s*)<div[^>]+>.*<span[^>]+>(\\s*)</span>(\\s*)<div(\\s*)class.*\\bab_box_titleline\\b[^>]+>[^>]+>[^>]+>(\\s*)<div(\\s*)class.*\\bab_box_content\\b[^>]+>(\\s*)(&nbsp;(\\s*)<br/>)?(\\s*)</div>[^/div>]+/div>(\\s*)[^/div]+/div>";
        processContent_replaceAll( emptyBoxDelPattern, "" );

        //네이버 대표이미지 처리
        if (!McpString.isNullOrEmpty(firstThumbImg)){
            final Pattern PATTERN_firstThumb = Pattern.compile(String.format("<image[^>]+%s[^>]+(\\s)*>", firstThumbImg), Pattern.CASE_INSENSITIVE );
            Matcher matcher = PATTERN_firstThumb.matcher(getImageBlockXmlNaver().toString());
            if( matcher.find() ) {
                final String firstThumb = matcher.group();
                getImageBlockXmlNaver().replace(firstThumb, "");
                getImageBlockXmlNaver().setData( firstThumb + "\r\n" + getImageBlockXmlNaver().toString());
            }
        }
    }

    public boolean processContent_Ovp(TotalVo<BulkDumpTotalVo> totalVo, TaskManager taskManager) {
        final MokaBulkConfiguration bulkConfiguration = taskManager.getBulkConfiguration();
        final SlackMessageService slackMessageService = taskManager.getSlackMessageService();

        if( !hasVideoList() )
            return true;

        final List<BulkDumpNewsMMDataVo> ovpList = getBulkDumpNewsVideoList();
        final String accessToken = BulkBrightCoveUtil.getAccessToken(bulkConfiguration.getBrightCoveConfig());
        if( McpString.isNullOrEmpty( accessToken )) {
            slackMessageService.sendSms( "BulkDumpOvp", totalVo.logError(String.format("브라이트코브 토큰 요청 에러 totalId=[%s] [%s]", getTotalId(), getTitle())));
            return false;
        }

        StringBuilder naverOvpImgList = new StringBuilder();
        int ovpIndex = 0;
        for( BulkDumpNewsMMDataVo ovp : ovpList ) {
            //다운로드 완료 상관없이 동영상 커버 이미지 정보 생성(커버 이미지정보가 없는 경우, 기사 이미지 첫번째 거 지정)
            //이미지 첫번째 것도 없는 경우 디폴트 커버 이미지 적용(http://pds.joins.com/news/component/vod_noimage/cover_img.png)
            String thumbImg = ovp.getUrl();
            if (McpString.isNullOrEmpty(thumbImg)) {
                thumbImg = "http://pds.joins.com/news/component/vod_noimage/cover_img.png";
                if( hasImageList() ) {
                    thumbImg = getBulkDumpNewsImageList().get(0).getUrl();
                }
            }

            if( ovpIndex == 0 ) {
                getImageCoverImage().setData(thumbImg);
                getImageBlockTxtNate().setData( thumbImg + ";" + getImageBlockTxtNate().toString() );
            }

            //2018 네이버 미디어 벌크
            getImageVideoBlockXml2().concat(String.format("<media type=\"mp4\" href=\"%s_%d.mp4\" cover_img=\"%s\" position=\"%d\"/>\r\n",
                    getTotalId(), ovpIndex + 1, thumbImg, ovpIndex + 1));

            //2018 우얄라 영상 커버는 이미지벌크에 추가
            naverOvpImgList.append(String.format("<image caption_content=\"\" href=\"%s\"/>\r\n", thumbImg));

            final String videoUrl = BulkBrightCoveUtil.getVideoUrl(bulkConfiguration.getBrightCoveConfig(), accessToken, ovp.getAssetId());
            if( McpString.isNullOrEmpty(videoUrl)) {
                slackMessageService.sendSms("BulkDumpOvp", totalVo.logError(String.format("브라이트코브 API 요청 에러 totalId=[%s] [%s] AssetId=[%s]", getTotalId(), getTitle(), ovp.getAssetId())));
                return false;
            }
            log.trace(" BrightCove getVideoUrl Success {}", videoUrl);

            ovp.setVideoUrl(videoUrl);
            ovp.setVideoId(getTotalId().toString());
            getImageVideoBlockTxt().setData(getTotalId() + ".mp4");
            setBulkYn("YYY");

            ovpIndex++;
        }

        //2018-09-14 우얄라 영상만 존재하고 기사내 이미지가 없을 경우 <image> 태그 삽입 안하면 네이버에서 오류 발생
        //영상만 존재할 경우엔 커버이미지를 <image> 태그로 넣어준다
        if( getImageBlockXmlNaver().isEmpty()) {
            getImageBlockXmlNaver().setData( naverOvpImgList.toString() );
        }

        return true;
    }

    private static final Pattern PATTERN_ContentTag_daumVod = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id[^>].*?>(\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumPhotoBundle = Pattern.compile("<div class=\"tag_photobundle\">(\\s)*<img.*?>(\\s)*</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumImg = Pattern.compile("<(\\s*?)img.[^>]+>", Pattern.CASE_INSENSITIVE);
    public void processContentDaumBefore(Map<String, String> daumVideoMap, Map<String, String> daumVideoKakaoTvMap,
            Map<String, String> daumPhotoBundleMap, Map<String, String> daumImageMap) {
        //카카오다음 전용변수(m_content_html_ig_daum)
        String contentHtmlDaum = getContentHtml().toString()
                                                 .replaceAll("(?i)<!--@img_tag_s@-->.*?<!--@img_tag_e@-->", "");

        // 카카오 다음을 처리하면서 내부에는 getContentHtml caption 도 처리한다.
        getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule(getContentHtml().toString(), "<p class=\"caption\">", "</p>"));

        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<(\\s*?)/(\\s*?)div(\\s*?)><(\\s*?)div(\\s*?)class=\"tag_vod\"", "</div>\r\n<div class=\"tag_vod\"" );

        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumVod, contentHtmlDaum, "daumvod_", daumVideoMap);
        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<div class=\"tag_vod\".*?</div>", "" ); //동영상 제외

        //사운드Cloud 안내메시지 제거
        contentHtmlDaum = contentHtmlDaum.replaceAll("위\\s*재생.+다.", "" ); //동영상 제외

        //미리보는 오늘 증시/날씨 다음카카오 제거 by sean 2016-09-08 - http://pms.joins.com/task/view_task.asp?tid=13574  /////////////////////////////////////////////////
        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<(\\s)*div(\\s)*class(\\s)*=(\\s)*([\"'])ab_life([\"'])(\\s)*>.*?<(\\s)*/table.*?/table.*?/table.*?./(\\s)*div(\\s)*>", "" );

        //ab_table 컴포넌트 태그제거
        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<table(\\s)*class(\\s)*=(\\s)*([\"'])ab_table([\"'])(\\s)*>.*?<(\\s)*/table(\\s)*>", "" );

        //카카오TV팟 <iframe> 태그를 치환 정보구성 by sean - 2016-07-29
        contentHtmlDaum = BulkTagUtil.markingKakaoTVPodcast(contentHtmlDaum, daumVideoKakaoTvMap);

        //다음카카오 이미지묶음 케이스(tag_photobundle)
        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumPhotoBundle, contentHtmlDaum, "tag_photobundle", daumPhotoBundleMap);

        //다음카카오 이미지정렬 태그 치환정보 구성 2016-08-02 by sean.
        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumImg, contentHtmlDaum, "ab_photo", daumImageMap);

        contentHtmlDaum = BulkTagUtil.ripTagWithOrderRule( contentHtmlDaum, "<p class=\"caption\">", "</p>");

        getContentHtmlDaum().setData(contentHtmlDaum);
    }

    private static final Pattern PATTERN_ContentTag_daumVodNaverCast = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"navercast[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumVodKakaoTv = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"kakaotv[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumVodYouTube = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(http.*?youtube.*?))\"(?:\\s*?)data-service=\"youtube[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumVodOvp = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"(ovp|ooyala)[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    public void processContentDaumAfter(Map<String, String> daumVideoMap, Map<String, String> daumVideoKakaoTvMap, Map<String, String> daumPhotoBundleMap, Map<String, String> daumImageMap) {
        // 다음기사에 QA인 경우 줄바뀜 추가 2016-02-05 지창현
        String contentHtmlDaum = getContentHtmlDaum().toString();
        if( contentHtmlDaum.contains("\r\n<strong>Q :")) {
            contentHtmlDaum = contentHtmlDaum.replace("\r\n<strong>Q :", "\r\n\r\n<strong>Q :");
        }

        contentHtmlDaum = BulkTagUtil.strip(contentHtmlDaum).trim();

        // region 다음카카오 TV팟, tag_photobundle 처리
        // 카카오 TV팟 <iframe> 태그구간 원본치환
        for( Map.Entry<String, String> entry : daumVideoKakaoTvMap.entrySet() ){
            contentHtmlDaum = contentHtmlDaum.replace(entry.getKey(), entry.getValue());
        }

        //다음카카오 이미지정렬(tag_photobundle)  케이스
        for( Map.Entry<String, String> entry : daumPhotoBundleMap.entrySet() ){
            contentHtmlDaum = contentHtmlDaum.replace( entry.getKey(), entry.getValue().replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }

        //다음카카오 이미지정렬 원래 태그로 치환 ///////////////////////////////////////////////////////////////////////////////////////
        contentHtmlDaum = processContentDaum_imageTagReplace( contentHtmlDaum, daumImageMap);

        boolean isOnceDaumTagReplace = true;
        for( Map.Entry<String, String> entry : daumVideoMap.entrySet() ){
            final String daumVideoKey = entry.getKey();
            final String daumVideoStr = entry.getValue();

            // 네이버 cast 삭제
            if( PATTERN_ContentTag_daumVodNaverCast.matcher(daumVideoStr).find() ) {
                contentHtmlDaum = contentHtmlDaum.replace(daumVideoKey, "");
                continue;
            }

            // 카카오 TV
            Matcher matcherKakaoTv = PATTERN_ContentTag_daumVodKakaoTv.matcher(daumVideoStr);
            if( matcherKakaoTv.find()) {
                contentHtmlDaum = contentHtmlDaum.replace(daumVideoKey, String.format("<iframe src=\"%s\"></iframe>", matcherKakaoTv.group("url")));
                continue;
            }

            // YouTube
            Matcher matcherYouTube = PATTERN_ContentTag_daumVodYouTube.matcher(daumVideoStr);
            if( matcherYouTube.find()) {
                contentHtmlDaum = contentHtmlDaum.replace(daumVideoKey, String.format("<iframe src=\"%s\" allowfullscreen=\"true\"></iframe>", matcherYouTube.group("url")));
                continue;
            }

            // ovp
            Matcher matcherOvp = PATTERN_ContentTag_daumVodOvp.matcher(daumVideoStr);
            if( matcherOvp.find()){
                if (!isOnceDaumTagReplace) {
                    contentHtmlDaum = contentHtmlDaum.replace(daumVideoKey, "");
                } else {
                    isOnceDaumTagReplace = false;
                    setOvpArticle( true );
                    contentHtmlDaum = contentHtmlDaum.replace(daumVideoKey, String.format("<video controls><source src=\"%s.mp4\" type=\"video/mp4\"></video>", getTotalId().toString()));
                }
            }
        }

        contentHtmlDaum = contentHtmlDaum.replace("<여기를 누르시면 크게 보실 수 있습니다>", "")
                                         .replace("▷여기를 누르시면 크게 보실 수 있습니다", "");

        //다음 아티클 개선 style 적용 by sean 2016-08-31 - http://pms.joins.com/task/view_task.asp?tid=13408  ////////////////
        //다음은 전체태그가 제거되므로 div,span class=dim 에 태그를 제외한 CMS 입력 템플릿을 <br /> 그대로 사용한다.
        //CMS CK 에디터 템플릿에서 <br><br> 두번을 지정해줘야 <br /> 이 입력되는 특이사항 발생. 2016-09-01 jerome speech.
        contentHtmlDaum = contentHtmlDaum.replace("■", "\r\n\r\n■")
                                         .replace("「", "\r\n「")
                                         .replace("」", "」\r\n\r\n");
        //다음 아티클 개선 style 적용 by sean 2016-08-31 - http://pms.joins.com/task/view_task.asp?tid=13408  ////////////////

        getContentHtmlDaum().setData(contentHtmlDaum);
    }

    public String processContentDaum_imageTagReplace( String contentHtmlDaum, Map<String, String> daumPhotoBundleMap) {
        //다음카카오 이미지정렬(tag_photobundle)  케이스
        for( Map.Entry<String, String> entry : daumPhotoBundleMap.entrySet() ){
            contentHtmlDaum = contentHtmlDaum.replace( entry.getKey(), entry.getValue().replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }
        return contentHtmlDaum;
    }

    public void processContentTag_ab_ds_timeline() {
        final String contentHtml = getContentHtml().toString();
        if(!contentHtml.contains("ab_ds_timeline"))
            return;

        // timeline 아티클 처리 미리 처리
        Document document = Jsoup.parseBodyFragment(contentHtml);
        document.outputSettings().prettyPrint(false);
        Element body = document.body();
        for(Element elementTimeLine : body.getElementsByClass("ab_ds_timeline") ){
            String innerHtml = elementTimeLine.html().replace("<!-- 사진, 영상이 있을때 chat_box_photo 추가 -->", "");
            innerHtml = BulkTagUtil.replaceTag(innerHtml, "h2", "b");
            innerHtml = BulkTagUtil.replaceTag(innerHtml, "strong", "b");
            innerHtml = BulkTagUtil.replaceHTMLSpecialChars(innerHtml, "div,img,b,br");
            elementTimeLine = elementTimeLine.html(innerHtml);

            for( Element elementSub : elementTimeLine.getElementsByClass("ab_photo")){
                BulkJsoupUtil.removeNotElement( elementSub );
            }

            for (Element elementSub : elementTimeLine.getElementsByClass("timeline_box")) {
                elementSub.html( "\r\n" + elementSub.html() + "\r\n");

                for( Element elementData : elementSub.getElementsByClass("date") ) {
                    elementData.html( "■" + elementData.html())
                               .attr("style", "position:relative;margin-top:17px;margin-bottom:16px;padding-top:15px;padding-bottom:14px;border-top:1px solid #444446;border-bottom:1px solid #ebebeb;color:#3e3e40;font-size:20px;line-height:1.5;width:100%;");
                }
                for( Element elementData : elementSub.getElementsByClass("ad_go_article")){
                    BulkJsoupUtil.removeNotElement( elementData );
                }

                for( Element elementData : elementSub.getElementsByClass("timeline_box_content")){
                    for( Element elementChat : elementData.getElementsByClass("chat_profile")) {
                        for( Element elementChatSub : elementChat.getElementsByClass("time_profile_img")){
                            BulkJsoupUtil.remove( elementChatSub, true );
                            elementChatSub.attr("style", "color:rgb(166,152,134);line-height:1.5;font-size:14px;margin-bottom:1px;");
                        }

                        for( Element elementChatSub : elementChat.getElementsByClass("time_profile")){
                            elementChatSub.attr("style", "color:rgb(166,152,134);line-height:1.5;font-size:14px;margin-bottom:1px;");
                        }
                    }
                }
            }
        }
        getContentHtml().setData(body.html());
    }
}

