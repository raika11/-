package jmnet.moka.core.tps.mvc.component.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;

public interface ComponentMapper extends BaseMapper<ComponentVO, ComponentSearchDTO> {

    /**
     * 페이지의 관련컴포넌트 목록 조회
     *
     * @param param 검색조건
     * @return 컴포넌트목록
     */
    List<ComponentVO> findPageChildRelList(ComponentSearchDTO param);

    /**
     * 기사페이지의 관련컴포넌트 목록 조회
     *
     * @param param 검색조건
     * @return 컴포넌트목록
     */
    List<ComponentVO> findArticlePageChildRelList(ComponentSearchDTO param);

    /**
     * 컨테이너의 관련컴포넌트 목록 조회
     *
     * @param param 검색조건
     * @return 컴포넌트목록
     */
    List<ComponentVO> findContainerChildRelList(ComponentSearchDTO param);

}
