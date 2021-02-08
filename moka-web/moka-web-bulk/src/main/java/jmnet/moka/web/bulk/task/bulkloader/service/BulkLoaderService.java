package jmnet.moka.web.bulk.task.bulkloader.service;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.bulk.common.vo.TotalVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkloader.service
 * ClassName : BulkLoaderService
 * Created : 2020-12-11 011 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-11 011 오후 2:54
 */
public interface BulkLoaderService {
    List<Map<String, Object>> getUspBulkMgtListSel();
    void insertBulkLoaderData(TotalVo<Map<String, Object>> totalVo);
    void insertBulkLog(TotalVo<Map<String, Object>> totalVo, int status, String message, boolean isError);
    void insertBulkLog(TotalVo<Map<String, Object>> totalVo, int status, String message);
}
