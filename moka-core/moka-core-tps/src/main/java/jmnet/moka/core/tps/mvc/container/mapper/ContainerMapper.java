package jmnet.moka.core.tps.mvc.container.mapper;

import java.util.List;

import org.apache.ibatis.session.RowBounds;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.container.dto.ContainerSearchDTO;
import jmnet.moka.core.tps.mvc.container.vo.ContainerVO;

public interface ContainerMapper extends BaseMapper<ContainerVO, ContainerSearchDTO> {
	
	/**
     * <pre>
     * 페이지의 관련컨테이너 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 컨테이너목록
     */
    List<ContainerVO> findPageChildRels(ContainerSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 페이지의 관련컨테이너 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 컨테이너목록 건수
     */
    Long findPageChildRelsCount(ContainerSearchDTO param);

    /**
     * <pre>
     * 콘텐츠스킨의 관련컨테이너 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 컨테이너목록
     */
    List<ContainerVO> findSkinChildRels(ContainerSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 콘텐츠스킨의 관련컨테이너 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 컨테이너목록 건수
     */
    Long findSkinChildRelsCount(ContainerSearchDTO param);
}
