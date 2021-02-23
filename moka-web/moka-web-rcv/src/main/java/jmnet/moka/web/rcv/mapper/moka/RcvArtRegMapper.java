package jmnet.moka.web.rcv.mapper.moka;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.rcvartreg.mapper
 * ClassName : RcvArtRegMapper
 * Created : 2020-12-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-01 001 오후 4:43
 */
@Repository
@Mapper
public interface RcvArtRegMapper {
    List<Map<String, Object>> callUspRcvArticleIudSel();
    void callUspRcvArticleIudComplete( JamArticleTotalVo articleTotal );
    void callUspRcvArticleIudDelete(Map<String, Object> compMap);

    List<Map<String, String>> callUspRcvArticleCodeSel( JamArticleTotalVo articleTotal );
    List<Map<String, String>> callUspRcvArticleReporterSelByRid(JamArticleTotalVo articleTotal);
    List<Map<String, String>> selectRcvArticleComponent(Map<String, Object> compMap);
    List<Map<String, String>> selectRcvArticleKeyword(JamArticleTotalVo articleTotal);

    void callUpaCpRcvArtHistUpd(Map<String, Object> compMap);
}
