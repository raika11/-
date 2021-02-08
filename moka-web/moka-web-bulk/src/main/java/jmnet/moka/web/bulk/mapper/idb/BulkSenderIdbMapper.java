package jmnet.moka.web.bulk.mapper.idb;

import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobTotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobVo;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.mapper.idb
 * ClassName : BulkDumpIdbMapper
 * Created : 2020-12-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-17 017 오후 6:09
 */
@Repository
@Mapper
public interface BulkSenderIdbMapper {
    void callUspBulkLogInsBySender( TotalVo<BulkDumpJobTotalVo> totalVo );
    void callUspBulkPortalLogInsBySender( TotalVo<BulkDumpJobVo> totalVo );
}
