package jmnet.moka.core.tps.mvc.template.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 * 템플릿 서비스
 * 2020. 1. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 1. 14. 오후 1:35:04
 */
public interface TemplateService {

    /**
     * 템플릿 목록 조회(Mybatis)
     *
     * @param search 검색조건
     * @return 목록
     */
    public List<TemplateVO> findAllTemplate(TemplateSearchDTO search);

    /**
     * <pre>
     * 템플릿 조회
     * </pre>
     *
     * @param templateSeq 템플릿SEQ
     * @return 템플릿
     * @throws NoDataException 데이터없음 예외처리
     */
    public Optional<Template> findTemplateBySeq(Long templateSeq)
            throws NoDataException;

    /**
     * <pre>
     * 템플릿 등록
     * </pre>
     *
     * @param template 템플릿
     * @return 템플릿
     * @throws Exception 에러
     */
    public Template insertTemplate(Template template)
            throws Exception;

    /**
     * 템플릿 등록
     *
     * @param template    템플릿
     * @param historySave 히스토리 저장 true|false
     * @return 템플릿
     * @throws Exception 에러
     */
    public Template insertTemplate(Template template, boolean historySave)
            throws Exception;

    /**
     * <pre>
     * 템플릿 수정
     * </pre>
     *
     * @param template 템플릿
     * @return 템플릿
     * @throws Exception 에러
     */
    public Template updateTemplate(Template template)
            throws Exception;

    /**
     * 템플릿 수정
     *
     * @param template    템플릿
     * @param historySave 히스토리 저장 true|false
     * @return 템플릿
     * @throws Exception 에러
     */
    public Template updateTemplate(Template template, boolean historySave)
            throws Exception;

    /**
     * <pre>
     * 템플릿 삭제
     * </pre>
     *
     * @param template 템플릿
     * @throws Exception 에러
     */
    public void deleteTemplate(Template template)
            throws Exception;

    /**
     * 도메인아이디와 관련된 템플릿수
     *
     * @param domainId 도메인아이디
     * @return 템플릿수
     */
    public int countTemplateByDomainId(String domainId);

    /**
     * 템플릿을 사용하는 모든 도메인 조회
     * @param templateSeq 템플릿SEQ
     * @return 도메인아이디 목록
     */
    //    public List<String> findDomainIdListByTemplateSeq(Long templateSeq);

    /**
     * 썸네일 이미지 저장
     *
     * @param template  템플릿
     * @param thumbnail 썸네일 이미지(Multipart)
     * @return 이미지 uri
     * @throws Exception 예외처리
     */
    public String saveTemplateImage(Template template, MultipartFile thumbnail)
            throws Exception;

    /**
     * 썸네일 이미지 복사
     *
     * @param template          템플릿
     * @param copyTargetImgPath 복사 대상 이미지(/image/template/ 제외)
     * @return 이미지 uri
     * @throws Exception 예외처리
     */
    public String copyTemplateImage(Template template, String copyTargetImgPath)
            throws Exception;

    /**
     * 썸네일 이미지 삭제
     *
     * @param template 템플릿
     * @return 삭제 결과
     * @throws Exception 예외처리
     */
    public boolean deleteTemplateImage(Template template)
            throws Exception;

    /**
     * 컴포넌트의 최종 템플릿 정보를 조회한다.(네이버채널에서 사용)
     *
     * @param componentSeq 컴포넌트순번
     * @return 템플릿 정보
     */
    TemplateVO findTemplateByComponentHist(Long componentSeq);
}
