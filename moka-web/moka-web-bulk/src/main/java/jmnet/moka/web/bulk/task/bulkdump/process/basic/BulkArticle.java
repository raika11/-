package jmnet.moka.web.bulk.task.bulkdump.process.basic;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvTarget;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsMMDataVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkTagUtil;
import jmnet.moka.web.bulk.util.BulkUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.basic
 * ClassName : BulkArticle
 * Created : 2020-12-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-29 029 오후 2:48
 */
@Getter
@Setter
public abstract class BulkArticle implements Serializable {
    private static final long serialVersionUID = -5366226728536193452L;

    protected Map<String, MapString> dataMap = new HashMap<>();

    private final BulkDumpTotalVo bulkDumpTotal;
    private BulkDumpEnvTarget bulkDumpEnvTarget;

    private Date insDt;
    private String sourceCode;
    private String targetCode;

    private String imageBulkFlag = "";
    private String bulkSendSite = "";
    private String bulkDelSite = "";
    private String bulkYn;

    private String frstCode; // 대구분카테고리(PortDB 기준) 그러나 현재는 사용안하는 것으로 확인

    private boolean isOvpArticle = false;

    private final MapString iud = MapString.newMapString( dataMap, "{_IUD_}");
    private final MapString iud2 = MapString.newMapString( dataMap, "{_IUD2_}");
    private final MapString iud3 = MapString.newMapString( dataMap, "{_IUD3_}");

    private final MapString yy = MapString.newMapString( dataMap, "{_YY_}");
    private final MapString mm = MapString.newMapString( dataMap, "{_MM_}");
    private final MapString dd = MapString.newMapString( dataMap, "{_DD_}");
    private final MapString hh = MapString.newMapString( dataMap, "{_HH_}");
    private final MapString nn = MapString.newMapString( dataMap, "{_NN_}");
    private final MapString ss = MapString.newMapString( dataMap, "{_SS_}");
    private final MapString insertDate = MapString.newMapString( dataMap, "{_INSERTDATE_}");

    private final MapString totalId = MapString.newMapString( dataMap, "{_AID_}");
    private final MapString totalId10 = MapString.newMapString( dataMap, "{_AID10_}");

    private final MapString media1 = MapString.newMapString( dataMap, "{_M1_}");
    private final MapString media2 = MapString.newMapString( dataMap, "{_M2_}");
    private final MapString media3 = MapString.newMapString( dataMap, "{_M3_}");
    private final MapString mediaFullName = MapString.newMapString( dataMap, "{_MFN_}");

    private final MapString contCode1 = MapString.newMapString( dataMap, "{_C1_}");
    private final MapString contCode2 = MapString.newMapString( dataMap, "{_C2_}");
    private final MapString contCode3 = MapString.newMapString( dataMap, "{_C3_}");

    private final MapString orgSourceCode = MapString.newMapString( dataMap, "{_ORG_SRC_}");

    private final MapString title = MapString.newMapString( dataMap, "{_TTL_}");
    private final MapString subTitle = MapString.newMapString( dataMap, "{_STTL_}");
    private final MapString artReporter = MapString.newMapString( dataMap, "{_REPT_}");
    private final MapString artReporterDaum = MapString.newMapString( dataMap, "{_REPT_DAUM_}");
    private final MapString artReporterNaver = MapString.newMapString( dataMap, "{_REPT_NAVER_}");
    private final MapString email = MapString.newMapString( dataMap, "{_MAIL_}");
    private final MapString artReporterWithEmail = MapString.newMapString( dataMap, "{_REPT_EMAIL_}");

    private final MapString relatedArticles = MapString.newMapString(dataMap, "{_RELATED_ARTICLES_}");
    private final MapString relatedNewsDaum = MapString.newMapString(dataMap, "{_REL_NEWS_DAUM_}");
    private final MapString relatedNewsZum = MapString.newMapString(dataMap, "{_REL_NEWS_ZUM_}");

