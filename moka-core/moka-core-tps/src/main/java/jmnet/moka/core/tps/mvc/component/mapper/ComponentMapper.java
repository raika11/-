package jmnet.moka.core.tps.mvc.component.mapper;

import java.util.List;
import org.apache.ibatis.session.RowBounds;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;

public interface ComponentMapper extends BaseMapper<ComponentVO, ComponentSearchDTO> {

    /**
     * <pre>
     * 페이지의 관련컴포넌트 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 컴포넌트목록
     */
    List<ComponentVO> findPageChildRels(ComponentSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 페이지의 관련컴포넌트 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 컴포넌트목록 건수
     */
    Long findPageChildRelsCount(ComponentSearchDTO param);

    /**
     * <pre>
     * 콘텐츠스킨의 관련컴포넌트 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 컴포넌트목록
     */
    List<ComponentVO> findSkinChildRels(ComponentSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 콘텐츠스킨의 관련컴포넌트 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 컴포넌트목록 건수
     */
    Long findSkinChildRelsCount(ComponentSearchDTO param);

    /**
     * <pre>
     * 컨테이너의 관련컴포넌트 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 컴포넌트목록
     */
    List<ComponentVO> findContainerChildRels(ComponentSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 컨테이너의 관련컴포넌트 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 컴포넌트목록 건수
     */
    Long findContainerChildRelsCount(ComponentSearchDTO param);
}
