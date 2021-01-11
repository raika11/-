package jmnet.moka.web.rcv.mapper.moka;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.mapper.moka
 * ClassName : BulkLoaderMokaMapper
 * Created : 2020-12-11 011 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-11 011 오후 3:05
 */
@Repository
@Mapper
public interface BulkLoaderMokaMapper {
    List<Map<String, Object>> callUspBulkMgtListSel();
    void callUspBulkMgtDel( Map<String, Object>map);
}
