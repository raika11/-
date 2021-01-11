package jmnet.moka.web.rcv.mapper.moka;

import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleTotalVo;
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
public interface CpXmlMapper {
    Integer callUspRcvArticleBasicIns(CpArticleTotalVo cpArticleTotal);

    Integer callUspRcvArticleComponentIns(CpArticleTotalVo cpArticleTotal);
    Integer callUspRcvArticleComponentDel(CpArticleTotalVo cpArticleTotal);

    Integer callUspRcvArticleReporterIns(CpArticleTotalVo cpArticleTotal);
    Integer callUspRcvArticleReporterDel(CpArticleTotalVo cpArticleTotal);

    Integer callUspRcvArticleCodeIns(CpArticleTotalVo cpArticleTotal);
    Integer callUspRcvArticleCodeDel(CpArticleTotalVo cpArticleTotal);

    Integer callUspRcvArticleKeywordIns(CpArticleTotalVo cpArticleTotal);
    Integer callUspRcvArticleKeywordDel(CpArticleTotalVo cpArticleTotal);

    void callUpaCpRcvArtHistIns(CpArticleTotalVo cpArticleTotal);
    void callUpaCpRcvArtHistUpd(CpArticleTotalVo cpArticleTotal);
}
