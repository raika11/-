package jmnet.moka.core.tps.mvc.template.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;

public interface TemplateMapper extends BaseMapper<TemplateVO, TemplateSearchDTO> {

	/**
	 * 템플릿을 사용하는 도메인 목록을 조회한다
	 * (공통도메인일 경우 사용하는 모든 도메인 목록을 조회해야함)
	 * @param templateSeq 템플릿아이디
	 * @return 도메인 목록
	 */
	List<String> findDomainIdListByTemplateSeq(Long templateSeq);
	
    /**
     * <pre>
     * 페이지의 관련템플릿 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 템플릿목록
     */
    List<TemplateVO> findPageChildRels(TemplateSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 페이지의 관련템플릿 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 템플릿목록 건수
     */
    Long findPageChildRelsCount(TemplateSearchDTO param);

    /**
     * <pre>
     * 콘텐츠스킨의 관련템플릿 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 템플릿목록
     */
    List<TemplateVO> findSkinChildRels(TemplateSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 콘텐츠스킨의 관련템플릿 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 템플릿목록 건수
     */
    Long findSkinChildRelsCount(TemplateSearchDTO param);

    /**
     * <pre>
     * 컨테이너의 관련템플릿 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 템플릿목록
     */
    List<TemplateVO> findContainerChildRels(TemplateSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 컨테이너의 관련템플릿 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 템플릿목록 건수
     */
    Long findContainerChildRelsCount(TemplateSearchDTO param);

    /**
     * resultSet이 여러개인 경우
     * @param param
     * @return
     * @throws RuntimeException
     */
    //List<List<Object>> findAllTest(TemplateSearchDTO param) throws RuntimeException;
}
