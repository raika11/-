package jmnet.moka.core.tps.mvc.template.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;

public interface TemplateMapper extends BaseMapper<TemplateVO, TemplateSearchDTO> {

    /**
     * <pre>
     * 페이지의 관련템플릿 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @return 템플릿목록
     */
    List<TemplateVO> findPageChildRelList(TemplateSearchDTO param);

    /**
     * <pre>
     * 콘텐츠스킨의 관련템플릿 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @return 템플릿목록
     */
    List<TemplateVO> findSkinChildRelList(TemplateSearchDTO param);

    /**
     * <pre>
     * 컨테이너의 관련템플릿 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @return 템플릿목록
     */
    List<TemplateVO> findContainerChildRelList(TemplateSearchDTO param);

    /**
     * resultSet이 여러개인 경우
     * @param param
     * @return
     * @throws RuntimeException
     */
    //List<List<Object>> findAllTest(TemplateSearchDTO param) throws RuntimeException;
}
