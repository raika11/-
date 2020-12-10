package jmnet.moka.web.rcv.task.rcvartreg.process;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.rcvartreg.service.RcvArtRegService;
import jmnet.moka.web.rcv.taskinput.DBTaskInputData;
import jmnet.moka.web.rcv.util.RcvUtil;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.rcvartreg
 * ClassName : RcvArtRegMapToJam
 * Created : 2020-12-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-01 001 오후 6:19
 */
public class RcvArtRegToJamArticleTotalProcess {
    public static JamArticleTotalVo getJamArticleTotalVo(Map<String, Object> map, RcvArtRegService rcvArtRegService,
            MokaRcvConfiguration rcvConfiguration, DBTaskInputData taskInputData) {
        final JamArticleVo article = new JamArticleVo();
        article.initMembers();

        final JamArticleTotalVo articleTotal = new JamArticleTotalVo(article);
        article.setIud( RcvUtil.getMapStringData(map,"IUD"));
        articleTotal.setRid( RcvUtil.getMapStringData(map,"IUD_RID") );

        if( article.getIud() == null || McpString.isNullOrEmpty(articleTotal.getRid() ))
            return null;

        article.setArtType("R");
        article.setTmplType("B");

        if( article.getIud().equals("D") )
            return articleTotal;

        if( map.get("SOURCE_CODE") == null)
            return null;

        articleTotal.setSourceCode(RcvUtil.getMapStringData(map,"SOURCE_CODE"));
        article.getMediaCode().setValue(articleTotal.getSourceCode());
        if( McpString.isNullOrEmpty(articleTotal.getSourceCode() ))
            return null;

        /* 자동치환 분류코드표 (포털, 일단)은 범위에 들어가지 않는다. */
        rcvArtRegService.getUspRcvCodeConvSelByRid( articleTotal);
        if( article.getCategoies().get(0).getCode() == null ) {
            taskInputData.logError("Rid=[{}] code not mapping move to TB_RCV_ARTICLE_BASIC_NOTMATCH ");
            return null;
        }

/*
        ** 노컷(NOCUT) 이미지 캡션 추가 ..
        if (articleTotal.getSourceCode().equals("94") ) {
            String body = article.getContents().getBody();
            for( ItemVo item : article.getContents().getItems() ) {
                if( McpString.isNullOrEmpty(item.getDesc().getValue()) )
                    continue;
                final String findStr = "<img src=\"".concat(item.getUrl()).concat("\"/>");
                final String replaceStr = "<!--@img_tag_s@-->".concat(item.getUrl()).concat("<span  class=\"rt\">").concat(item.getDesc().getValue() ).concat("</span><!--@img_tag_e@-->");
                body = body.replace(findStr, replaceStr);
            }
            article.getContents().setBody(body);
        }
 */
        if( map.get("PRESS_DT") == null )
            article.getArticleProp().setServiceDate( McpDate.dateStr(new Date(), "yyyyMMddHHmmss") );
        else
            article.getArticleProp().setServiceDate( McpDate.dateStr( (Timestamp) map.get("PRESS_DT"), "yyyyMMddHHmmss") );

        article.setPcTitle( RcvUtil.getMapStringData(map,"TITLE").replace("<", "&lt;").replace(">", "&gt;") );
        article.setListTitle( RcvUtil.getMapStringData(map,"TITLE") );
        article.setSubTitle( RcvUtil.getMapStringData(map,"SUB_TITLE") );
        article.getContents().setBody(RcvUtil.getMapStringData(map,"CONTENT"));

        article.getArticleProp().getBulkFlag().setValue("N");
        article.getArticleProp().setBulkimgFlag("N");

        article.getArticleProp().setEmbargo("N");
        article.getMediaCode().setName(RcvUtil.getMapStringData(map,"MEDIA_CODE") );
        articleTotal.setTotalId(RcvUtil.parseInt( RcvUtil.getMapStringData(map,"TOTAL_ID")) );
        article.getPaperProp().setMyun(RcvUtil.getMapStringData(map,"MYUN"));
        article.getPaperProp().setPan(RcvUtil.getMapStringData(map,"PAN"));
        article.getPaperProp().setSection(RcvUtil.getMapStringData(map,"SECTION"));
        articleTotal.setBackofficeYn(RcvUtil.getMapStringData(map,"IUD_BACKOFFICE_YN"));

        // 집배신, 일간, J플러스, 선데이인경우 기자정보 입력
        switch ( articleTotal.getSourceCode() )
        {
            case "3":
            case "29":
            case "jp":
            case "k2":
            case "61":
                rcvArtRegService.getRcvArticleReporters(articleTotal );
                break;
        }

        Map<String, Object> compMap = new HashMap<>();
        compMap.put("rid", articleTotal.getRid());
        /*
			-- JTBC 기사의 경우 본문에 네이버 TVCAST iframe 코드가 있으면 벌크 전송하도록 조정
         */
        if( articleTotal.getSourceCode().equals("d9") ) {
            compMap.put("compType", new String[] {"I", "M"});
            if( article.getContents().getBody().contains("http://serviceapi.rmcnmv.naver.com/flash/") ) {
                article.getArticleProp().getBulkFlag().setBulkSite("1,2,3,4,9");
                article.getArticleProp().getBulkFlag().setDelSite("");
            }
        }
        else
            compMap.put("compType", new String[] {"I"} );

        if( !McpString.isNullOrEmpty(articleTotal.getSectCode())  ) {
            rcvArtRegService.getRcvArticleComponent(articleTotal, compMap, rcvConfiguration);
        }

        rcvArtRegService.getRcvArticleKeyword(articleTotal);

        // --일간 화상집배신 포토기사 벌크 (조판기사가 또 29들어오면 화상집배신하고 구분하기위해 포토는 제목에 [포토], [화보]로 구분한다.
        if( articleTotal.getSourceCode().equals("29") ) {
            final String title =article.getTitle().replace("&#91;", "[").replace("&#93;", "]");
            if( title.contains("[포토]") || title.contains("[화보]") || title.contains("[골든포토]") || title.contains("[리우is]") ) {
                article.getArticleProp().getBulkFlag().setValue("Y");
                article.getArticleProp().setBulkimgFlag("Y");
                article.getArticleProp().getBulkFlag().setBulkSite("1,2,3,4,9");
                article.getArticleProp().getBulkFlag().setDelSite("");
            }
        }
        return articleTotal;
    }
}
