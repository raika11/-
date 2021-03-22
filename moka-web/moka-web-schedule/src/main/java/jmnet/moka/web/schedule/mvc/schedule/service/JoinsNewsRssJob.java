package jmnet.moka.web.schedule.mvc.schedule.service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.web.schedule.mvc.mybatis.dto.JoinsNewsRssDTO;
import jmnet.moka.web.schedule.mvc.mybatis.mapper.JoinsNewsRssJobMapper;
import jmnet.moka.web.schedule.mvc.mybatis.vo.JoinsNewsVO;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * joins 뉴스정보를 조회하여 rss 파일로 FTP 업로드
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : JoinsNewsRssJob
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-17
 */
@Slf4j
@Component
public class JoinsNewsRssJob extends AbstractScheduleJob {

    @Value("http://joongang.joins.com")
    String joongangSvrWebDomain;

    @Value("https://images.joins.com")
    String imagesSvrWebDomain;

    @Value("https://news.joins.com")
    String newsSvrWebDomain;

    @Autowired
    private JoinsNewsRssJobMapper joinsNewsRssJobMapper;

    Map<String, Map<String, String>> ctgInfoMap = new HashMap<>();

    @Override
    public void invoke() {
        //필요정보 초기화
        getCtgInfo();

        try {
            // -1 = 전체조회
            String ctg = "-1";

            //입력된 파라미터 확인(ctg)
            log.debug("param : {}", scheduleInfo.getPkgOpt());
            if (McpString.isNotEmpty(scheduleInfo.getPkgOpt())) {
                JSONObject jsonParam = (JSONObject) new JSONParser().parse(scheduleInfo.getPkgOpt());
                ctg = McpString.defaultValue((String) jsonParam.get("ctg"));
            }
            log.debug("ctg : {}", ctg);

            //ctg에 해당하는 뉴스 정보 조회
            JoinsNewsRssDTO dto = new JoinsNewsRssDTO();
            dto.setPiCtgId(ctg);
            List<JoinsNewsVO> list = joinsNewsRssJobMapper.findAll(dto);

            if (list.isEmpty()) {
                throw new MokaException("조회된 article 기사가 없습니다.");
            }

            //RSS String 생성
            StringBuffer stringBuffer = makeArticleRss(ctg, list);
            //log.debug("stringBuffer : {} ", stringBuffer);

            boolean success = stringFileUpload(stringBuffer.toString());
            //AbstractSchduleJob.finish() 에서 필요한 schedule 실행 결과 값 입력
            //임시로 성공/실패만 입력 + 그외 입력값은 입력정의 필요
            setFinish(success);

        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.toString());
        }
    }

    private StringBuffer makeArticleRss(String ctg, List<JoinsNewsVO> list)
            throws ParseException {
        //ctg에 해당하는 정보 수신 (해당하는 ctg가 없는 경우 전체기사로 처리)
        Map<String, String> ctgInfo = (ctgInfoMap.containsKey(ctg)) ? ctgInfoMap.get(ctg) : ctgInfoMap.get("-1");

        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);

        SimpleDateFormat format1 = new SimpleDateFormat("MM/dd/yyyy hh:mm:ss");
        String ampm = calendar.get(Calendar.AM_PM) == Calendar.AM ? "AM" : "PM";
        String now = format1.format(date) + " " + ampm;

        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("<rss version=\"2.0\" >");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("   <channel>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <title>중앙일보 | " + ctgInfo.get("sCtgKr") + "</title>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <link>" + joongangSvrWebDomain + "</link>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <language>ko</language>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <copyright>Copyright by JoongAng Ilbo Co., Ltd. All Rights Reserved</copyright>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <lastBuildDate>" + now + "</lastBuildDate>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <description>중앙일보 - 현장의 진실을 중앙에 두다.</description>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       <image>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("           <title>중앙일보</title>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("           <url>" + imagesSvrWebDomain + "/common/rss08/JoongAngIlbo_CI_Signature.png</url>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("           <link>" + joongangSvrWebDomain + "</link>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("       </image>");
        stringBuffer.append(System.lineSeparator());

        for (JoinsNewsVO vo : list) {
            String sFdUrl = newsSvrWebDomain + "/article/" + vo.getTotalId() + ctgInfo.get("sCrmTag");

            //author
            String author = McpString.defaultValue(vo.getArticleReporter());
            if (author.length() > 0 && !author.contains("N/A")) {
                author = author + " 기자";
            }

            //pubDate
            SimpleDateFormat stringFormat = new SimpleDateFormat("yyyyMMddHHmmss");
            Date newsDate = stringFormat.parse(vo.getServiceDay() + vo.getServiceTime());
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
            String pubDate = dateFormat.format(newsDate);

            stringBuffer.append("       <item>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("           <title><![CDATA[" + replaceSymbol(vo.getArticleTitle()) + "]]></title>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("           <link><![CDATA[" + sFdUrl + "]]></link>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("           <description><![CDATA[" + replaceSymbol(vo.getArticleSummary()) + "]]></description>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("           <author><![CDATA[" + author + "]]></author>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("           <pubDate>" + pubDate + "</pubDate>");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append("       </item>");
            stringBuffer.append(System.lineSeparator());

        }

        stringBuffer.append("<  /channel>");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("</rss>");

        return stringBuffer;
    }

    //asp 소스의 심볼처리를 그대로 이식
    public String replaceSymbol(String origin) {
        origin = McpString.defaultValue(origin);

        origin = origin.replace("&lt;", "<");
        origin = origin.replace("&gt;", ">");
        origin = origin.replace("&#91;", "[");
        origin = origin.replace("&#93;", "]");
        origin = origin.replace("&amp;", "");
        origin = origin.replace("#39;", "'");
        origin = origin.replace("#39", "'");

        origin = origin.replaceAll("<(style|script|title|link|a)(.*)</(style|script|title|a)>", "");
        origin = origin.replaceAll("<html(.*|)<body([^>]*)>", "");
        origin = origin.replaceAll("</body(.*)</html>(.*)", "");
        origin = origin.replaceAll(
                "<[/]*(div|layer|tbody|html|head|meta|form|input|object|select|textarea|base|table|tr|td|!|b|br|font|img|map|area|hr|p|span|embed)[^>]*>",
                "");
        origin = origin.replaceAll("<[/]*(script|style|title|xmp|div)>", "");
        origin = origin.replaceAll("([a-z0-9]*script:)", "deny_$1");
        origin = origin.replaceAll("<(\\?|%)", "<$1");
        origin = origin.replaceAll("(\\?|%)>", "$1>");

        origin = origin.replace("  ", "™");
        origin = origin.replace("™", "");
        origin = origin.replace("<b>", "");
        origin = origin.replace("</b>", "");
        origin = origin.replace("<B>", "");
        origin = origin.replace("</font>", "");
        origin = origin.replace("</FONT>", "");
        origin = origin.replace("<p>", "");
        origin = origin.replace("<br>", "");
        origin = origin.replace("<BR>", "");
        origin = origin.replace("<center>", "");
        origin = origin.replace("</center>", "");
        origin = origin.replace("&nbsp;", "");
        origin = origin.replace("&", "&amp;");

        return origin;
    }

    //코드화에 대한 방침이 없는 관계로 소스 하드코딩 대신 데이터의 하드코딩으로 대체 > 추후 DB화 시 대체필요
    private void getCtgInfo() {
        Map<String, String> ctgInfo = new HashMap<>();

        ctgInfo.put("sCtgKr", "");
        ctgInfo.put("sCtgEn", "");
        ctgInfo.put("sCrmTag", "");
        ctgInfoMap.put("", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "전체기사");
        ctgInfo.put("sCtgEn", "total");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-total_list");
        ctgInfoMap.put("-1", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "정치");
        ctgInfo.put("sCtgEn", "politics");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-politics");
        ctgInfoMap.put("10", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "경제");
        ctgInfo.put("sCtgEn", "money");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-economy");
        ctgInfoMap.put("11", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "생활");
        ctgInfo.put("sCtgEn", "life");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-society");
        ctgInfoMap.put("12", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "지구촌");
        ctgInfo.put("sCtgEn", "world");
        ctgInfo.put("sCrmTag", "world");
        ctgInfoMap.put("13", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "스포츠");
        ctgInfo.put("sCtgEn", "sports");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-sports");
        ctgInfoMap.put("14", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "연예");
        ctgInfo.put("sCtgEn", "star");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-star");
        ctgInfoMap.put("15", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "IT소식");
        ctgInfo.put("sCtgEn", "it");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-ITScience");
        ctgInfoMap.put("16", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "문화");
        ctgInfo.put("sCtgEn", "culture");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-culture");
        ctgInfoMap.put("17", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "사설·칼럼");
        ctgInfo.put("sCtgEn", "opinion");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-column");
        ctgInfoMap.put("20", ctgInfo);

        ctgInfo = new HashMap<>();
        ctgInfo.put("sCtgKr", "화제");
        ctgInfo.put("sCtgEn", "topic");
        ctgInfo.put("sCrmTag", "?cloc=rss-news-focus");
        ctgInfoMap.put("22", ctgInfo);

        //log.debug("ctgInfoMap : {}", ctgInfoMap.toString());
    }
}
