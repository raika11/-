package jmnet.moka.web.bulk.task.bulkdump.process.joongang;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkArticle;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkTagUtil;
import jmnet.moka.web.bulk.util.BulkUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;

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
@Getter
@Setter
@Slf4j
public class BulkJoongangArticle extends BulkArticle {
    private static final long serialVersionUID = 3365048610646802498L;

    public BulkJoongangArticle(BulkDumpTotalVo bulkDumpTotal) {
        super(bulkDumpTotal);
    }

    @Override
    public void processBulkDumpNewsVo(BulkDumpNewsVo newsVo) {
        getTotalId().setData(newsVo.getTotalId());
        getTotalId10().setData(String.format("%010d", BulkUtil.parseInt(newsVo.getTotalId())));
        getTotalId11().setData(String.format("%011d", BulkUtil.parseInt(newsVo.getTotalId())));

        getOrgSourceCode().setData(newsVo.getOrgSourceCode());
        getMedia1().setData(newsVo.getDep());
        getContCode1().setData(newsVo.getContCode1());
        getContCode2().setData(newsVo.getContCode2());
        getContCode3().setData(newsVo.getContCode3());

        setFrstCode(newsVo.getFrstCode());

        getTitle().setData(newsVo.getTitle());
        getSubTitle().setData(newsVo.getSubTitle());
        getArtReporter().setData(newsVo.getArtReporter());

        if (!McpString.isNullOrEmpty(newsVo.getEmail())) {
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

        getNaverBreakingNewsGrade().setData(newsVo.getBreakingNews());
        getNaverBreakingNewsId().setData(newsVo.getBreakingNewsCnt());
        if( !McpString.isNullOrEmpty(newsVo.getBreakingNewsCnt()) && newsVo.getBreakingNewsCnt().equals("0")) {
            if( !McpString.isNullOrEmpty(newsVo.getBreakingNews())) {
                getNaverBreakingNewsGrade().setData("0");
            }
            getNaverBreakingNewsTitle().setData("<![CDATA[" + newsVo.getTitle().trim() + "]]>");
            getNaverBreakingNewsDate().setData(McpDate.dateStr(getInsDt(), "yyyy-MM-dd"));
            getNaverBreakingNewsTime().setData(McpDate.dateStr(getInsDt(), "HH:mm:ss"));
        }
        else
            getNaverBreakingNewsId().setData("");

        getNaverOnTheSceneReporting().setData(newsVo.getOnTheSceneReporting());
    }

    public void processMediaFullName() {
        switch(getTargetCode().substring(getTargetCode().length()-1)){
            case "A":
                getMediaFullName().setData("중앙일보::속보");
                break;
            case "E":
                getMediaFullName().setData("중앙일보::문화/연예");
                break;
            case "F":
                getMediaFullName().setData("중앙일보::정보과학");
                break;
            case "G":
                getMediaFullName().setData("중앙일보::스포츠");
                break;
            case "I":
                getMediaFullName().setData("중앙일보::경제");
                break;
            case "C":
                getMediaFullName().setData("중앙일보::풍향계");
                break;
            default:
                getMediaFullName().setData("중앙일보");
                break;
        }
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
            getContentHtml().setData( getContentHtml().toString().replaceAll(chartPattern, "<img alt=\"\" src=\"$1\"/>") );
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
            final String photofixPattern = "(?i)<div(\\s*?)class=\"ab_photofix\">.*?background-image:url\\('(?<src>.*?)'.*?<p class=\"caption\">(?<alt>.*?)</p></div>";
            getContentHtml().setData(getContentHtml().toString().replaceAll(photofixPattern, "<img alt=\"$3\" src=\"$2\"/>" ));
        }
    }

