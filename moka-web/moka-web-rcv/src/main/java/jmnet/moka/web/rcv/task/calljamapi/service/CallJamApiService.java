package jmnet.moka.web.rcv.task.calljamapi.service;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.calljamapi.service
 * ClassName : CallJamApiService
 * Created : 2020-12-09 009 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-09 009 오후 1:08
 */
public interface CallJamApiService {
    List<Map<String, Object>> getUpaJamRcvArtHistSelList();

    void insertReceiveJobStep(List<Map<String, Object>> mapList);

    void deleteReceiveJobStep();
}
