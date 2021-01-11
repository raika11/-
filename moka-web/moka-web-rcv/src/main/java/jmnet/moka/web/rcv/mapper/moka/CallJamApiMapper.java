package jmnet.moka.web.rcv.mapper.moka;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.calljamapi.mapper
 * ClassName : CallJamApiMapper
 * Created : 2020-12-09 009 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-09 009 오후 1:11
 */
@Repository
@Mapper
public interface CallJamApiMapper {
    List<Map<String, Object>> callUpaJamRcvArtHistListSel();
    void callUpaCpRcvArtHistUpd( Map<String, Object> map );
    void callUpaCpRcvArtHistDel();
}
