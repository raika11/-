package jmnet.moka.core.tps.mvc.template.service;

import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;
import jmnet.moka.core.tps.mvc.template.mapper.TemplateMapper;
import jmnet.moka.core.tps.mvc.template.repository.TemplateRepository;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 * 템플릿 서비스 구현체
 * 2020. 1. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 1. 14. 오후 1:35:42
 */
@Service
@Slf4j
public class TemplateServiceImpl implements TemplateService {
    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private TemplateMapper templateMapper;

    @Autowired
    private TemplateHistService templateHistService;

    @Autowired
    private UploadFileHelper uploadFileHelper;

    @PersistenceContext(name = MokaConstants.PERSISTANCE_UNIT_TPS)
    private final EntityManager entityManager;

    @Autowired
    public TemplateServiceImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<TemplateVO> findAllTemplate(TemplateSearchDTO search) {
        if (search
                .getSearchType()
                .equals("pageSeq") && McpString.isNotEmpty(search.getKeyword())) {    // 페이지에서 관련 템플릿 검색
            return templateMapper.findPageChildRelList(search);
        } else if (search
                .getSearchType()
                .equals("artPageSeq") && McpString.isNotEmpty(search.getKeyword())) {    // 기사페이지에서 관련 템플릿 검색
            return templateMapper.findArticlePageChildRelList(search);
        } else if (search
                .getSearchType()
                .equals("containerSeq") && McpString.isNotEmpty(search.getKeyword())) {    // 컨테이너에서 관련 템플릿 검색
            return templateMapper.findContainerChildRelList(search);
        } else {
            if (search
                    .getSearchType()
                    .equals("pageSeq") || search
                    .getSearchType()
                    .equals("artPageSeq") || search
                    .getSearchType()
                    .equals("containerSeq")) {
                search.clearSort();
                search.addSort("templateSeq,desc");
            }
            return templateMapper.findAll(search);
        }
    }

    @Override
    public Optional<Template> findTemplateBySeq(Long templateSeq) {
        return templateRepository.findById(templateSeq);
    }

    @Override
    @Transactional
    public Template insertTemplate(Template template)
            throws Exception {
        Template returnVal = templateRepository.save(template);
        log.debug("Insert Template {}", returnVal.getTemplateSeq());

        // 히스토리 생성
        templateHistService.insertTemplateHist(returnVal);
        log.debug("Insert Template History {}", returnVal.getTemplateSeq());

        entityManager.refresh(returnVal);
        return returnVal;
    }

    @Override
    @Transactional
    public Template updateTemplate(Template template)
            throws Exception {
        Template returnVal = templateRepository.save(template);
        log.debug("Update Template {}", template.getTemplateSeq());

        // 히스토리 생성
        TemplateHist hist = TemplateHist
                .builder()
                .templateBody(template.getTemplateBody())
                .template(template)
                .build();
        if (template.getDomain() != null) {
            hist.setDomainId(template
                    .getDomain()
                    .getDomainId());
        }
        templateHistService.insertTemplateHist(hist);
        log.debug("Insert Template History {}", returnVal.getTemplateSeq());

        return returnVal;
    }

    @Override
    public void deleteTemplate(Template template)
            throws Exception {
        templateRepository.deleteById(template.getTemplateSeq());
        log.debug("Delete Template {}", template.getTemplateSeq());
    }

    @Override
    public Template insertTemplate(Template template, boolean historySave)
            throws Exception {
        if (historySave) {
            return this.insertTemplate(template);
        } else {
            Template returnVal = templateRepository.save(template);
            log.debug("Insert Template {}", returnVal.getTemplateSeq());

            entityManager.refresh(returnVal);
            return returnVal;
        }
    }

    @Override
    public Template updateTemplate(Template template, boolean historySave)
            throws Exception {
        if (historySave) {
            return this.updateTemplate(template);
        } else {
            Template returnVal = templateRepository.save(template);
            log.debug("Insert Template {}", returnVal.getTemplateSeq());
            return returnVal;
        }
    }

    @Override
    public int countTemplateByDomainId(String domainId) {
        return templateRepository.countByDomain_DomainId(domainId);
    }

    //    @Override
    //    public List<String> findDomainIdListByTemplateSeq(Long templateSeq) {
    //        return templateMapper.findDomainIdListByTemplateSeq(templateSeq);
    //    }

    @Override
    public String saveTemplateImage(Template template, MultipartFile thumbnail)
            throws Exception {
        String extension = McpFile
                .getExtension(thumbnail.getOriginalFilename())
                .toLowerCase();
        String newFilename = String.valueOf(template.getTemplateSeq()) + "." + extension;
        // 이미지를 저장할 실제 경로 생성
        String imageRealPath = uploadFileHelper.getRealPath(TpsConstants.TEMPLATE_BUSINESS, template
                .getDomain()
                .getDomainId(), newFilename);

        if (uploadFileHelper.saveImage(imageRealPath, thumbnail.getBytes())) {
            String uri = uploadFileHelper.getDbUri(TpsConstants.TEMPLATE_BUSINESS, template
                    .getDomain()
                    .getDomainId(), newFilename);
            return uri;
        } else {
            return "";
        }
    }

    @Override
    public String copyTemplateImage(Template template, String copyTargetImgPath)
            throws Exception {
        String extension = McpFile
                .getExtension(copyTargetImgPath)
                .toLowerCase();
        String newFilename = String.valueOf(template.getTemplateSeq()) + "." + extension;
        // 이미지를 저장할 실제 경로 생성
        String imageRealPath = uploadFileHelper.getRealPath(TpsConstants.TEMPLATE_BUSINESS, template
                .getDomain()
                .getDomainId(), newFilename);

        // copy할 파일 실제 경로 구함
        //        String targetRealPath = uploadFileHelper.getRealPath(TpsConstants.TEMPLATE_BUSINESS, copyTargetImgPath);

        if (uploadFileHelper.copyFile(imageRealPath, copyTargetImgPath)) {
            String uri = uploadFileHelper.getDbUri(TpsConstants.TEMPLATE_BUSINESS, template
                    .getDomain()
                    .getDomainId(), newFilename);
            return uri;
        } else {
            return "";
        }
    }

    @Override
    public boolean deleteTemplateImage(Template template)
            throws Exception {
        // 이미지 실제 경로 생성
        String imageRealPath = uploadFileHelper.getRealPathByDB(template.getTemplateThumb());
        return uploadFileHelper.deleteFile(imageRealPath);
    }

    @Override
    public TemplateVO findTemplateByComponentHist(Long componentSeq) {
        return templateMapper.findTemplateByComponentHist(componentSeq);
    }
}
