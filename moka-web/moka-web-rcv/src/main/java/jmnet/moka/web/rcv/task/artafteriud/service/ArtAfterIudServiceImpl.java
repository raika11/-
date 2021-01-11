package jmnet.moka.web.rcv.task.artafteriud.service;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.mapper.moka.ArtAfterIudMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.artafteriud.service
 * ClassName : ArtAfterIudServiceImpl
 * Created : 2020-12-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-10 010 오전 9:51
 */

@Service
@Slf4j
public class ArtAfterIudServiceImpl implements ArtAfterIudService {
    private final ArtAfterIudMapper artAfterIudMapper;

    public ArtAfterIudServiceImpl(ArtAfterIudMapper artAfterIudMapper) {
        this.artAfterIudMapper = artAfterIudMapper;
    }

    @Override
    public List<Map<String, Object>> getUspArticleIudList() {
        return artAfterIudMapper.callUspArticleIudListSel();
    }

    @Override
    public void deleteUspArticleIudList(Map<String, Object> map) {
        artAfterIudMapper.callUspArticleIudDel(map);
    }

    @Override
    public void insertUpaCpRcvArtHist(Map<String, Object> map) {
        artAfterIudMapper.callUpaCpRcvArtHistIns(map);
    }

    @Override
    public void insertUpaJamRcvArtHistSucc(Map<String, Object> map) {
        artAfterIudMapper.callUpaJamRcvArtHistSuccIns(map);
    }
}
