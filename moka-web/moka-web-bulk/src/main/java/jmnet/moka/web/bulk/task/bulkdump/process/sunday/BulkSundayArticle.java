package jmnet.moka.web.bulk.task.bulkdump.process.sunday;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkArticle;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsMMDataVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkTagUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.sunday
 * ClassName : BulkSundayArticle
 * Created : 2021-01-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-27 027 오후 5:40
 */
@Getter
@Setter
@Slf4j
public class BulkSundayArticle extends BulkArticle {
    private static final long serialVersionUID = -2455995939257659019L;

    public BulkSundayArticle(TotalVo<BulkDumpTotalVo> totalVo) {
        super(totalVo);
    }

    private static Pattern PATTERN_OnlyArtReporterName = Pattern.compile("^[가-힣]*?\\s[a-zA-z].*?@[a-zA-z]", Pattern.CASE_INSENSITIVE);
    public String getOnlyArtReporterName( String artReporterName ) {
        if( PATTERN_OnlyArtReporterName.matcher( artReporterName ).find() )
            return artReporterName.split(" ")[0];
        return artReporterName;
    }

    @SuppressWarnings("DuplicatedCode")
    @Override
    public void processBulkDumpNewsVo(BulkDumpNewsVo newsVo, List<BulkDumpNewsMMDataVo> bulkDumpNewsMMDataList) {
        super.processBulkDumpNewsVo(newsVo, bulkDumpNewsMMDataList);

        getTotalId().setData(newsVo.getContentId());

        getContCode1().setData(newsVo.getContCode1());
        getContCode2().setData(newsVo.getContCode2());
        getContCode3().setData(newsVo.getContCode3());

        getTitle().setData(newsVo.getTitle());
        getSubTitle().setData(newsVo.getSubTitle());

        //author 컬럼에 기자명_이메일 주소인경우 분리 (안효성 hyoza@joongang.co.kr)
        getArtReporter().setData( getOnlyArtReporterName( newsVo.getArtReporter()));
        if (!newsVo.getEmail().isEmpty()) {
            getEmail().setData(newsVo.getEmail());
        }

        getContentHtml().setData(newsVo.getContent());

        getServiceurl().setData(newsVo.getServiceUrl());
        setImageBulkFlag(newsVo.getImageBulkFlag());
        setBulkDelSite(newsVo.getDelSite());
        setBulkSendSite(newsVo.getBulkSite()); // 전송매체 리스트  "1:네이버", "2:다음", "3:네이트", "4:줌", "9:기타"

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

        if( !McpString.isNullOrEmpty(newsVo.getPressCategory()) && !McpString.isNullOrEmpty(newsVo.getMyun()) ) {
            String strSectionCode = "T";
            switch (newsVo.getPressCategory()){
                case "W5" : strSectionCode = "T"; break;
                case "W6" : strSectionCode = "V"; break;
                case "W7" : strSectionCode = "U"; break;
            }
            String myun = newsVo.getMyun();
            if(myun.charAt(0) == '0') {
                myun = myun.substring(1);
            }
            getNaverMyun().setData( strSectionCode.concat(myun));
        }

        //지면발행일자 처리
        try {
            // procedure 에서 pressdate 정보를 받지 않았기 때문에 무조건 exception 이 날 것으로 추정
            Date date = McpDate.date("yyyyMMdd", getPressDate().toString());
            getPressDate().setData(McpDate.dateStr(date, "yyyy-MM-dd"));
        }catch ( Exception e ){
            //예외시 출고일자지정(협의됨)
            getPressDate().setData(McpDate.dateStr(getInsDt(), "yyyy-MM-dd") );
        }
    }

    public void processContent_clearTag() {
        // 태그 벗겨내기 - 제목
        getTitle().setData(BulkTagUtil.standardBulkClearingTag(getTitle().toString()));
        getSubTitle().setData(BulkTagUtil.standardBulkClearingTag(getSubTitle().toString()));

        // HTML 버전도 치환되었던것들 되돌리기 위해서(<br> 태그 \n 개행으로 변환처리포함)
        String contentHtml = getContentHtml().toString();
        contentHtml = BulkTagUtil.restoreSpecialHtmlTag2(contentHtml);
        contentHtml = BulkTagUtil.ripTagWithOrderRule( contentHtml, "<div class=\"tag_pictorial\" ", "</div>"); //화보 제외
        contentHtml = BulkTagUtil.ripTagWithOrderRule( contentHtml, "<div class=\"tag_vod\" ", "</div>"); //동영상 제외
        contentHtml = BulkTagUtil.ripTagWithOrderRule( contentHtml, "<div class=\"tag_audio\" ", "</div>"); //오디오 제외
        contentHtml = BulkTagUtil.ripTagWithOrderRule( contentHtml, "<div class=\"tag_poll\" ", "</div>"); //투표 제외
        contentHtml = BulkTagUtil.ripTagWithOrderRule( contentHtml, "<div class=\"tag_sns\" ", "</div>"); //sns 제외
        contentHtml = contentHtml.replaceAll("(?i)<div(\\s*?)class=[^a]+ab_photo[^c]+center+[^>]+>","<div class=\"ab_photo photo_center\">");
        contentHtml = BulkTagUtil.restoreSpecialHtmlTag(contentHtml);
        contentHtml = contentHtml.replaceAll("(?i)src(.)*=(.)*(['\"])/component/", "src=$3http://sunday.joins.com/component/")
                                 .replaceAll("(?i)src(.)*=(.)*(['\"])/_data/", "src=$3http://sunday.joins.com/_data/");
        contentHtml = BulkTagUtil.fullOutlinkBulkTag(contentHtml);

        getContentText().setData( BulkTagUtil.standardBulkClearingTag(contentHtml));

        contentHtml = BulkTagUtil.ripTagWithOrderRule( contentHtml, "<p class=\"caption\">", "</p>");

        getContentHtml().setData(contentHtml);
    }

