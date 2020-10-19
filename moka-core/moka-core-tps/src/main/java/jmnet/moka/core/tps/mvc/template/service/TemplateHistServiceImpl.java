package jmnet.moka.core.tps.mvc.template.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;
import jmnet.moka.core.tps.mvc.template.repository.TemplateHistRepository;

@Service
public class TemplateHistServiceImpl implements TemplateHistService {

    @Autowired
    private TemplateHistRepository templateHistRepository;

    @Override
    public Page<TemplateHist> findAllTemplateHist(Long templateSeq, SearchDTO search, Pageable pageable) {
        return templateHistRepository.findList(templateSeq, search, pageable);
    }

    @Override
    public Optional<TemplateHist> findTemplateHistBySeq(Long seq) {
        return templateHistRepository.findBySeq(seq);
    }

    @Override
    public TemplateHist insertTemplateHist(TemplateHist templateHist) throws Exception {
        return templateHistRepository.save(templateHist);
    }

    @Override
    public TemplateHist insertTemplateHist(Template template) throws Exception {
        TemplateHist templateHist = TemplateHist.builder()
                .templateBody(template.getTemplateBody())
                .template(template)
                .build();
        if (template.getDomain() != null) {
            templateHist.setDomainId(template.getDomain().getDomainId());
        }
        return this.insertTemplateHist(templateHist);
    }
}
