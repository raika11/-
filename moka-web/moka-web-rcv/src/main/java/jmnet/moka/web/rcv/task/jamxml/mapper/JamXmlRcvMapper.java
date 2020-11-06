package jmnet.moka.web.rcv.task.jamxml.mapper;

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
public interface JamXmlRcvMapper {
    Map<String, String> selectSectCodeByContCode( JamArticleTotalVo jamArticle);
    List<Map<String, String>> selectIssueSeriesReporter( Map<String, String> hashMap );

    void insertReceiveJobStep(JamArticleTotalVo jamArticle);
}