    private static final Pattern PATTERN_ContentTag_daumPhotoBundle = Pattern.compile("<div class=\"tag_photobundle\">(\\s)*<img.*?>(\\s)*</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumImg = Pattern.compile("<div(\\s*?)(.*?)(\\bab_photo\\sphoto_(center|left|right)\\b)[^>]+>(\\s*?)(.*?)<div(\\s*?)(.*?)(\\bimage\\b)[^>]+>(\\s*?)(.*?)<img[^>]+>(\\s*?)(.*?)</div>(\\s*?)(.*?)</div>", Pattern.CASE_INSENSITIVE);
    @SuppressWarnings("DuplicatedCode")
    public void processContentDaum() {
        Map<String, String> daumPhotoBundleMap = new HashMap<>();
        Map<String, String> daumImageMap = new HashMap<>();

        //카카오다음 전용변수(m_content_html_ig_daum)
        String contentHtmlDaum = getContentHtml().toString()
                                                 .replaceAll("(?i)<!--@img_tag_s@-->.*?<!--@img_tag_e@-->", "")
                                                 .replaceAll("(?i)<p class=\"caption\">", "</p>");

        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<(\\s*?)/(\\s*?)div(\\s*?)><(\\s*?)div(\\s*?)class=\"tag_vod\"", "</div>\r\n<div class=\"tag_vod\"" );

        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<div class=\"tag_vod\".*?</div>", "" ); //동영상 제외

        //사운드Cloud 안내메시지 제거
        contentHtmlDaum = contentHtmlDaum.replaceAll("위\\s*재생.+다.", "" ); //동영상 제외

        //미리보는 오늘 증시/날씨 다음카카오 제거 by sean 2016-09-08 - http://pms.joins.com/task/view_task.asp?tid=13574  /////////////////////////////////////////////////
        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<(\\s)*div(\\s)*class(\\s)*=(\\s)*([\"'])ab_life([\"'])(\\s)*>.*?<(\\s)*/table.*?/table.*?/table.*?./(\\s)*div(\\s)*>", "" );

        //ab_table 컴포넌트 태그제거
        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<table(\\s)*class(\\s)*=(\\s)*([\"'])ab_table([\"'])(\\s)*>.*?<(\\s)*/table(\\s)*>", "" );

        //다음카카오 이미지묶음 케이스(tag_photobundle)
        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumPhotoBundle, contentHtmlDaum, "tag_photobundle", daumPhotoBundleMap);

        //다음카카오 이미지정렬 태그 치환정보 구성 2016-08-02 by sean.
        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumImg, contentHtmlDaum, "ab_photo", daumImageMap);

        contentHtmlDaum = BulkTagUtil.ripTagWithOrderRule( contentHtmlDaum, "<img", ">");
        contentHtmlDaum = BulkTagUtil.ripTagWithOrderRule( contentHtmlDaum, "<p class=\"caption\">", "</p>");

        if( contentHtmlDaum.contains("\r\n<strong>Q :")) {
            contentHtmlDaum = contentHtmlDaum.replace("\r\n<strong>Q :", "\r\n\r\n<strong>Q :");
        }

        contentHtmlDaum = BulkTagUtil.strip(contentHtmlDaum).trim();

