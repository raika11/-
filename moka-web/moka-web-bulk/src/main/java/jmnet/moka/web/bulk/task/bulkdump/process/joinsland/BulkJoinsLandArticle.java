package jmnet.moka.web.bulk.task.bulkdump.process.joinsland;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkArticle;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsMMDataVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkTagUtil;
import jmnet.moka.web.bulk.util.BulkUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.joinsland
 * ClassName : JoinsLandArticle
 * Created : 2021-02-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-05 005 오후 9:20
 */

@SuppressFBWarnings("VA_FORMAT_STRING_USES_NEWLINE")
@SuppressWarnings("DuplicatedCode")
@Getter
@Setter
@Slf4j
public class BulkJoinsLandArticle extends BulkArticle {
    private static final long serialVersionUID = 7072577554956318080L;

    public BulkJoinsLandArticle(TotalVo<BulkDumpTotalVo> totalVo) {
        super(totalVo);
    }

    @Override
    public void processBulkDumpNewsVo(BulkDumpNewsVo newsVo, List<BulkDumpNewsMMDataVo> bulkDumpNewsMMDataList) {
        super.processBulkDumpNewsVo(newsVo, bulkDumpNewsMMDataList);

        /// Joinsland 는 HP MF 와 같은 타입이 없이 모두 다 이미지이다.
        setBulkDumpNewsImageList(bulkDumpNewsMMDataList);

        getTotalId().setData(newsVo.getContentId());
        getTotalId10().setData(String.format("%010d", BulkUtil.parseInt(newsVo.getContentId())));

        getContCode1().setData(newsVo.getContCode1());
        getContCode2().setData("000");
        getContCode3().setData("000");

        getTitle().setData(newsVo.getTitle().trim());
        getArtReporter().setData(newsVo.getArtReporter().trim());

        if ( newsVo.getEmail() != null && !newsVo.getEmail().isEmpty()) {
            getEmail().setData(newsVo.getEmail().trim());
        }

        getContentHtml().setData(newsVo.getContent().trim());
        getServiceurl().setData(newsVo.getServiceUrl().trim());
    }

    public void processMediaFullName() {
        getMediaFullName().setData("중앙일보 조인스랜드");
    }

    public void processContent_clearTag() {
        // 태그 벗겨내기 - 제목
        getTitle().setData(BulkTagUtil.standardBulkClearingTag(getTitle().toString()));
        String contentHtml = getContentHtml().toString();
        contentHtml = BulkTagUtil.restoreSpecialHtmlTag(contentHtml);
        contentHtml = BulkTagUtil.outLinkBulkClearingTagEx(contentHtml);
        getContentHtml().setData(contentHtml);

        getContentText().setData( BulkTagUtil.standardBulkClearingTag(contentHtml));

        getContentHtmlNaver().setData(contentHtml);
    }

    private static final Pattern PATTERN_ContentTag_daumPhotoBundle = Pattern.compile("<div class=\"tag_photobundle\">(\\s)*<img.*?>(\\s)*</div>", Pattern.CASE_INSENSITIVE );
    private static final Pattern PATTERN_ContentTag_daumImg = Pattern.compile("<div(\\s*?)(.*?)(\\bab_photo\\sphoto_(center|left|right)\\b)[^>]+>(\\s*?)(.*?)<div(\\s*?)(.*?)(\\bimage\\b)[^>]+>(\\s*?)(.*?)<img[^>]+>(\\s*?)(.*?)</div>(\\s*?)(.*?)</div>", Pattern.CASE_INSENSITIVE);
    private static final Pattern PATTERN_ContentTag_daumGeneralImg = Pattern.compile("<div[^>]+>(\\s*?)(.*?)<img.*?>(\\s*?)(.*?)</div>", Pattern.CASE_INSENSITIVE);
    public void processContentDaum() {
        //네이버 제공용 xml 2014.02.10
        //<!--@img_tag_s@--><!--@img_tag_e@-->에서 <img >만 존치 2014.02.10

        String contentHtmlDaum = getContentHtml().toString();

        //미리보는 오늘 증시/날씨 다음카카오 제거 by sean 2016-09-08 - http://pms.joins.com/task/view_task.asp?tid=13574  /////////////////////////////////////////////////
        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<(\\s)*div(\\s)*class(\\s)*=(\\s)*([\"'])ab_life([\"'])(\\s)*>.*?<(\\s)*/table.*?/table.*?/table.*?./(\\s)*div(\\s)*>", "" );

        //ab_table 컴포넌트 태그제거
        contentHtmlDaum = contentHtmlDaum.replaceAll("(?i)<table(\\s)*class(\\s)*=(\\s)*([\"'])ab_table([\"'])(\\s)*>.*?<(\\s)*/table(\\s)*>", "" );

        //카카오TV팟 <iframe> 태그를 치환 정보구성 by sean - 2016-07-29
        Map<String, String> daumVideoKakaoTvMap = new HashMap<>();
        contentHtmlDaum = BulkTagUtil.markingKakaoTVPodcast(contentHtmlDaum, daumVideoKakaoTvMap);

        //다음카카오 이미지묶음 케이스(tag_photobundle)
        Map<String, String> daumPhotoBundleMap = new HashMap<>();
        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumPhotoBundle, contentHtmlDaum, "tag_photobundle", daumPhotoBundleMap);

        //다음카카오 이미지정렬 태그 치환정보 구성 2016-08-02 by sean.
        Map<String, String> daumImageMap = new HashMap<>();
        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumImg, contentHtmlDaum, "ab_photo", daumImageMap);

