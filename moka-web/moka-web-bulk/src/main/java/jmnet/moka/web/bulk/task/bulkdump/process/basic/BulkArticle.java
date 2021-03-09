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
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.object.JaxbObjectManager;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvTarget;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJHot;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsMMDataVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.sub.BulkDumpJHotArticle;
import jmnet.moka.web.bulk.util.BulkTagUtil;
import jmnet.moka.web.bulk.util.BulkUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

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
@Slf4j
public abstract class BulkArticle implements Serializable {
    private static final long serialVersionUID = -5366226728536193452L;

    protected Map<String, MapString> dataMap = new HashMap<>();

    private final TotalVo<BulkDumpTotalVo> totalVo;
    private final BulkDumpTotalVo bulkDumpTotal;
    private BulkDumpEnvTarget bulkDumpEnvTarget;
    private BulkDumpEnvCopyright bulkDumpEnvCopyright;

    private Date insDt;

    public Date getInsDt() {
        return BulkUtil.getDeepDate(insDt);
    }

    public void setInsDt(Date insDt) {
        this.insDt = BulkUtil.getDeepDate(insDt);
    }

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

    private final MapString issue = MapString.newMapString( dataMap, "{_ISSUE_}"); // 사용하는 곳은 없음
    private final MapString iudDNaverUrl = MapString.newMapString( dataMap, "{_D_URL_}"); // 사용하는 곳은 없음

    private final MapString copyrightText = MapString.newMapString( dataMap, "{_CRT_}");
    private final MapString copyrightHtml = MapString.newMapString( dataMap, "{_CRH_}");
    private final MapString copyrightHtmlNaver = MapString.newMapString( dataMap, "{_CRH_NAVER_}");
    private final MapString jhotNaver = MapString.newMapString( dataMap, "{_JHOT_NAVER_}");
    private final MapString jhot = MapString.newMapString( dataMap, "{_JHOT_}");

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

    public BulkArticle(TotalVo<BulkDumpTotalVo> totalVo ) {
        final BulkDumpTotalVo bulkDumpTotal = totalVo.getMainData();
        this.totalVo = totalVo;
        this.bulkDumpTotal = bulkDumpTotal;

        setInsDt( bulkDumpTotal.getInsDt() );
        this.sourceCode = bulkDumpTotal.getSourceCode();
        this.targetCode = bulkDumpTotal.getTargetCode();

        this.iud.setData( bulkDumpTotal.getIud() );
        if( bulkDumpTotal.getContentId() != null )
            this.totalId.setData( bulkDumpTotal.getContentId().toString());

        if( this.targetCode != null ) {
            if (!this.targetCode.startsWith("JT")) {
                this.totalId10.setData(String.format("%010d", bulkDumpTotal.getContentId()));
            }
        }

        if (this.iud.toString().equals("I"))
        {
            this.iud2.setData("N");
            this.iud3.setData("C");
        }
        else
        {
            this.iud2.setData(this.iud.toString());
            this.iud3.setData(this.iud.toString());
        }

        this.yy.setData(McpDate.dateStr(getInsDt(), "yyyy"));
        this.mm.setData(McpDate.dateStr(getInsDt(), "MM"));
        this.dd.setData(McpDate.dateStr(getInsDt(), "dd"));
        this.hh.setData(McpDate.dateStr(getInsDt(), "HH"));
        this.nn.setData(McpDate.dateStr(getInsDt(), "mm"));
        this.ss.setData(McpDate.dateStr(getInsDt(), "ss"));

        this.insertDate.setData( McpDate.dateStr(getInsDt(), "yyyy-MM-dd HH:mm:ss"));
    }

    public void setBulkDumpEnvCopyright( BulkDumpEnvCopyright bulkDumpEnvCopyright ) {
        this.bulkDumpEnvCopyright = bulkDumpEnvCopyright;

        if( !McpString.isNullOrEmpty(bulkDumpEnvCopyright.getCrHtml())) {
            bulkDumpEnvCopyright.setCrHtml(bulkDumpEnvCopyright.getCrHtml()
                                                               .replace("{_TAB_}", "\t")
                                                               .replace("{_CRLF_}", "\r\n"));
            this.copyrightHtml.setData(bulkDumpEnvCopyright.getCrHtml());
        }

        if( !McpString.isNullOrEmpty(bulkDumpEnvCopyright.getCrTxt())) {
            bulkDumpEnvCopyright.setCrTxt(bulkDumpEnvCopyright.getCrTxt()
                                                               .replace("{_TAB_}", "\t")
                                                               .replace("{_CRLF_}", "\r\n"));
            this.copyrightText.setData(bulkDumpEnvCopyright.getCrTxt());
        }

        if( !McpString.isNullOrEmpty(bulkDumpEnvCopyright.getCrHtmlNaver())) {
            this.copyrightHtmlNaver.setData(bulkDumpEnvCopyright.getCrHtml()
                                                                .replace("{_TAB_}", "\t")
                                                                .replace("{_CRLF_}", "\r\n"));
        }
    }

