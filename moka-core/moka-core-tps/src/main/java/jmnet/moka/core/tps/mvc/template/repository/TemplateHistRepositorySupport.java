package jmnet.moka.core.tps.mvc.template.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;

public interface TemplateHistRepositorySupport {
    
    public Page<TemplateHist> findList(Long templateSeq, SearchDTO search, Pageable pageable);
}
