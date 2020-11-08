package jmnet.moka.core.tps.mvc.code.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.entity.Mastercode;
import jmnet.moka.core.tps.mvc.code.entity.ServiceMap;

/**
 * 코드 서비스
 * @author jeon
 *
 */
public interface CodeService {

    List<Mastercode> findAllMastercode(CodeSearchDTO search);

    List<ServiceMap> findAllServiceMap(CodeSearchDTO search);
}
