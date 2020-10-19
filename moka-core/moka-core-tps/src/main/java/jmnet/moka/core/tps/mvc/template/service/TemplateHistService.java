package jmnet.moka.core.tps.mvc.template.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;

public interface TemplateHistService {

    /**
     * <pre>
     * 히스토리 조회
     * </pre>
     * 
     * @param templateSeq 템플릿SEQ
     * @param search 검색조건
     * @param pageable pageable
     * @return 히스토리 리스트
     */
    public Page<TemplateHist> findAllTemplateHist(Long templateSeq, SearchDTO search, Pageable pageable);

    /**
     * <pre>
     * 히스토리 정보 조회
     * </pre>
     * 
     * @param seq 순번
     * @return 히스토리 정보
     */
    public Optional<TemplateHist> findTemplateHistBySeq(Long seq);

    /**
     * <pre>
     * 히스토리 추가
     * </pre>
     * 
     * @param templateHist 템플릿 히스토리
     * @return 히스토리
     * @throws Exception 에러
     */
    public TemplateHist insertTemplateHist(TemplateHist templateHist) throws Exception;
    
    /**
     * 히스토리 추가
     * @param template 템플릿
     * @return 히스토리
     * @throws Exception 에러
     */
    public TemplateHist insertTemplateHist(Template template) throws Exception;
}
