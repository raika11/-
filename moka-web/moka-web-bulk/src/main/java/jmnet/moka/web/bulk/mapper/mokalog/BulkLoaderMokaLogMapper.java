package jmnet.moka.web.bulk.mapper.mokalog;

import java.util.Map;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.mapper.idb
 * ClassName : BulkLoaderMapper
 * Created : 2020-12-11 011 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-11 011 오후 2:56
 */
@Repository
@Mapper
public interface BulkLoaderMokaLogMapper {
     void callUspBulkLogInsByLoader( TotalVo<Map<String, Object>> totalVo );
}