        //부동산랜드에서 사용하는 일반이미지 형식
        Map<String, String> daumGeneralImageMap = new HashMap<>();
        contentHtmlDaum = BulkTagUtil.getMatchesMarkTagList(PATTERN_ContentTag_daumGeneralImg, contentHtmlDaum, "", daumGeneralImageMap);

        contentHtmlDaum = BulkTagUtil.ripTagWithOrderRule( contentHtmlDaum, "<img", ">");
        contentHtmlDaum = BulkTagUtil.ripTagWithOrderRule( contentHtmlDaum, "<p class=\"caption\">", "</p>");

        //다음기사에 QA인 경우 줄바뀜 추가 2016-02-05 지창현
        if( contentHtmlDaum.contains("\r\n<strong>Q :")) {
            contentHtmlDaum = contentHtmlDaum.replace("\r\n<strong>Q :", "\r\n\r\n<strong>Q :");
        }

        //이후 HTML 모든태그를 제거함
        contentHtmlDaum = BulkTagUtil.strip(contentHtmlDaum);

        // region 다음카카오 TV팟, tag_photobundle 처리
        // 카카오 TV팟 <iframe> 태그구간 원본치환
        for( Map.Entry<String, String> entry : daumVideoKakaoTvMap.entrySet() ) {
            contentHtmlDaum = contentHtmlDaum.replace(entry.getKey(), entry.getValue());
        }

        //다음카카오 이미지정렬(tag_photobundle)  케이스
        for( Map.Entry<String, String> entry : daumPhotoBundleMap.entrySet() ){
            contentHtmlDaum = contentHtmlDaum.replace( entry.getKey(), entry.getValue().replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }

        //원래 img 태그로 치환
        for( Map.Entry<String, String> entry : daumGeneralImageMap.entrySet() ){
            contentHtmlDaum = contentHtmlDaum.replace( entry.getKey(), entry.getValue());
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

    private String processContentDaum_imageTagReplace(String contentHtmlDaum, Map<String, String> daumImageMap) {
        //다음카카오 이미지정렬(tag_photobundle)  케이스
        for( Map.Entry<String, String> entry : daumImageMap.entrySet() ){
            contentHtmlDaum = contentHtmlDaum.replace( entry.getKey(), entry.getValue().replaceAll(" alt=(\"기사 이미지\")", " alt=\"\""));
        }
        return contentHtmlDaum;
    }

    public void processContent_ImageBulkYn() {
        for( BulkDumpNewsMMDataVo image : getBulkDumpNewsImageList() ) {
            final String imgSrc = image.getUrl();
            final String imgDesc = image.getDescription();
            final String imgName = image.getUrl().lastIndexOf("/") == -1 ? imgSrc : FilenameUtils.getName(image.getUrl());

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

            final String naverDesc = BulkTagUtil.specialHtmlTag(imgDesc.replace( "\"", "" )).trim();
            getImageBlockXmlNaver().concat(String.format("<image caption_content=\"%s\" href=\"%s\"/>\r\n", naverDesc, imgSrc));
        }
    }
}
