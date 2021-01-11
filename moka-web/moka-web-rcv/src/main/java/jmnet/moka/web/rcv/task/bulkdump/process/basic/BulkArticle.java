package jmnet.moka.web.rcv.task.bulkdump.process.basic;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.web.rcv.task.bulkdump.env.Sub.BulkDumpEnvTarget;
import jmnet.moka.web.rcv.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.rcv.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.rcv.util.RcvTagUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.bulkdump.process.basic
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

    private final MapString totalId = MapString.newMapString( dataMap, "{_TOTALID_}");
    private final MapString totalId10 = MapString.newMapString( dataMap, "{_TOTALID10_}");
    private final MapString totalId11 = MapString.newMapString( dataMap, "{_TOTALID11_}");

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

    private final MapString contentHtml = MapString.newMapString( dataMap, "{_CONTHTML_}");
    private final MapString contentHtmlMs = MapString.newMapString( dataMap, "{_CONTH_MS_}");
    private final MapString contentHtmlEx4 = MapString.newMapString( dataMap, "{_CONTH_EX4_}");
    private final MapString contentHtmlCyworld = MapString.newMapString( dataMap, "{_CONTH_CYWORLD_}");
    private final MapString contentHtmlNate = MapString.newMapString( dataMap, "{_CONTH_NATE_}");
    private final MapString contentHtmlDaum = MapString.newMapString( dataMap, "{_CONTH_DAUM_}");
    private final MapString contentHtmlZum = MapString.newMapString( dataMap, "{_CONTH_ZUM_}");

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
                this.totalId11.setData(String.format("%011d", bulkDumpTotal.getTotalId()));
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
    }

    public abstract void processBulkDumpNewsVo(BulkDumpNewsVo newsVo);

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
        getTitle().setData(RcvTagUtil.standardBulkClearingTag(getTitle().toString()));
        getSubTitle().setData(RcvTagUtil.standardBulkClearingTag(getSubTitle().toString()));
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
}
