package jmnet.moka.web.rcv.task.bulkloader.service;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.bulkloader.service
 * ClassName : BulkLoaderServie
 * Created : 2020-12-11 011 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-11 011 오후 2:54
 */
public interface BulkLoaderService {
    List<Map<String, Object>> getUspBulkMgtListSel();
    void insertBulkLoaderData(Map<String, Object> map);
}