    private final MapString contentText = MapString.newMapString( dataMap, "{_CONTTXT_}");
    private final MapString contentHtml = MapString.newMapString( dataMap, "{_CONTHTML_}");
    private final MapString contentHtmlMs = MapString.newMapString( dataMap, "{_CONTH_MS_}");
    private final MapString contentHtmlEx4 = MapString.newMapString( dataMap, "{_CONTH_EX4_}");
    private final MapString contentHtmlCyworld = MapString.newMapString( dataMap, "{_CONTH_CYWORLD_}");
    private final MapString contentHtmlNate = MapString.newMapString( dataMap, "{_CONTH_NATE_}");
    private final MapString contentHtmlDaum = MapString.newMapString( dataMap, "{_CONTH_DAUM_}");
    private final MapString contentHtmlZum = MapString.newMapString( dataMap, "{_CONTH_ZUM_}");
    private final MapString contentHtmlNaver = MapString.newMapString( dataMap, "{_CONTH_NAVER_}");

    private final MapString imageBlockTxt2 = MapString.newMapString( dataMap, "{_TXT_IMG_BLK2_}");
    private final MapString imageBlockTxtNate = MapString.newMapString( dataMap, "{_TXT_IMG_BLK_NATE_}");
    private final MapString imageBlockXml = MapString.newMapString( dataMap, "{_XML_IMG_BLK_}");
    private final MapString imageBlockXmlEx = MapString.newMapString( dataMap, "{_XML_IMG_BLK_EX_}");
    private final MapString imageBlockXml2 = MapString.newMapString( dataMap, "{_XML_IMG_BLK2_}");
    private final MapString imageBlockXml3 = MapString.newMapString( dataMap, "{_XML_IMG_BLK3_}");
    private final MapString imageBlockXml4 = MapString.newMapString( dataMap, "{_XML_IMG_BLK4_}");
    private final MapString imageBlockXmlNaver = MapString.newMapString( dataMap, "{_XML_IMG_BLK_NAVER_}");
    private final MapString imageBlockXmlZum = MapString.newMapString( dataMap, "{_XML_IMG_BLK_ZUM_}");

    private final MapString imageCoverImage = MapString.newMapString( dataMap, "{_XML_IMG_COVER_}");

    private final MapString imageVideoBlockTxt = MapString.newMapString( dataMap, "{_VIDEO_TXT_BLK_}");
    private final MapString imageVideoBlockXml2 = MapString.newMapString( dataMap, "{_XML_IMG_VIDEO_BLK2_}");

    private final MapString serviceurl = MapString.newMapString( dataMap, "{_URL_}");
    private final MapString addr = MapString.newMapString( dataMap, "{_ADDR_}");
    private final MapString lat = MapString.newMapString( dataMap, "{_LAT_}");
    private final MapString lng = MapString.newMapString( dataMap, "{_LNG_}");

    private final MapString myun = MapString.newMapString( dataMap, "{_MN_}");
    private final MapString pan = MapString.newMapString( dataMap, "{_PN_}");
    private final MapString pressDate = MapString.newMapString( dataMap, "{_PRESS_DATE_}");
    private final MapString pressCategory = MapString.newMapString( dataMap, "{_MC_}");

    private final MapString contentType = MapString.newMapString( dataMap, "{_CT_}");

    private final MapString naverMyun = MapString.newMapString( dataMap, "{_NAVER_MN_}");
    private final MapString naverPan = MapString.newMapString( dataMap, "{_NAVER_PN_}");
    private final MapString naverPosition = MapString.newMapString( dataMap, "{_NAVER_POSITION_}");
    private final MapString naverBreakingNewsId = MapString.newMapString( dataMap, "{_NAVER_PUSHID_}");
    private final MapString naverBreakingNewsGrade = MapString.newMapString( dataMap, "{_NAVER_PUSHGRADE_}");
    private final MapString naverBreakingNewsTitle = MapString.newMapString( dataMap, "{_NAVER_PUSHTITLE_}");
    private final MapString naverBreakingNewsDate = MapString.newMapString( dataMap, "{_NAVER_PUSHDATE_}");
    private final MapString naverBreakingNewsTime = MapString.newMapString( dataMap, "{_NAVER_PUSHTIME_}");
    private final MapString naverOnTheSceneReporting = MapString.newMapString( dataMap, "{_NAVER_SITE_}");

