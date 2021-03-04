package jmnet.moka.core.tps.mvc.desking.mapper;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingHistSearchDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentHistVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingWorkVO;

public interface DeskingMapper extends BaseMapper<DeskingWorkVO, DeskingWorkSearchDTO> {

    /**
     * 데스킹 히스토리 그룹 목록 조회
     *
     * @param search 검색객체
     * @return 데스킹 히스토리 그룹 목록
     */
    List<ComponentHistVO> findAllComponentHistByDesking(DeskingHistSearchDTO search);

    /**
     * 편집기사히스토리를 작업자용 편집기사로 일괄 등록
     *
     * @param param componentWorkSeq:   컴포넌트 work ID, componentHistSeq:   컴포넌트 히스토리리 ID regId               작업자
     */
    void importDeskingWorkFromHist(Map<String, Object> param);

    /**
     * 예약된 데이타셋 삭제
     *
     * @param map 데이타셋순번
     */
    void deleteByReserveDatasetSeq(Map<String, Object> map);

    /**
     * 예약편집기사를 서비스에 등록
     *
     * @param param componentSeq 컴포넌트순번
     */
    void excuteReserve(Map<String, Object> param);
}
