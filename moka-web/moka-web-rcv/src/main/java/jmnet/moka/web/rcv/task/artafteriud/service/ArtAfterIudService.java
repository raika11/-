package jmnet.moka.web.rcv.task.artafteriud.service;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.artafteriud.service
 * ClassName : ArtAfterIudService
 * Created : 2020-12-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-10 010 오전 9:50
 */
public interface ArtAfterIudService {
    List<Map<String, Object>> getUspArticleIudList();
    void deleteUspArticleIudList(Map<String, Object> map);

    void insertUpaCpRcvArtHist(Map<String, Object> map);
    void insertUpaJamRcvArtHistSucc(Map<String, Object> map);
}
