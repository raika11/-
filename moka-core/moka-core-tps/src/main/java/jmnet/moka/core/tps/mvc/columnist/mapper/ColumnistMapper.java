package jmnet.moka.core.tps.mvc.columnist.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.columnist.dto.ColumnistSearchDTO;
import jmnet.moka.core.tps.mvc.columnist.vo.ColumnistVO;

public interface ColumnistMapper extends BaseMapper<ColumnistVO, ColumnistSearchDTO> {

    /**
     * 컬럼니스트 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<ColumnistVO> findAllList(ColumnistSearchDTO searchDTO);

    /**
     * 컬럼니스트 상세 조회
     *
     * @param seqNo 검색 조건
     * @return 조회 결과
     */
    ColumnistVO findById(String seqNo);
}
