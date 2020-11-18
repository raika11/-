package jmnet.moka.web.rcv.task.cppubxml.mapper;

import java.util.Map;
import jmnet.moka.web.rcv.task.cppubxml.vo.CpPubNewsMLTotalVo;
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
public interface CpPubXmlRcvMapper {
    Map<String, String> callUspRcvArticleJiXmlIns(CpPubNewsMLTotalVo cpArticleTotal);
}
