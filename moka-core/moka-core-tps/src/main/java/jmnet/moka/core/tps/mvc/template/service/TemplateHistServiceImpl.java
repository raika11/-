package jmnet.moka.core.tps.mvc.template.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;
import jmnet.moka.core.tps.mvc.template.repository.TemplateHistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TemplateHistServiceImpl implements TemplateHistService {

    @Autowired
    private TemplateHistRepository templateHistRepository;

    @Override
    public Optional<TemplateHist> findTemplateHistBySeq(Long seq) {
        return templateHistRepository.findBySeq(seq);
    }

    @Override
    public TemplateHist insertTemplateHist(TemplateHist templateHist)
            throws Exception {
        return templateHistRepository.save(templateHist);
    }

    @Override
    public TemplateHist insertTemplateHist(Template template)
            throws Exception {
        TemplateHist templateHist = TemplateHist.builder()
                                                .templateBody(template.getTemplateBody())
                                                .template(template)
                                                .build();
        if (template.getDomain() != null) {
            templateHist.setDomainId(template.getDomain()
                                             .getDomainId());
        }
        return this.insertTemplateHist(templateHist);
    }
}
