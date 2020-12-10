package jmnet.moka.web.rcv.task.artafteriud.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.artafteriud.mapper
 * ClassName : ArtAfterIudMapper
 * Created : 2020-12-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-10 010 오전 9:43
 */
@Repository
@Mapper
public interface ArtAfterIudMapper {
    List<Map<String, Object>> callUspArticleIudListSel();
    void callUspArticleIudDel(Map<String, Object> map);

    void callUpaCpRcvArtHistIns(Map<String, Object> map);
    void callUpaJamRcvArtHistSuccIns(Map<String, Object> map);
}
