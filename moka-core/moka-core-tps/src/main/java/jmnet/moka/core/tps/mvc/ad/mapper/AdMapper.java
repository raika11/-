package jmnet.moka.core.tps.mvc.ad.mapper;

import java.util.List;
import org.apache.ibatis.session.RowBounds;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.ad.dto.AdSearchDTO;
import jmnet.moka.core.tps.mvc.ad.vo.AdVO;

public interface AdMapper extends BaseMapper<AdVO, AdSearchDTO> {

    /**
     * <pre>
     * 페이지의 관련광고 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 광고목록
     */
    List<AdVO> findPageChildRels(AdSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 페이지의 관련광고 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 광고목록 건수
     */
    Long findPageChildRelsCount(AdSearchDTO param);

    /**
     * <pre>
     * 콘텐츠스킨의 관련광고 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 광고목록
     */
    List<AdVO> findSkinChildRels(AdSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 콘텐츠스킨의 관련광고 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 광고목록 건수
     */
    Long findSkinChildRelsCount(AdSearchDTO param);

    /**
     * <pre>
     * 컨테이너의 관련광고 목록 조회
     * </pre>
     * 
     * @param param 검색조건
     * @param bounds 페이징조건
     * @return 광고목록
     */
    List<AdVO> findContainerChildRels(AdSearchDTO param, RowBounds bounds);

    /**
     * <pre>
     * 컨테이너의 관련광고 목록 건수
     * </pre>
     * 
     * @param param 검색조건
     * @return 광고목록 건수
     */
    Long findContainerChildRelsCount(AdSearchDTO param);
}
