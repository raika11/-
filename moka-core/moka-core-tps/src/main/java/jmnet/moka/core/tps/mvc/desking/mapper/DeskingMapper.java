package jmnet.moka.core.tps.mvc.desking.mapper;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingHistSearchDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentHistVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingWorkVO;

public interface DeskingMapper extends BaseMapper<DeskingWorkVO, DeskingWorkSearchDTO> {

    //    /**
    //     * <pre>
    //     * 페이지의 모든 Work 편집데이타 조회(복수)
    //     *
    //     * <pre>
    //     *
    //     * @param search 검색조건
    //     * @return  페이지의 모든 편집기사목록
    //     */
    //    List<DeskingWorkVO> findDeskingWorkAll(DeskingWorkSearchDTO search);


    //    /**
    //     * <pre>
    //     * Work 편집데이타 조회(단수)
    //     *
    //     * <pre>
    //     *
    //     * @param search 검색조건
    //     * @return 페이지의 편집기사목록
    //     */
    //    List<DeskingWorkVO> findDeskingWork(DeskingWorkSearchDTO search);

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
     * @param param     componentWorkSeq:   컴포넌트 work ID,
     *                  componentHistSeq:   컴포넌트 히스토리리 ID
     *                  regId               작업자
     */
    void importDeskingWorkFromHist(Map<String, Object> param);

}
