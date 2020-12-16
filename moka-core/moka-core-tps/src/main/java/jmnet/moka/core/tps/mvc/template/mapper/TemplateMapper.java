package jmnet.moka.core.tps.mvc.template.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSearchDTO;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;

public interface TemplateMapper extends BaseMapper<TemplateVO, TemplateSearchDTO> {

    /**
     * 페이지의 관련템플릿 목록 조회
     *
     * @param param 검색조건
     * @return 템플릿목록
     */
    List<TemplateVO> findPageChildRelList(TemplateSearchDTO param);

    /**
     * 기사페이지의 관련템플릿 목록 조회
     *
     * @param param 검색조건
     * @return 템플릿목록
     */
    List<TemplateVO> findArticlePageChildRelList(TemplateSearchDTO param);

    /**
     * 컨테이너의 관련템플릿 목록 조회
     *
     * @param param 검색조건
     * @return 템플릿목록
     */
    List<TemplateVO> findContainerChildRelList(TemplateSearchDTO param);

    //    /**
    //     * resultSet이 여러개인 경우
    //     * @param param
    //     * @return
    //     * @throws RuntimeException
    //     */
    //    List<List<Object>> findAllTest(TemplateSearchDTO param) throws RuntimeException;

    /**
     * 컴포넌트의 최종 템플릿 정보를 조회한다.(네이버채널에서 사용)
     *
     * @param componentSeq 컴포넌트순번
     * @return 템플릿정보
     */
    TemplateVO findTemplateByComponentHist(Long componentSeq);
}
