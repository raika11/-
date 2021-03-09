package jmnet.moka.core.tps.mvc.code.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.entity.JamMastercode;
import jmnet.moka.core.tps.mvc.code.entity.Mastercode;
import jmnet.moka.core.tps.mvc.code.entity.ServiceMap;
import jmnet.moka.core.tps.mvc.code.repository.JamMastercodeRepository;
import jmnet.moka.core.tps.mvc.code.repository.MastercodeRepository;
import jmnet.moka.core.tps.mvc.code.repository.ServiceMapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CodeServiceImpl implements CodeService {
    @Autowired
    private MastercodeRepository mastercodeRepository;

    @Autowired
    private ServiceMapRepository serviceMapRepository;

    @Autowired
    private JamMastercodeRepository jamMastercodeRepository;

    @Override
    public List<Mastercode> findAllMastercode(CodeSearchDTO search) {
        return mastercodeRepository.findList(search);
    }

    @Override
    public List<ServiceMap> findAllServiceMap(CodeSearchDTO search) {
        return serviceMapRepository.findList(search);
    }

    @Override
    public List<JamMastercode> findAllJamMastercode() {
        return jamMastercodeRepository.findAll();
    }

    @Override
    public List<Mastercode> findAllCode() {
        return mastercodeRepository.findAllCode();
    }
}