        //다음카카오 이미지정렬(tag_photobundle)  케이스
        for (String photoBundleKey : daumPhotoBundleMap.keySet()) {
            contentHtmlDaum = contentHtmlDaum.replace( photoBundleKey, daumPhotoBundleMap.get(photoBundleKey).replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }

        //다음카카오 이미지정렬 원래 태그로 치환 ///////////////////////////////////////////////////////////////////////////////////////
        contentHtmlDaum = processContentDaum_imageTagReplace( contentHtmlDaum, daumImageMap);

        contentHtmlDaum = contentHtmlDaum.replace("<여기를 누르시면 크게 보실 수 있습니다>", "")
                                         .replace("▷여기를 누르시면 크게 보실 수 있습니다", "");

        contentHtmlDaum = contentHtmlDaum.replace("■", "\r\n\r\n■")
                                         .replace("「", "\r\n「")
                                         .replace("」", "」\r\n\r\n");
        //다음 아티클 개선 style 적용 by sean 2016-08-31 - http://pms.joins.com/task/view_task.asp?tid=13408  ////////////////

        getContentHtmlDaum().setData(contentHtmlDaum);
    }

    public String processContentDaum_imageTagReplace( String contentHtmlDaum, Map<String, String> daumImageMap) {
        //다음카카오 이미지정렬(tag_photobundle)  케이스
        for (String photoBundleKey : daumImageMap.keySet()) {
            contentHtmlDaum = contentHtmlDaum.replace( photoBundleKey, daumImageMap.get(photoBundleKey).replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }
        return contentHtmlDaum;
    }

    public void processContentNaverXml(String contentHtml) {
        //네이버 제공용 xml 2014.02.10
        //네이버 아티클 개선 style 적용 by sean 2016-08-30 - http://pms.joins.com/task/view_task.asp?tid=13408  ////////////////
        //http://dev.static.joins.com/html/ui/joongangilbo/article_module.html
        //http://dev.news.joins.com/article/20080100 -- aid:19631136

        String contentNaver = contentHtml
                .replace("http://ir.joins.com/?u=", "")
                .replace("&w=550", "")
                    //< !--아티클 공통: 박스 기사 -가운데 사진(네이버)-- >
                .replaceAll("(?i)<div class(\\s)*=(\\s)*([\"'])ab_box_article(\\s)*([\"'])(\\s)*>",
                        "<div class=\"ab_box_article\" style=\"padding-top: 17px; padding-bottom: 16px; position: relative;\">")
                .replaceAll("(?i)<div class(\\s)*=(\\s)*([\"'])ab_box_inner([\"'])(\\s)*>",
                        "<div class=\"ab_box_inner\" style=\"padding:42px 20px 24px; border: 1px solid rgb(221, 221, 221); border-image: none; overflow: hidden;\">")
                .replaceAll("(?i)<div class(\\s)*=(\\s)*([\"'])ab_box_title([\"'])(\\s)*>",
                        "<div class=\"ab_box_title\" style=\"color: rgb(93, 129, 195); line-height: 1.5; font-size: 20px; margin-bottom: 17px;\">")
                .replaceAll("(?i)<span class(\\s)*=(\\s)*([\"'])ab_box_bullet([\"'])(\\s)*>",
                        "<span class=\"ab_box_bullet\" style=\"background: rgb(93, 129, 195); left: 20px; top: 12px; width: 18px; height: 28px; overflow: hidden; display: block; position: absolute;\">")
                .replaceAll("(?i)<div class(\\s)*=(\\s)*([\"'])ab_box_titleline([\"'])(\\s)*>",
                        "<div class=\"ab_box_titleline\" style=\"font-weight:bold;\">")
                .replaceAll("(?i)<div class(\\s)*=(\\s)*([\"'])ab_box_content([\"'])(\\s)*>",
                        "<div class=\"ab_box_content\" style=\"color: rgb(60, 62, 64); line-height: 1.8; font-size: 16px;\">")
                    //div,span class=\"dim\" 태그 없애기
                .replaceAll("(?i)<div class(\\s)*=(\\s)*([\"'])dim([\"'])(\\s)*.*?</div>", "")
                .replaceAll("(?i)<span class(\\s)*=(\\s)*([\"'])dim([\"'])(\\s)*.*?</span>", "")
                //ab_sub_heading
                .replaceAll("(?i)<div class(\\s)*=(\\s)*([\"'])ab_sub_heading([\"'])(\\s)*>",
                        "<div class=\"ab_sub_heading\" style=\"position:relative;margin-top:17px;margin-bottom:16px;padding-top:15px;padding-bottom:14px;border-top:1px solid #444446;border-bottom:1px solid #ebebeb;color:#3e3e40;font-size:20px;line-height:1.5;\">")
                .replaceAll("(?i)<div class(\\s)*=(\\s)*([\"'])ab_sub_headingline([\"'])(\\s)*>",
                "<div class=\"ab_sub_headingline\" style=\"font-weight:bold;\">")
                .replaceAll("<(\\s)*iframe(\\s)*class(\\s)*=(\\s)*\"ab_map\".*?<(\\s)*/(\\s)*iframe(\\s)*>", "")
                .replaceAll("<span(\\s)*class(\\s)*=(\\s)*([\"'])btn_enlarge([\"'])(\\s)*>.*?.icon.*?<(\\s)*/(\\s)*span>.*?.<(\\s)*/(\\s)*span>", "");

        getContentHtml().setData(contentNaver);
        getContentHtmlNaver().setData(BulkTagUtil.ripTag(contentNaver, "<!--@img_tag_s@-->", "<!--@img_tag_e@-->"));
    }

    @SuppressWarnings("DuplicatedCode")
    public void processContent_ImageBulkYn() {
        for( BulkDumpNewsMMDataVo image : getBulkDumpNewsImageList() ) {
            final String imgSrc = image.getUrl();
            final String imgDesc = image.getDescription();
            final String imgName = FilenameUtils.getName(image.getUrl());

            if( "Y".equals(image.getImageBulkFlag()) ) {
                getImageBlockXml().concat("<images>\r\n");
                getImageBlockXml().concat("\t<imageurl><![CDATA[" + imgSrc + "]]></imageurl>\r\n");
                getImageBlockXml().concat("\t<description><![CDATA[" + imgDesc + "]]></description>\r\n");
                getImageBlockXml().concat("</images>\r\n");

                getImageBlockXmlEx().concat("<images>\r\n");
                getImageBlockXmlEx().concat("\t<imageurl><![CDATA[" + imgName + "]]></imageurl>\r\n");
                getImageBlockXmlEx().concat("\t<description><![CDATA[" + imgDesc + "]]></description>\r\n");
                getImageBlockXmlEx().concat("</images>\r\n");

                getImageBlockXml2().concat("<IMG>\r\n");
                getImageBlockXml2().concat("\t<URL><![CDATA[" + imgSrc + "]]></URL>\r\n");
                getImageBlockXml2().concat("\t<TITLE><![CDATA[" + imgDesc + "]]></TITLE>\r\n");
                getImageBlockXml2().concat("</IMG>\r\n");

                getImageBlockTxt2().addDelimiterConcat(imgSrc, ";");

                final String naverDesc = BulkTagUtil.specialHtmlTag(imgDesc.replace( "\"", "" ));
                getImageBlockXmlNaver().concat(String.format("<image href=\"%s\" caption_content=\"%s\"/>\r\n", imgSrc, naverDesc));
            }
            else {
                //개별이미지, 아티클 박스유형 패턴 검색 및 본문삭제
                final String findImagePattern = "(?i)(<div[^>]+>)(\\s)*(<div\\s+[^>]+>)(\\s)*(<img[^>]+" + imgName + "[^>]+>)(\\s)*(<span[^>]+>(\\w)*(\\s)*</span>)(\\s)*(</div>)(\\s)*(<p[^>]+>(\\w)*(\\s)*</p>)?(\\s)*(</div>)";
                processContent_replaceAll( findImagePattern, "" );

                // 이미지번들(묶음) 전송 포함
                //                <div class="tag_photobundle">
                //                    <img alt="스토닉의 &amp;#39;통통한 엉덩이&amp;#39;. 윤정민 기자" caption="스토닉의 &amp;#39;통통한 엉덩이&amp;#39;. 윤정민 기자" index="0" iscoverimage="false" link="" linktarget="" src="http://pds.joins.com/news/component/htmlphoto_mmdata/201707/26/0782da2f-6233-45a8-a6a2-d5822041a48a.jpg" wrappercss="photo_center" wrapperwidth="580px"/>
                //                    <img alt="스토닉의 &amp;#39;통통한 엉덩이&amp;#39;. 윤정민 기자" caption="스토닉의 &amp;#39;통통한 엉덩이&amp;#39;. 윤정민 기자" index="1" iscoverimage="false" link="" linktarget="" src="http://pds.joins.com/news/component/htmlphoto_mmdata/201707/26/6dab7e6a-35b0-4532-a06b-c5989851c9d6.jpg" wrappercss="photo_center" wrapperwidth="580px"/>
                //                </div>
                final String findImagePattern2 = "(?i)(<img[^>]+" + imgName + "[^>]+(\\s)*>)";
                processContent_replaceAll( findImagePattern2, "" );
            }
        }

        //<div class="ab_box_article">.....</div> 아티클 빈박스 지우기
        final String emptyBoxDelPattern = "<div(\\s*)class.*\\bab_box_article\\b[^>]+>(\\s*)<div[^>]+>(\\s*)<div[^>]+>.*<span[^>]+>(\\s*)</span>(\\s*)<div(\\s*)class.*\\bab_box_titleline\\b[^>]+>[^>]+>[^>]+>(\\s*)<div(\\s*)class.*\\bab_box_content\\b[^>]+>(\\s*)(&nbsp;(\\s*)<br/>)?(\\s*)</div>[^/div>]+/div>(\\s*)[^/div]+/div>";
        processContent_replaceAll( emptyBoxDelPattern, "" );
    }
}
