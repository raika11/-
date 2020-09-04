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
    public Page<TemplateHist> findHistories(Long templateSeq, SearchDTO search, Pageable pageable) {
        return templateHistRepository.findList(templateSeq, search, pageable);
    }

    @Override
    public Optional<TemplateHist> findHistory(Long seq) {
        return templateHistRepository.findBySeq(seq);
    }

    @Override
    public TemplateHist insertHistory(TemplateHist templateHist) throws Exception {
        return templateHistRepository.save(templateHist);
    }

    @Override
    public TemplateHist insertHistory(Template template) throws Exception {
        TemplateHist templateHist = TemplateHist.builder()
                .createYmdt(template.getCreateYmdt())
                .creator(template.getCreator())
                .templateBody(template.getTemplateBody())
                .template(template)
                .build();
        if (template.getDomain() != null) {
            templateHist.setDomainId(template.getDomain().getDomainId());
        }
        return this.insertHistory(templateHist);
    }
}
