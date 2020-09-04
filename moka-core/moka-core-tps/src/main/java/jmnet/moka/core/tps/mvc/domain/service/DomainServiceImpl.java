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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSearchDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.mapper.DomainMapper;
import jmnet.moka.core.tps.mvc.domain.repository.DomainRepository;
import jmnet.moka.core.tps.mvc.etccode.service.EtccodeService;
import jmnet.moka.core.tps.mvc.media.entity.Media;
import jmnet.moka.core.tps.mvc.media.repository.MediaRepository;
import jmnet.moka.core.tps.mvc.page.service.PageService;

/**
 * 도메인 서비스 2020. 1. 8. ssc 최초생성
 * 
 * @since 2020. 1. 8. 오후 2:07:40
 * @author ssc
 */
@Service
public class DomainServiceImpl implements DomainService {
    private static final Logger logger = LoggerFactory.getLogger(DomainServiceImpl.class);

    @Autowired
    private DomainRepository domainRepository;
    
    @Autowired
    private PageService pageService;
    
    @Autowired
    private EtccodeService etccodeService;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private DomainMapper domainMapper;
    
    @Autowired
    private UploadFileHelper uploadFileHelper;
    
    @PersistenceContext(name = MspConstants.PERSISTANCE_UNIT_TPS)
    private final EntityManager entityManager;
    
    @Autowired
    public DomainServiceImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Page<Domain> findList(DomainSearchDTO search, Pageable pageable) {
        return domainRepository.findByMediaId(search.getMediaId(), pageable);
    }

    @Override
    public List<Domain> findList(DomainSearchDTO search) {
        return domainRepository.findByMediaId(search.getMediaId());
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
        logger.debug("[INSERT DOMAIN] domainId : {}", returnVal.getDomainId());
        
        // 템플릿 이미지 폴더 생성
        uploadFileHelper.createBusinessDir("template", returnVal.getDomainId());
        
        // 페이지(메인홈) 등록
        jmnet.moka.core.tps.mvc.page.entity.Page root 
            = jmnet.moka.core.tps.mvc.page.entity.Page.builder()
                .createYmdt(returnVal.getCreateYmdt())
                .creator(returnVal.getCreator())
                .pageName("메인")
                .pageDisplayName("HOME")
                .domain(returnVal)
                .pageOrder(1)
                .pageUrl("/")
                .pageBody("")
                .useYn("Y")
                .moveYn("N")
                .build();
        
        // 페이지에 PAGE_TYPE 셋팅 (etccode 리스트의 첫번째 데이터)
        String pageType = "";
        try {    
            pageType = etccodeService.findUseList(TpsConstants.ETCCODE_TYPE_PAGE_TYPE)
                    .get(0).getCodeName();
        } catch(Exception e) {}
        root.setPageType(pageType);
        
        pageService.insertPage(root);
        logger.debug("[INSERT DOMAIN] insert page, {}", root.getPageName());
        
        return returnVal;
    }

    @Override
    public Domain updateDomain(Domain domain) {
        Domain returnVal = domainRepository.save(domain);
        logger.debug("[UPDATE DOMAIN] domainId : {}", returnVal.getDomainId());
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
        logger.debug("[DELETE DOMAIN] Root Page Delete: {}", root.getPageSeq());

        domainRepository.deleteById(domainId);
        logger.debug("[DELETE DOMAIN] domainId: {}", domainId);
    }
    
    @Override
    public void deleteDomain(Domain domain) throws Exception {
        this.deleteDomain(domain.getDomainId());
    }

    @Override
    public boolean hasRelations(String domainId) {
        return false;
    }

    @Override
    public List<Media> findOnlineMediaList() {
        return mediaRepository.findByMediaTypeOrderByMediaIdAsc(TpsConstants.ONLINE_MEDIA_TYPE);
    }

    @Override
    public int countByVolumeId(String volumeId) {
        return domainRepository.countByVolumeId(volumeId);
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
