package jmnet.moka.core.tps.mvc.code.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.entity.JamMastercode;
import jmnet.moka.core.tps.mvc.code.entity.Mastercode;
import jmnet.moka.core.tps.mvc.code.entity.ServiceMap;

/**
 * 코드 서비스
 *
 * @author jeon
 */
public interface CodeService {

    List<Mastercode> findAllMastercode(CodeSearchDTO search);

    List<ServiceMap> findAllServiceMap(CodeSearchDTO search);

    List<JamMastercode> findAllJamMastercode();

    /**
     * 마스터코드 모두 조회(서비스맵 정보 포함)
     *
     * @return
     */
    List<Mastercode> findAllCode();
}