    public void processContent_etcLevel1() {
        //2019-05-09 <hr><hr> 더보기 제거
        getContentHtml().setData( getContentHtml().toString().replace("<hr><hr>", ""));

        //2016.01.14 by song
        getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule( getContentHtml().toString(), "<div class=\"tag_pictorial\" ", "</div>")); //화보 제외
        getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule( getContentHtml().toString(), "<div class=\"tag_poll\" ", "</div>")); //투표 제외
        getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule( getContentHtml().toString(), "<div class=\"tag_sns\" ", "</div>")); //sns 제외

        //2020.03.18
        getContentHtml().setData(BulkTagUtil.ripTagWithOrderRule( getContentHtml().toString(), "<div class=\"htmlTag\" ", "</div>")); //htmltag 파티클 제외

        getContentHtml().setData( getContentHtml().toString().replace("pds.joinsmsn.com", "pds.joins.com"));
    }

    public void processContentTag_ab_people() {
        if( getContentHtml().toString().contains("ab_people")) {
            final String peoplePattern = "(?i)<div(\\s *?)class.{1,5}(\\bab_people\\b)[^>]+>(\\s*?)(.*?)<div(\\s*?)class.{1,5}(\\bab_people_hd\\b)[^>]+>(\\s*?)(.*?)</div>(\\s*?)(.*?)<div(\\s*?)class.{1,5}(\\bab_people_bd\\b)[^>]+>(\\s*?)(.*?)</div>(\\s*?)(.*?)</div>";
            getContentHtml().setData(getContentHtml().toString().replaceAll(peoplePattern, "" ));
        }
    }

    public void processContent_etcLevel2() {
        if (getContentHtml().toString().contains("<a style=\"display:none\"")) {
            getContentHtml().setData(getContentHtml().toString().replace("<a style=\"display:none\"", "<a "));
        }
        if (getContentHtml().toString().contains("Copyright(C) JTBC Contents Hub. All rights reserved.")) {
            getContentHtml().setData(getContentHtml().toString().replace("Copyright(C) JTBC Contents Hub. All rights reserved.", "").trim() + "\r\n");
        }
    }

    public void processContent_contentHtmlMs() {
        // `12.10.13 이승인 : ms 용은 xxx 의 블로그가 없어야 하므로 추가
        getContentHtmlMs().setData(BulkTagUtil.standardBulkClearingTag(getContentHtml().toString()));
        if (McpString.isNullOrEmpty(getContentHtmlMs().toString())) {
            getContentHtmlMs().setData(".");
        }
    }

    public void processReporter() {
        if( McpString.isNullOrEmpty(getEmail().toString())){
            getArtReporterWithEmail().setData(getArtReporter().toString());
        }
        else{
            getArtReporterWithEmail().setData( getArtReporter().toString() + "(" + getEmail().toString() + ")");
        }

        if( McpString.isNullOrEmpty(getArtReporter().toString())){
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

        if( getContentHtml().toString().contains("quiz_question_screen_open")) {
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
                        quizText.append(matcherQuestion.group("seq"))
                                .append(matcherQuestion.group("question"))
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

    public void processContentTag_tag_interview() {
        if (getContentHtml().toString().contains("<div class=\"tag_interview\">")) {
            getContentHtml().setData(getContentHtml().toString().replaceAll("(?i)<div class=\"tag_question\">(?<question>.*?)</div>", "\r\n<strong>Q : $1</strong>\r\n") );
            getContentHtml().setData(getContentHtml().toString().replaceAll("(?i)<div class=\"tag_answer\">(?<answer>.*?)</div>", "<strong>A :</strong> $1") );
        }
    }

    public void processContentTag_ab_related_article() {
        //아티클개선 관련기사 태그제거(공통) by sean 2016-09-02 - http://pms.joins.com/task/view_task.asp?tid=13408  /////////////////////////////////////////////////
        //관련기사 <div class="ab_related_article">.....<div> 제거
        if (getContentHtml().toString().contains("ab_related_article")) {
            getContentHtml().setData(getContentHtml().toString().replaceAll("(?i)<(\\s)*div(\\s)*class(\\s)*=(\\s)*([\"'])ab_related_article([\"'])(\\s)*>.*?hd.*?bd.*?ul.*?/ul.(\\s)*<(\\s)*/(\\s)*div>(\\s)*<(\\s)*/(\\s)*div>", "") );
        }
    }

    public void processImageBulkFlag() {
        // 벌크이미지 사용 안할 경우 본문 이미지묶음 삭제
        // 2016-07-07 본문 이미지 묶음 div 제거
        if( getImageBulkFlag().equals("N") ) {
            getContentHtml().setData(
                getContentHtml().toString().replaceAll("(?i)<div class=\"image\">.*?</div>", "")
                                .replaceAll("(?i)<div class=\"tag_photobundle\">.*?</div>", "")
            );

            while ( getContentHtml().toString().startsWith("\r\n") )
                getContentHtml().setData( getContentHtml().toString().substring("\r\n".length()));
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

        for( String imgMapKey : imgMap.keySet() ) {
            contentHtmlCyworld = contentHtmlCyworld.replace( imgMapKey, imgMap.get(imgMapKey).replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
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

        for( String imgMapKey : imgMap.keySet() ) {
            contentHtmlNate = contentHtmlNate.replace( imgMapKey, imgMap.get(imgMapKey).replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }

        contentHtmlNate = "<b>" + getSubTitle().toString() + "</b>\r\n\r\n" + contentHtmlNate.trim();

        for( String videoMapKey : videoMap.keySet() ) {
            log.info(videoMap.get(videoMapKey));
            contentHtmlNate = contentHtmlNate.replace( videoMapKey,
                    videoMap.get(videoMapKey).replaceAll(
                            "(?i)<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(http.+youtube.+))\"(?:\\s*?)data-service=\"youtube[^>]+>(?:\\s*?)</div>",
                            "<iframe src=\"$1\" width=\"605\" height=\"339\" allowfullscreen=\"true\"></iframe>"));
        }

        getContentHtmlNate().setData( contentHtmlNate);
    }

    private static final Pattern PATTERN_ContentTag_daumVod = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id[^>].*?>(\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumKakaoTv = Pattern.compile("<iframe.*?src=(.)http://videofarm.daum.net/controller/video/viewer/Video.html.*?</iframe>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumPhotoBundle = Pattern.compile("<div class=\"tag_photobundle\">(\\s)*<img.*?>(\\s)*</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumImg = Pattern.compile("<(\\s*?)img.[^>]+>", Pattern.CASE_INSENSITIVE);
    public void processContentDaumBefore(Map<String, String> daumvideoMap, Map<String, String> daumVideoKakaoTvMap,
            Map<String, String> daumPhotoBundleMap, Map<String, String> daumImageMap) {
        //카카오다음 전용변수(m_content_html_ig_daum)
        String contentHtmlDaum = getContentHtml().toString()
                                                 .replaceAll("(?i)<!--@img_tag_s@-->.*?<!--@img_tag_e@-->", "")
                                                 .replaceAll("(?i)<p class=\"caption\">", "</p>");

        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<(\\s*?)/(\\s*?)div(\\s*?)><(\\s*?)div(\\s*?)class=\"tag_vod\"", "</div>\r\n<div class=\"tag_vod\"" );

        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumVod, contentHtmlDaum, "daumvod_", daumvideoMap);
        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<div class=\"tag_vod\".*?</div>", "" ); //동영상 제외

        //사운드Cloud 안내메시지 제거
        contentHtmlDaum = contentHtmlDaum.replaceAll("위\\s*재생.+다.", "" ); //동영상 제외

        //미리보는 오늘 증시/날씨 다음카카오 제거 by sean 2016-09-08 - http://pms.joins.com/task/view_task.asp?tid=13574  /////////////////////////////////////////////////
        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<(\\s)*div(\\s)*class(\\s)*=(\\s)*([\"'])ab_life([\"'])(\\s)*>.*?<(\\s)*/table.*?/table.*?/table.*?./(\\s)*div(\\s)*>", "" );

        //ab_table 컴포넌트 태그제거
        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<table(\\s)*class(\\s)*=(\\s)*([\"'])ab_table([\"'])(\\s)*>.*?<(\\s)*/table(\\s)*>", "" );

        //카카오TV팟 <iframe> 태그를 치환 정보구성 by sean - 2016-07-29
        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumKakaoTv, contentHtmlDaum, "mark_kakao_tv_podcast_", daumVideoKakaoTvMap);

        //다음카카오 이미지묶음 케이스(tag_photobundle)
        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumPhotoBundle, contentHtmlDaum, "tag_photobundle", daumPhotoBundleMap);

        //다음카카오 이미지정렬 태그 치환정보 구성 2016-08-02 by sean.
        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumImg, contentHtmlDaum, "ab_photo", daumImageMap);

        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<p class=\"caption\">.*?</p>","");

        getContentHtmlDaum().setData(contentHtmlDaum);
    }

    private static final Pattern PATTERN_ContentTag_daumVodNaverCast = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"navercast[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumVodKakaoTv = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"kakaotv[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumVodYouTube = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(http.*?youtube.*?))\"(?:\\s*?)data-service=\"youtube[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumVodOoyala = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"(ovp|ooyala)[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    public void processContentDaumAfter(Map<String, String> daumVideoMap, Map<String, String> daumVideoKakaoTvMap, Map<String, String> daumPhotoBundleMap, Map<String, String> daumImageMap) {
        // 다음기사에 QA인 경우 줄바뀜 추가 2016-02-05 지창현
        String contentHtmlDaum = getContentHtmlDaum().toString();
        if( contentHtmlDaum.contains("\r\n<strong>Q :")) {
            contentHtmlDaum = contentHtmlDaum.replace("\r\n<strong>Q :", "\r\n\r\n<strong>Q :");
        }

        contentHtmlDaum = contentHtmlDaum.replaceAll("[<][a-zA-Z/](.|\n)*?[>]", "");

        // region 다음카카오 TV팟, tag_photobundle 처리
        // 카카오 TV팟 <iframe> 태그구간 원본치환
        for (String kakaoTvKey : daumVideoKakaoTvMap.keySet()) {
            contentHtmlDaum = contentHtmlDaum.replace(kakaoTvKey, daumVideoKakaoTvMap.get(kakaoTvKey));
        }

        //다음카카오 이미지정렬(tag_photobundle)  케이스
        for (String photoBundleKey : daumPhotoBundleMap.keySet()) {
            contentHtmlDaum = contentHtmlDaum.replace( photoBundleKey, daumPhotoBundleMap.get(photoBundleKey).replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }

        //다음카카오 이미지정렬 원래 태그로 치환 ///////////////////////////////////////////////////////////////////////////////////////
        for (String daumImageKey : daumImageMap.keySet()) {
            contentHtmlDaum = contentHtmlDaum.replace( daumImageKey, daumImageMap.get(daumImageKey).replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }

        boolean isOnceDaumTagReplace = true;
        for( String daumVideoKey : daumVideoMap.keySet() ){
            final String daumVideoStr = daumVideoMap.get(daumVideoKey);

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
            Matcher matcherOvp = PATTERN_ContentTag_daumVodOoyala.matcher(daumVideoStr);
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
        //다음은 전체태그가 제거되므로 div,span class=dim에 태그를 제외한 CMS입력 템플릿을 <br /> 그대로 사용한다.
        //CMS CK에디터 템플릿에서 <br><br> 두번을 지정해줘야 <br /> 이 입력되는 특이사항 발생. 2016-09-01 jerome speech.
        contentHtmlDaum = contentHtmlDaum.replace("■", "\r\n\r\n■")
                                         .replace("「", "\r\n「")
                                         .replace("」", "」\r\n\r\n");
        //다음 아티클 개선 style 적용 by sean 2016-08-31 - http://pms.joins.com/task/view_task.asp?tid=13408  ////////////////

        getContentHtmlDaum().setData(contentHtmlDaum);
    }

    // ssc Sapark 패턴 수정..
    private static final Pattern PATTERN_ContentTag_zumVod = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id[^>].*?>(\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_zumVodNaverCast = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"navercast[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_zumVodKakaoTv = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"kakaotv[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_zumVodYouTube = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(http.*?youtube.*?))\"(?:\\s*?)data-service=\"youtube[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_zumVodOoyala = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"(ovp|ooyala)[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    public void processContentZum() {
        // zum 전용변수(m_content_html_zum) - 정보구성
        String contentHtmlZum = getContentHtml().toString().replaceAll("(?i)<(\\s*?)/(\\s*?)div(\\s*?)><(\\s*?)div(\\s*?)class=\"tag_vod\"", "</div>\r\n<div class=\"tag_vod\"");

        Map<String, String> videoMap = new HashMap<>();
        contentHtmlZum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_zumVod, contentHtmlZum, "zum_vod_", videoMap );

        for( String videoKey : videoMap.keySet() ) {
            final String videoStr = videoMap.get(videoKey);
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
            Matcher matcherOvp = PATTERN_ContentTag_zumVodOoyala.matcher(videoStr);
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
    private static final Pattern PATTERN_ContentTag_naverAdboxArticle = Pattern.compile("(?<abBoxArticleDA><div(\\s*)class.{1,5}(\\bab_box_article\\sab_division\\s(division_center|division_left|division_right)\\b)[^>])+>(\\s*)(.*?)(?<abBoxInner><div(\\s*)(.*?)(\\bab_box_inner\\b)[^>])+>(\\s*)(.*?)(?<abBoxTitle><div(\\s*)class.{1,5}(\\bab_box_title\\b)[^>])+>(\\s*)(.*?)(?<abBoxBullet><span(\\s*)class.{1,5}(\\bab_box_bullet\\b)[^>])+>", Pattern.CASE_INSENSITIVE );
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
                .replaceAll("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(http.*?youtube.*?))\"(?:\\s*?)data-service=\"youtube[^>]+>(?:\\s*?)</div>", "");

        //네이버TV
        contentNaver = contentNaver.replaceAll("(?i)<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(https://.+))\"(?:\\s*?)data-service=\"navercast[^>]+>(?:\\s*?)</div>",
                "<iframe src=\"$1\" allowfullscreen=\"true\"></iframe>");

        //네이버 멀티 우얄라 영상 포지셔닝 2018-08-16
        Matcher matcherOvp = PATTERN_ContentTag_naverVodOoyala.matcher(contentNaver);
        int naverOvpCount = 1;
        while( matcherOvp.find() ) {
            log.info( "group {}", matcherOvp.group() );
            contentNaver = StringUtils.replaceOnce(contentNaver, matcherOvp.group(),  String.format("<!-- naver_news_vod_%d -->", naverOvpCount++));
        }

        contentNaver = BulkTagUtil.ripTagWithOrderRule(contentNaver, "<div class=\"tag_audio\"", "</div>"); //오디오 제외

        // e 글중심 (정규식 그룹캡처) 구현시작
//        Matcher matcherAdBox = PATTERN_ContentTag_naverAdboxArticle.matcher(contentNaver);
//        if (matcherAdBox.find()) {
//
//        }


        /*
        #region
        try
        {
            string ab_egul_pattern = @"(?<ab_box_article_d_a><div(\s*)class.{1,5}(\bab_box_article\sab_division\s(division_center|division_left|division_right)\b)[^>])+>(\s*)(.*?)(?<ab_box_inner><div(\s*)(.*?)(\bab_box_inner\b)[^>])+>(\s*)(.*?)(?<ab_box_title><div(\s*)class.{1,5}(\bab_box_title\b)[^>])+>(\s*)(.*?)(?<ab_box_bullet><span(\s*)class.{1,5}(\bab_box_bullet\b)[^>])+>";
            var regex_ab_egul_heading = new Regex(ab_egul_pattern, RegexOptions.IgnorePatternWhitespace | RegexOptions.ExplicitCapture | RegexOptions.Singleline);
            Match ab_egul_match = regex_ab_egul_heading.Match(strNaverContent);
            if (ab_egul_match.Success)
            {
                //<span class="dim" style="display: none;">■</span> 유형 전부 지우기 - 아티클박스 관련 전부 지운다.
                string spandim_pattern = @"(?<spandim><span(\s*?)class=""(\bdim\b)[^>] +>.</span>)";
                var regex_spandim = new Regex(spandim_pattern, RegexOptions.IgnorePatternWhitespace | RegexOptions.ExplicitCapture | RegexOptions.Singleline);
                strNaverContent = m_util.RegexReplaceGroup(regex_spandim, strNaverContent, "spandim", string.Empty);

                string divdim_pattren = @"(?<divdim><div(\s *?)class=""(\bdim\b)[^>] +>(\s*?)(.*?)</div>)";
                var regex_divdim = new Regex(divdim_pattren, RegexOptions.IgnorePatternWhitespace | RegexOptions.ExplicitCapture | RegexOptions.Singleline);
                strNaverContent = m_util.RegexReplaceGroup(regex_divdim, strNaverContent, "divdim", string.Empty);

                string ab_box_article_d_a = ab_egul_match.Groups["ab_box_article_d_a"].Value;
                string ab_box_inner = ab_egul_match.Groups["ab_box_inner"].Value;
                string ab_box_title = ab_egul_match.Groups["ab_box_title"].Value;
                string ab_box_bullet = ab_egul_match.Groups["ab_box_bullet"].Value;

                //match 텍스트만 변환하여 strNaverContent 변환 출력처리
                strNaverContent = regex_ab_egul_heading.Replace(strNaverContent, m =>
                {
                    string[] parms = new string[4];
                    parms[0] = string.Concat(ab_box_article_d_a, " style=\"padding-bottom:16px;line-height:26px;letter-spacing:0px;font-family:돋움,dotum,sans-serif;\">");
                    parms[1] = string.Concat(ab_box_inner, " style=\"padding:24px 20px 0px;border:1px solid rgb(221,221,221);border-image:none;overflow:hidden;clear:both;\" >");
                    parms[2] = string.Concat(ab_box_title, " style=\"color:rgb(166,152,134);line-height:1.5;font-size:14px;margin-bottom:1px;\">");
                    parms[3] = string.Concat(ab_box_bullet, " style=\"display:none;\">");
                    return string.Format("{0}{1}{2}{3}", parms);
                });

                //<div class="dim" 영역이 다시 생기는 케이스가 있어 예외처리.
                strNaverContent = m_util.RegexReplaceGroup(regex_spandim, strNaverContent, "spandim", string.Empty);
                strNaverContent = m_util.RegexReplaceGroup(regex_divdim, strNaverContent, "divdim", string.Empty);

                string titleline_pattern = @"<div(\s*?)(.*?)(\bab_box_article\sab_division\s(division_center|division_left|division_right)\b)[^>]+>(.*?)(?<ab_box_titleline><div(\s *?)class=""(\bab_box_titleline\b)[^>] +>)(\s*?)(.*?)</div>";
                var regex_titleline = new Regex(titleline_pattern, RegexOptions.IgnorePatternWhitespace | RegexOptions.ExplicitCapture);
                strNaverContent = m_util.RegexReplaceGroup(regex_titleline, strNaverContent, "ab_box_titleline",
                    "<div class=\"ab_box_titleline\" style=\"font-weight:bold;\">"); //div 앞의 < 부분은 캡처하지 않고 처리(앞단까지 정규식으로 잡으면 정규식이 너무 길어서 가독성 떨어짐.....)

                ////article_box 요소 중 나머지 태그(ab_box_content|ab_sub_heading|ab_sub_headingline|ab_quotation) 처리
                string ab_box_pattern = @"<div(\s*)(.*?)(\bab_box_article\sab_division\s(division_center|division_left|division_right)\b)[^>]+>(\s*)(.*?)(\bab_box_inner\b)(\s*)(.*?)(\bab_box_title\b)(\s*)(.*?)(\bab_box_bullet\b)(\s*)(.*?)<div(\s*)(.*?)(\bab_box_titleline\b)(\s*)(.*?)(?<ab_box_content><div(\s*?)(.*?)(\bab_box_content\b)[^>]+>)(\s*?)(.*?)(?<ab_sub_heading><div(\s*?)(.*?)(\bab_sub_heading\b)[^>]+>)(\s*?)(.*?)(?<ab_sub_headingline><div(\s*?)(.*?)(\bab_sub_headingline\b)[^>]+>)(\s*?)(.*?)(?<tag_quotation><div(\s*)(.*?)(\btag_quotation\b)[^>]+>)";
                var regex_abbox = new Regex(ab_box_pattern, RegexOptions.IgnorePatternWhitespace | RegexOptions.ExplicitCapture | RegexOptions.Singleline);
                strNaverContent = m_util.RegexReplaceGroup(regex_abbox, strNaverContent, "ab_box_content",
                    "<div class=\"ab_box_content\" style=\"color:rgb(60,62,64);line-height:20px;font-size:14px;\">");
                strNaverContent = m_util.RegexReplaceGroup(regex_abbox, strNaverContent, "ab_sub_heading",
                    "<div class=\"ab_sub_heading\" style=\"color:rgb(35,31,32);line-height:1.5;font-size:16px;margin-bottom:15px;position:relative;\">");
                strNaverContent = m_util.RegexReplaceGroup(regex_abbox, strNaverContent, "ab_sub_headingline",
                    "<div class=\"ab_sub_headingline\" style=\"color:rgb(60, 62, 64);font-weight:bold;\">");
                strNaverContent = m_util.RegexReplaceGroup(regex_abbox, strNaverContent, "tag_quotation",
                    "<div class=\"tag_quotation\" style=\"padding:22px 0px;color:rgb(115,116,117);line-height:28px;letter-spacing:-0.07em;font-size:13px;position:relative;\">");
            }
        }
        catch (Exception r1)
        {
            m_log.Write(string.Format("{ab_box_artlce_division} occured error: {0}", r1.Message));
        }
        #endregion
         */
        // log.info(contentNaver);
    }
}

