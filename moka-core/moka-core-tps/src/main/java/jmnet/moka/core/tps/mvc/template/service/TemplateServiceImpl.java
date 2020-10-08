package jmnet.moka.core.tps.mvc.template.service;

import static jmnet.moka.common.data.mybatis.support.McpMybatis.getRowBounds;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import jmnet.moka.common.utils.dto.ResultListDTO;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;
import jmnet.moka.core.tps.mvc.template.mapper.TemplateMapper;
import jmnet.moka.core.tps.mvc.template.repository.TemplateRepository;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;

/**
 * <pre>
 * 템플릿 서비스 구현체
 * 2020. 1. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 1. 14. 오후 1:35:42
 * @author jeon
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
    public List<TemplateVO> findList(TemplateSearchDTO search) {
        if (search.getSearchType().equals("pageSeq") && McpString.isNotEmpty(search.getKeyword())) {	// 페이지에서 관련 템플릿 검색
            return templateMapper.findPageChildRels(search,
                    getRowBounds(search.getPage(), search.getSize()));
        } else if (search.getSearchType().equals("skinSeq")
                && McpString.isNotEmpty(search.getKeyword())) {	// 콘텐츠스킨에서 관련 템플릿 검색
            return templateMapper.findSkinChildRels(search,
                    getRowBounds(search.getPage(), search.getSize()));
        } else if (search.getSearchType().equals("containerSeq")
                && McpString.isNotEmpty(search.getKeyword())) {	// 컨테이너에서 관련 템플릿 검색
            return templateMapper.findContainerChildRels(search,
                    getRowBounds(search.getPage(), search.getSize()));
        } else {
            if (search.getSearchType().equals("pageSeq") || search.getSearchType().equals("skinSeq")
                    || search.getSearchType().equals("containerSeq")) {
                search.clearSort();
                search.addSort("templateSeq,desc");
            }
//            return templateMapper.findAll(search, getRowBounds(search.getPage(), search.getSize()));
//            List<List<Object>> listMap = templateMapper.findAllTest(search);
//            return null;
            return templateMapper.findAll(search);
        }
    }

    @Override
    public Long findListCount(TemplateSearchDTO search) {
        if (search.getSearchType().equals("pageSeq") && McpString.isNotEmpty(search.getKeyword())) {
            return templateMapper.findPageChildRelsCount(search);
        } else if (search.getSearchType().equals("skinSeq")
                && McpString.isNotEmpty(search.getKeyword())) {
            return templateMapper.findSkinChildRelsCount(search);
        } else if (search.getSearchType().equals("containerSeq")
                && McpString.isNotEmpty(search.getKeyword())) {
            return templateMapper.findContainerChildRelsCount(search);
        } else {
            return templateMapper.count(search);
        }
    }

    @Override
    public Optional<Template> findByTemplateSeq(Long templateSeq) throws NoDataException {
        return templateRepository.findById(templateSeq);
    }

    @Override
    @Transactional
    public Template insertTemplate(Template template) throws Exception {
        Template returnVal = templateRepository.save(template);
        log.debug("Insert Template {}", returnVal.getTemplateSeq());

        // 히스토리 생성
        templateHistService.insertHistory(returnVal);
        log.debug("Insert Template History {}", returnVal.getTemplateSeq());

        entityManager.refresh(returnVal);
        return returnVal;
    }

    @Override
    @Transactional
    public Template updateTemplate(Template template) throws Exception {
        Template returnVal = templateRepository.save(template);
        log.debug("Update Template {}", template.getTemplateSeq());

        // 히스토리 생성
        TemplateHist hist = TemplateHist.builder().regDt(template.getModDt())
                .regId(template.getModId()).templateBody(template.getTemplateBody())
                .template(template).build();
        if (template.getDomain() != null) {
            hist.setDomainId(template.getDomain().getDomainId());
        }
        templateHistService.insertHistory(hist);
        log.debug("Insert Template History {}", returnVal.getTemplateSeq());

        return returnVal;
    }

    @Override
    public void deleteTemplate(Template template) throws Exception {

        templateRepository.deleteById(template.getTemplateSeq());
        log.debug("Delete Template {}", template.getTemplateSeq());
    }

    @Override
    public Template insertTemplate(Template template, boolean historySave) throws Exception {
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
    public Template updateTemplate(Template template, boolean historySave) throws Exception {
        if (historySave) {
            return this.updateTemplate(template);
        } else {
            Template returnVal = templateRepository.save(template);
            log.debug("Insert Template {}", returnVal.getTemplateSeq());
            return returnVal;
        }
    }

    @Override
    public Page<Template> findList(TemplateSearchDTO search, Pageable pageable) {
        return templateRepository.findList(search, pageable);
    }

    @Override
    public int countByDomainId(String domainId) {
        return templateRepository.countByDomain_DomainId(domainId);
    }

    @Override
    public List<String> findDomainIdListByTemplateSeq(Long templateSeq) {
        return templateMapper.findDomainIdListByTemplateSeq(templateSeq);
    }

    @Override
    public String saveTemplateImage(Template template, MultipartFile thumbnail) throws Exception {
        String extension = McpFile.getExtension(thumbnail.getOriginalFilename()).toLowerCase();
        String newFilename = String.valueOf(template.getTemplateSeq()) + "." + extension;
        // 이미지를 저장할 실제 경로 생성
        String imageRealPath =
                template.getDomain() != null
                        ? uploadFileHelper.getRealPath("template",
                                template.getDomain().getDomainId(), newFilename)
                        : uploadFileHelper.getRealPath("template", newFilename);

        if (uploadFileHelper.saveImage(imageRealPath, thumbnail.getBytes())) {
            String uri = uploadFileHelper.getUri(imageRealPath);
            return uri;
        } else {
            return "";
        }
    }

    @Override
    public String copyTemplateImage(Template template, String copyTargetImgPath) throws Exception {
        String extension = McpFile.getExtension(copyTargetImgPath).toLowerCase();
        String newFilename = String.valueOf(template.getTemplateSeq()) + "." + extension;
        // 이미지를 저장할 실제 경로 생성
        String imageRealPath =
                template.getDomain() != null
                        ? uploadFileHelper.getRealPath("template",
                                template.getDomain().getDomainId(), newFilename)
                        : uploadFileHelper.getRealPath("template", newFilename);

        // copy할 파일 실제 경로 구함
        String targetRealPath = uploadFileHelper.getRealPath("template", copyTargetImgPath);

        if (uploadFileHelper.copyFile(imageRealPath, targetRealPath)) {
            String uri = uploadFileHelper.getUri(imageRealPath);
            return uri;
        } else {
            return "";
        }
    }

    @Override
    public boolean deleteTemplateImage(Template template) throws Exception {
        String thumbnailPath = template.getTemplateThumb();
        thumbnailPath = thumbnailPath.replace("template/", "");
        // 이미지 실제 경로 생성
        String imageRealPath = uploadFileHelper.getRealPath("template", thumbnailPath);
        return uploadFileHelper.deleteFile(imageRealPath);
    }
}
