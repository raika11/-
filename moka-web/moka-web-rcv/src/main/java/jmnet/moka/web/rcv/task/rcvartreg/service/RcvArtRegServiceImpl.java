package jmnet.moka.web.rcv.task.rcvartreg.service;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.DescVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ReporterVo;
import jmnet.moka.web.rcv.mapper.moka.RcvArtRegMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.rcvartreg
 * ClassName : RcvArtRegServiceImpl
 * Created : 2020-12-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-01 001 오후 5:57
 */
@Service
@Slf4j
public class RcvArtRegServiceImpl implements RcvArtRegService{
    private final RcvArtRegMapper rcvArtRegMapper;

    public RcvArtRegServiceImpl(RcvArtRegMapper rcvArtRegMapper) {
        this.rcvArtRegMapper = rcvArtRegMapper;
    }

    @Override
    public List<Map<String, Object>> getUspRcvArticleIudSelList() {
        return rcvArtRegMapper.callUspRcvArticleIudSel();
    }

    @Override
    public void setUspRcvArticleIudComplete(JamArticleTotalVo articleTotal) {
        rcvArtRegMapper.callUspRcvArticleIudComplete(articleTotal);
    }

    @Override
    public void getUspRcvCodeConvSelByRid(JamArticleTotalVo articleTotal) {
        rcvArtRegMapper.callUspRcvCodeConvSelByRid(articleTotal);
    }

    @Override
    public void getRcvArticleReporters(JamArticleTotalVo articleTotal) {
        final JamArticleVo article = articleTotal.getMainData();
        for ( Map<String, String> map : rcvArtRegMapper.callUspRcvArticleReporterSelByRid(articleTotal) ){
            //noinspection serial
            article.getReporters().add( new ReporterVo() {{
                setName(map.get("REPORTER_NAME"));
                setEmail(map.get("REPORTER_EMAIL"));
            }});
        }
    }

    private String GetImageBaseUrl(String sourceCode, MokaRcvConfiguration rcvConfiguration) {
        switch (sourceCode) {
            case "10":
            case "11":
            case "13":
            case "14":
            case "15": return "http://omagazine.joins.com";
            default:
                if( McpString.isNullOrEmpty( rcvConfiguration.getStagePds() ) )
                    return "https://pds.joins.com";
                else
                    return rcvConfiguration.getStagePds();
        }
    }

    @Override
    public void getRcvArticleComponent(JamArticleTotalVo articleTotal, Map<String, Object> compMap, MokaRcvConfiguration rcvConfiguration) {
        final JamArticleVo article = articleTotal.getMainData();
        for( Map<String, String> map : rcvArtRegMapper.selectRcvArticleComponent(compMap)){
            final String compType = map.get("COMP_TYPE");
            final String comObjId = map.get("COMP_OBJ_ID");

            if( compType == null )
                continue;

            // Get_Rel_JTBCVodID
            if( compType.equals("M")) {
                if( comObjId == null )
                    continue;
                if( comObjId.length() != 10 )
                    continue;
                // MV 타입으로 새로운 항목을 등록한다.
                // articleTotal.setJtbcVodId(comObjId);
                //noinspection serial
                article.getContents().getItems().add( new ItemVo() {{
                    setUrl(map.get("COMP_URL"));
                    //noinspection serial
                    setDesc(new DescVo() {{
                        setValue(map.get("COMP_DESC"));
                    }});
                    setWidth(map.get("COMP_WIDTH"));
                    setHeight(map.get("COMP_HEIGHT"));
                    setVarcharKey(map.get("COMP_OBJ_ID"));
                    setThumbnail("N");
                    setType("MV");
                }});
            }
            else {
                //noinspection serial
                article.getContents().getItems().add( new ItemVo(){{
                    setUrl( GetImageBaseUrl(articleTotal.getSourceCode(), rcvConfiguration).concat(map.get("COMP_URL")));
                    //noinspection serial
                    setDesc(new DescVo(){{
                        setValue(map.get("COMP_DESC"));
                            }});
                    setWidth(map.get("COMP_WIDTH"));
                    setHeight(map.get("COMP_HEIGHT"));
                    if( McpString.isNullOrEmpty( map.get("COMP_PLAY_TIME")) )
                        setEtc( map.get("COMP_OBJ_ID"));
                    else
                        setEtc( map.get("COMP_PLAY_TIME"));
                    setThumbnail("N");
                    setType("HP");
                }
            });
            }
        }
    }

    @Override
    public void getRcvArticleKeyword(JamArticleTotalVo articleTotal) {
        final JamArticleVo article = articleTotal.getMainData();
        for( Map<String, String> map : rcvArtRegMapper.selectRcvArticleKeyword(articleTotal)){
            if( !McpString.isNullOrEmpty(map.get("KEYWORD")))
                article.getKeywords().add( map.get("KEYWORD") );
        }
    }

    @Override
    public void insertReceiveJobStep(Map<String, Object> compMap, String errorMessage)
            throws RcvDataAccessException {
        if( !McpString.isNullOrEmpty(errorMessage) ) {
            compMap.put("errorMessage", errorMessage);
        }

        rcvArtRegMapper.callUpaCpRcvArtHistUpd(compMap);
    }
}
