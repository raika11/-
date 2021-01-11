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
 * Package : jmnet.moka.web.rcv.task.jamxml
 * ClassName : JamXmlRcvMapper
 * Created : 2020-11-02 002 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-02 002 오후 2:30
 */
@Repository
@Mapper
public interface JamXmlMapper {
    Integer callUpaArticleSourceSelByJamLoad( String sourceCode );
    List<Map<String, String>> callUpaIssueSeriesReporterSelByRepseq(Map<String, String> hashMap);

    void callUpaTotalMappingSel(JamArticleTotalVo jamArticle);

    void callUpaJamRcvArtHistIns(JamArticleTotalVo jamArticle);
    void callUpaJamRcvArtHistUpd(JamArticleTotalVo jamArticle);
}
