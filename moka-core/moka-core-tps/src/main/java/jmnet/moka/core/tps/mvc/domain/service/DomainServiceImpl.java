/**
 * msp-tps DomainServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.domain.service;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.mapper.DomainMapper;
import jmnet.moka.core.tps.mvc.domain.repository.DomainRepository;
import jmnet.moka.core.tps.mvc.codeMgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.page.service.PageService;

/**
 * 도메인 서비스 2020. 1. 8. ssc 최초생성
 * 
 * @since 2020. 1. 8. 오후 2:07:40
 * @author ssc
 */
@Service
@Slf4j
public class DomainServiceImpl implements DomainService {

    @Autowired
    private DomainRepository domainRepository;
    
    @Autowired
    private PageService pageService;
    
    @Autowired
    private CodeMgtService codeMgtService;

    @Autowired
    private DomainMapper domainMapper;
    
    @Autowired
    private UploadFileHelper uploadFileHelper;
    
    @PersistenceContext(name = MokaConstants.PERSISTANCE_UNIT_TPS)
    private final EntityManager entityManager;
    
    @Autowired
    public DomainServiceImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Page<Domain> findList(SearchDTO search) {
        return domainRepository.findAll(search.getPageable());
    }

    @Override
    public List<Domain> findList() {
        return domainRepository.findAll();
    }

    @Override
    public Optional<Domain> findByDomainId(String domainId) {
        return domainRepository.findById(domainId);
    }

    @Override
    @Transactional
    public Domain insertDomain(Domain domain) throws Exception {
        
        // 도메인 등록
        Domain returnVal = domainRepository.save(domain);
        log.debug("[INSERT DOMAIN] domainId : {}", returnVal.getDomainId());
        
        // 템플릿 이미지 폴더 생성
        uploadFileHelper.createBusinessDir("template", returnVal.getDomainId());
        
        // 페이지(메인홈) 등록
        jmnet.moka.core.tps.mvc.page.entity.Page root 
            = jmnet.moka.core.tps.mvc.page.entity.Page.builder()
                .regDt(McpDate.now())
                .regId(returnVal.getRegId())
                .pageName("메인")
                .pageDisplayName("HOME")
                .domain(returnVal)
                .pageUrl("/")
                .pageBody("")
                .build();
        
        // 페이지에 PAGE_TYPE 셋팅 (etccode 리스트의 첫번째 데이터)
        String pageType = "";
        try {
            pageType = codeMgtService.findUseList(TpsConstants.CODE_MGT_GRP_PAGE_TYPE)
                    .get(0).getCdNm();
        } catch(Exception e) {}
        root.setPageType(pageType);
        
        pageService.insertPage(root);
        log.debug("[INSERT DOMAIN] insert page, {}", root.getPageName());
        
        return returnVal;
    }

    @Override
    public Domain updateDomain(Domain domain) {
        Domain returnVal = domainRepository.save(domain);
        log.debug("[UPDATE DOMAIN] domainId : {}", returnVal.getDomainId());
        return returnVal;
    }
    
    @Override
    public void deleteDomain(String domainId) throws Exception {
        // 템플릿 이미지 폴더 삭제
        uploadFileHelper.deleteBusinessDir("template", domainId);
        
        // 루트 페이지 삭제
        jmnet.moka.core.tps.mvc.page.entity.Page root = 
                pageService.findByDomainId(domainId, null).getContent().get(0);
        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        pageService.deletePage(root, principal.getName());
        log.debug("[DELETE DOMAIN] Root Page Delete: {}", root.getPageSeq());

        domainRepository.deleteById(domainId);
        log.debug("[DELETE DOMAIN] domainId: {}", domainId);
    }
    
    @Override
    public void deleteDomain(Domain domain) throws Exception {
        this.deleteDomain(domain.getDomainId());
    }

    @Override
    public boolean hasRelations(String domainId) {
        return false;
    }

    public List<DomainDTO> findByMapper(String domainId) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("domainId", domainId);
        return domainMapper.findAll(param);
    }

    @Override
    public boolean isDuplicatedId(String domainId) {
        Optional<Domain> maybeDomain = this.findByDomainId(domainId);
        return maybeDomain.isPresent() ? true : false;
    }
}