    private List<BulkDumpNewsMMDataVo> bulkDumpNewsMMDataList;
    private List<BulkDumpNewsMMDataVo> bulkDumpNewsImageList;
    private List<BulkDumpNewsMMDataVo> bulkDumpNewsVideoList;

    public boolean hasImageList() {
        if( this.bulkDumpNewsImageList == null )
            return false;
        return this.bulkDumpNewsImageList.size() > 0;
    }

    public boolean hasVideoList() {
        if( this.bulkDumpNewsVideoList == null )
            return false;
        return this.bulkDumpNewsVideoList.size() > 0;
    }

    public BulkArticle(BulkDumpTotalVo bulkDumpTotal) {
        this.bulkDumpTotal = bulkDumpTotal;

        setInsDt( bulkDumpTotal.getInsDt() );
        this.sourceCode = bulkDumpTotal.getSourceCode();
        this.targetCode = bulkDumpTotal.getTargetCode();

        this.iud.setData( bulkDumpTotal.getIud() );
        if( bulkDumpTotal.getTotalId() != null )
            this.totalId.setData( bulkDumpTotal.getTotalId().toString());

        if( this.targetCode != null ) {
            if (!this.targetCode.startsWith("JT")) {
                this.totalId10.setData(String.format("%010d", bulkDumpTotal.getTotalId()));
            }
        }

        if (this.iud.toString().equals("I"))
        {
            this.iud2.setData("N");
            this.iud3.setData("C");
        }
        else
        {
            this.iud2.setData(this.iud.getData());
            this.iud3.setData(this.iud.getData());
        }

        this.yy.setData(McpDate.dateStr(getInsDt(), "yyyy"));
        this.mm.setData(McpDate.dateStr(getInsDt(), "MM"));
        this.dd.setData(McpDate.dateStr(getInsDt(), "dd"));
        this.hh.setData(McpDate.dateStr(getInsDt(), "HH"));
        this.nn.setData(McpDate.dateStr(getInsDt(), "mm"));
        this.ss.setData(McpDate.dateStr(getInsDt(), "ss"));

        this.insertDate.setData( McpDate.dateStr(getInsDt(), "yyyy-MM-dd HH:mm:ss"));
    }

    public void processBulkDumpNewsVo(BulkDumpNewsVo newsVo, List<BulkDumpNewsMMDataVo> bulkDumpNewsMMDataList) {
        this.bulkDumpNewsMMDataList = bulkDumpNewsMMDataList;
        if( bulkDumpNewsMMDataList == null )
            return;
        this.bulkDumpNewsImageList = bulkDumpNewsMMDataList.stream().filter( data -> data.getMultiType().equals("HP") ).collect( Collectors.toList());
        this.bulkDumpNewsVideoList = bulkDumpNewsMMDataList.stream().filter( data -> data.getMultiType().equals("MF") ).collect( Collectors.toList());
    }

    private static final Pattern PATTERN_getContentImages = Pattern.compile("<(\\s*?)img(?<entry>.*?)>", Pattern.CASE_INSENSITIVE);
    public List<Map<String,String>> processContent_getImages() {
        List<Map<String,String>> images = new ArrayList<>();
        Matcher matcher = PATTERN_getContentImages.matcher(getContentHtml().toString());
        while( matcher.find() ) {
            final String imageTag = matcher.group(2);
            Map<String,String>data = new HashMap<>();
            data.put( "src", imageTag.replaceAll( "(?i).*src(\\s*?)=(\\s*?)\"(?<entry>.*?)\".*","$3"));
            data.put( "alt", imageTag.replaceAll( "(?i).*alt(\\s*?)=(\\s*?)\"(?<entry>.*?)\".*","$3"));
            images.add(data);
        }
        return images;
    }

