package jmnet.moka.web.bulk.task.bulkdump.process.sunday;

import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkArticle;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsMMDataVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkTagUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

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

    public BulkSundayArticle(BulkDumpTotalVo bulkDumpTotal) {
        super(bulkDumpTotal);
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

        getTotalId().setData(newsVo.getTotalId());

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
}
