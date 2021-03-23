package jmnet.moka.core.tps.mvc.push.service;

import java.util.List;
import jmnet.moka.core.tps.common.entity.CommonCode;
import jmnet.moka.core.tps.mvc.push.dto.PushAppSearchDTO;
import jmnet.moka.core.tps.mvc.push.entity.PushApp;
import jmnet.moka.core.tps.mvc.push.repository.PushAppRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.push.service
 * ClassName : PushAppServiceImpl
 * Created : 2021-03-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-23 08:20
 */
@Service
public class PushAppServiceImpl implements PushAppService {

    @Autowired
    private PushAppRepository pushAppRepository;

    @Override
    public List<PushApp> findAllPushApp(PushAppSearchDTO searchDTO) {
        return pushAppRepository.findAll(searchDTO);
    }

    @Override
    public List<Integer> findAllPushAppIds(PushAppSearchDTO searchDTO) {
        return pushAppRepository.findAllIds(searchDTO);
    }

    @Override
    public List<CommonCode> findAllAppDiv() {
        return pushAppRepository.findAllAppDiv();
    }

    @Override
    public List<CommonCode> findAllDevDiv(PushAppSearchDTO searchDTO) {
        return pushAppRepository.findAllAppDevDiv(searchDTO);
    }

    @Override
    public List<CommonCode> findAllAppOsDiv(PushAppSearchDTO searchDTO) {
        return pushAppRepository.findAllAppOsDiv(searchDTO);
    }
}
