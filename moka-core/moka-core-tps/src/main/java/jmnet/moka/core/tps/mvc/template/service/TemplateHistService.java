package jmnet.moka.core.tps.mvc.template.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.entity.TemplateHist;

public interface TemplateHistService {

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
    public TemplateHist insertTemplateHist(TemplateHist templateHist)
            throws Exception;

    /**
     * 히스토리 추가
     *
     * @param template 템플릿
     * @return 히스토리
     * @throws Exception 에러
     */
    public TemplateHist insertTemplateHist(Template template)
            throws Exception;
}