    public void processBulkDumpNewsVo(BulkDumpNewsVo newsVo, List<BulkDumpNewsMMDataVo> bulkDumpNewsMMDataList) {
        this.bulkDumpNewsMMDataList = bulkDumpNewsMMDataList;
        if( bulkDumpNewsMMDataList == null )
            return;
        this.bulkDumpNewsImageList = bulkDumpNewsMMDataList.stream().filter( data -> "HP".equals(data.getMultiType()) ).collect( Collectors.toList());
        this.bulkDumpNewsVideoList = bulkDumpNewsMMDataList.stream().filter( data -> "MF".equals(data.getMultiType()) ).collect( Collectors.toList());
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
        getContentHtml().setData(getContentHtml()
                .toString()
                .replace("&amp;", "&")
                .replace("&amp", "&")
                .replace("&prime;", "″")
                .replace("&prime", "″")
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

    @SuppressWarnings("SameParameterValue")
    protected void processContent_replaceAll( String regex, String replacement ) {
        getContentHtmlNaver().replaceAll(regex, replacement);
        getContentHtmlDaum().replaceAll(regex, replacement);
        getContentHtml().replaceAll(regex, replacement);
        getContentText().replaceAll(regex, replacement);
        getContentHtmlEx4().replaceAll(regex, replacement);
        getContentHtmlCyworld().replaceAll(regex, replacement);
        getContentHtmlNate().replaceAll(regex, replacement);
    }

    public void processContent_JHotClick( int maxCount ) {
        if( McpString.isNullOrEmpty(getBulkDumpEnvCopyright().getJhotClick()))
            return;

        try {
            final BulkDumpJHot bulkDumpJHot = (BulkDumpJHot) JaxbObjectManager.getBasicVoFromString( getBulkDumpEnvCopyright().getJhotClick(), BulkDumpJHot.class );
            if( bulkDumpJHot == null )
                return;
            if( bulkDumpJHot.getArticles() == null )
                return;
            if( bulkDumpJHot.getArticles().size() == 0 )
                return;

            getRelatedNewsDaum().concat("<RELATED_NEWS>\r\n");

            int cnt = 0;
            int naver_cnt = 0;

            StringBuilder sb = new StringBuilder();
            StringBuilder sbNaver = new StringBuilder();

            for( BulkDumpJHotArticle article : bulkDumpJHot.getArticles()) {
                if (McpString.isNullOrEmpty(article.getTitle()))
                    continue;

                if (cnt >= maxCount) break;

                final String link = article.getLink() == null ? "" : article.getLink();

                final String extension = link.substring(link.lastIndexOf(".") + 1);
                final String separator = (extension.contains("?")) ? "&" : "?";     // 물음표(?)가 있는 경우와 없는 경우 구분

                //중복된 기사는 핫클릭 영역에서 제외
                if (!getTotalId().toString().equals(article.getTotalId()))
                {
                    //5개까지 출력
                    if (naver_cnt <= 4)
                    {
                        sb
                                .append("▶ <a href=\"")
                                .append(link)
                                .append(separator)
                                .append("cloc=bulk\" target=\"_blank\">")
                                .append(article.getTitle())
                                .append("</a>\r\n\r\n");
                        sbNaver
                                .append("<relNews title=\"")
                                .append(BulkTagUtil.specialHtmlTag(BulkTagUtil.standardBulkClearingTagImage(BulkTagUtil.strip(article.getTitle()))))
                                .append("\" href=\"")
                                .append(BulkTagUtil.specialHtmlTag(link + separator))
                                .append("cloc=bulk\" />\r\n");

                        getRelatedNewsZum().concat("<related_news title=\""
                                + BulkTagUtil.standardBulkClearingTagImage(BulkTagUtil.specialHtmlTag(BulkTagUtil.strip(article.getTitle().replace("\"", "'").replace("&", "&amp;"))))
                                + "\"><![CDATA[" + BulkTagUtil.specialHtmlTag(link) + "]]></related_news>\r\n");

                        naver_cnt++;
                    }
                    //다음카카오 중앙일보 기사는 10개 추천뉴스 노출
                    getRelatedNewsDaum().concat("<NEWS>\r\n");
                    getRelatedNewsDaum().concat("<TITLE><![CDATA[" + article.getTitle() + "]]></TITLE>\r\n");
                    getRelatedNewsDaum().concat("<URL><![CDATA[" + link + "]]></URL>\r\n");
                    getRelatedNewsDaum().concat("</NEWS>\r\n");
                    cnt++;
                }
            }
            getRelatedNewsDaum().concat("</RELATED_NEWS>\r\n");

            getJhot().setData("\r\n\r\n<b>[J-Hot]</b>\r\n\r\n" + sb.toString() );
            getJhotNaver().setData( sbNaver.toString() );
        } catch (Exception e) {
            log.error("jHotClick Error");
            e.printStackTrace();
        }
    }
}