    public void processTitle_clearTag() {
        // 태그 벗겨내기 - 제목
        getTitle().setData(BulkTagUtil.standardBulkClearingTag(getTitle().toString()));
        getSubTitle().setData(BulkTagUtil.standardBulkClearingTag(getSubTitle().toString()));
    }

    public void processContent_restoreSpecialHtmlTagForContent() {
        // HTML 버전도 치환되었던것들 되돌리기 위해서(<br> 태그 \n 개행으로 변환처리포함)
        getContentHtml().setData(getContentHtml().toString()
                .replace("&amp;", "&")
                .replace("&amp", "&")
                .replace("&nbsp;", " ")
                .replace("&nbsp", " ")
                .replace("&quot;", "\"")
                .replace("&quot", "\"")
                .replace("&#35;", "#")
                .replace("&#44;", "`")
                .replace("&#045;&#045;", "--")
                .replace("&#40;", "(")
                .replace("&#41;", ")")
                .replace("&#92;", "\"")
                .replace("&#59;", ";")
                .replace("&#47;*", "/*")
                .replace("*&#47;", "*/")
                .replace("&#039;", "'")
                .replace("&#39;", "'")
                .replace("&#039", "'")
                .replace("&#39", "'")
                .replace("<br>", "\r\n")
                .replace("<br/>", "\r\n")
                .replace("<br/ >", "\r\n"));
    }

    public void processContentTag_tag_interview() {
        if (getContentHtml().contains("<div class=\"tag_interview\">")) {
            getContentHtml().replaceAll("(?i)<div class=\"tag_question\">(?<question>.*?)</div>", "\r\n<strong>Q : $1</strong>\r\n");
            getContentHtml().replaceAll("(?i)<div class=\"tag_answer\">(?<answer>.*?)</div>", "<strong>A :</strong> $1");
        }
    }

    public void processContentTag_ab_related_article() {
        //아티클개선 관련기사 태그제거(공통) by sean 2016-09-02 - http://pms.joins.com/task/view_task.asp?tid=13408  /////////////////////////////////////////////////
        //관련기사 <div class="ab_related_article">.....<div> 제거
        if (getContentHtml().contains("ab_related_article")) {
            getContentHtml().replaceAll("(?i)<(\\s)*div(\\s)*class(\\s)*=(\\s)*([\"'])ab_related_article([\"'])(\\s)*>.*?hd.*?bd.*?ul.*?/ul.(\\s)*<(\\s)*/(\\s)*div>(\\s)*<(\\s)*/(\\s)*div>", "");
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

    private static final Pattern PATTERN_ContentTag_daumVod = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id[^>].*?>(\\s*?)</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumKakaoTv = Pattern.compile("<iframe.*?src=(.)http://videofarm.daum.net/controller/video/viewer/Video.html.*?</iframe>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumPhotoBundle = Pattern.compile("<div class=\"tag_photobundle\">(\\s)*<img.*?>(\\s)*</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumImg = Pattern.compile("<(\\s*?)img.[^>]+>", Pattern.CASE_INSENSITIVE);
    public void processContentDaumBefore(Map<String, String> daumVideoMap, Map<String, String> daumVideoKakaoTvMap,
            Map<String, String> daumPhotoBundleMap, Map<String, String> daumImageMap) {
        //카카오다음 전용변수(m_content_html_ig_daum)
        String contentHtmlDaum = getContentHtml().toString()
                                                 .replaceAll("(?i)<!--@img_tag_s@-->.*?<!--@img_tag_e@-->", "")
                                                 .replaceAll("(?i)<p class=\"caption\">", "</p>");

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
    private static final Pattern PATTERN_ContentTag_daumVodOvp = Pattern.compile("<(?:\\s*?)div(?:\\s*?)class=\"tag_vod\".*?data-id=\"(?<url>(.*?))\"(?:\\s*?)data-service=\"(ovp|ooyala)[^>]+>(?:\\s*?)</div>", Pattern.CASE_INSENSITIVE );
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
}
