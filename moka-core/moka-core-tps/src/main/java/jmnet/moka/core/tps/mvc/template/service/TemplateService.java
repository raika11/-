package jmnet.moka.core.tps.mvc.template.service;

import java.util.List;
import java.util.Optional;

import jmnet.moka.common.utils.dto.ResultListDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;

/**
 * <pre>
 * 템플릿 서비스
 * 2020. 1. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 1. 14. 오후 1:35:04
 * @author jeon
 */
public interface TemplateService {
    
    /**
     * 템플릿 목록 조회(Mybatis)
     * @param search 검색조건
     * @return 목록
     */
    public List<TemplateVO> findList(TemplateSearchDTO search);
    
    /**
     * 템플릿 목록 카운트 조회(Mybatis)
     * @param search 검색조건
     * @return 갯수
     */
    public Long findListCount(TemplateSearchDTO search);
    
    /**
     * 템플릿 목록 조회
     * @param search 검색조건
     * @param pageable 페이지조건
     * @return 목록
     */
    public Page<Template> findList(TemplateSearchDTO search, Pageable pageable);

    /**
     * <pre>
     * 템플릿 조회
     * </pre>
     * 
     * @param templateSeq 템플릿아이디
     * @return 템플릿
     * @throws NoDataException 데이터없음 예외처리
     */
    public Optional<Template> findByTemplateSeq(Long templateSeq) throws NoDataException;

    /**
     * <pre>
     * 템플릿 등록
     * </pre>
     * 
     * @param template 템플릿
     * @return 템플릿
     * @throws Exception 에러
     */
    public Template insertTemplate(Template template) throws Exception;
    
    /**
     * 템플릿 등록
     * @param template 템플릿
     * @param historySave 히스토리 저장 true|false
     * @return 템플릿
     * @throws Exception 에러
     */
    public Template insertTemplate(Template template, boolean historySave) throws Exception;

    /**
     * <pre>
     * 템플릿 수정
     * </pre>
     * 
     * @param template 템플릿
     * @return 템플릿
     * @throws Exception 에러
     */
    public Template updateTemplate(Template template) throws Exception;
    
    /**
     * 템플릿 수정
     * @param template 템플릿
     * @param historySave 히스토리 저장 true|false
     * @return 템플릿
     * @throws Exception 에러
     */
    public Template updateTemplate(Template template, boolean historySave) throws Exception;

    /**
     * <pre>
     * 템플릿 삭제
     * </pre>
     * 
     * @param template 템플릿
     * @throws Exception 에러
     */
    public void deleteTemplate(Template template) throws Exception;
        
    /**
     * 도메인아이디와 관련된 템플릿수
     * @param domainId 도메인아이디
     * @return 템플릿수
     */
    public int countByDomainId(String domainId);
    
    /**
     * 템플릿을 사용하는 모든 도메인 조회
     * @param templateSeq 템플릿아이디
     * @return 도메인아이디 목록
     */
    public List<String> findDomainIdListByTemplateSeq(Long templateSeq);
    
    /**
     * 썸네일 이미지 저장
     * @param template 템플릿
     * @param thumbnail 썸네일 이미지(Multipart)
     * @return 이미지 uri
     * @throws Exception 예외처리
     */
    public String saveTemplateImage(Template template, MultipartFile thumbnail) throws Exception;
    
    /**
     * 썸네일 이미지 복사
     * @param template 템플릿
     * @param copyTargetImgPath 복사 대상 이미지(/image/template/ 제외)
     * @return 이미지 uri
     * @throws Exception 예외처리
     */
    public String copyTemplateImage(Template template, String copyTargetImgPath) throws Exception;
    
    /**
     * 썸네일 이미지 삭제
     * @param template 템플릿
     * @return 삭제 결과
     * @throws Exception 예외처리
     */
    public boolean deleteTemplateImage(Template template) throws Exception;
}
