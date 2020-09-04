/**
 * msp-tps ComponentWorkMapper.java 2020. 7. 29. 오후 4:07:10 ssc
 */
package jmnet.moka.core.tps.mvc.component.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.common.dto.WorkSearchDTO;
import jmnet.moka.core.tps.mvc.component.vo.DeskingComponentWorkVO;
import jmnet.moka.core.tps.mvc.desking.vo.EditionVO;

/**
 * <pre>
 * 
 * 2020. 7. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 7. 29. 오후 4:07:10
 * @author ssc
 */
public interface ComponentWorkMapper extends BaseMapper<DeskingComponentWorkVO, WorkSearchDTO> {

    /**
     * <pre>
     * 기존의 작업용 수동컴포넌트 삭제
     * </pre>
     * 
     * @param creator 작업
     * @return
     */
    int deleteByCreator(String creator);

    /**
     * <pre>
     * 페이지의 수동컴포넌트를 작업자용 컴포넌트로 일괄 등록
     * </pre>
     * 
     * @param param
     * @return
     */
    int bulkInsert(WorkSearchDTO param);

    /**
     * <pre>
     * 페이지에서 수동컴포넌트인 것 모두 조회
     * </pre>
     * 
     * @param param
     * @return
     */
    List<DeskingComponentWorkVO> findComponentsWorkAll(WorkSearchDTO search);

    /**
     * <pre>
     * 수동컴포넌트 조회
     * </pre>
     * 
     * @param seq work컴포넌트 순번
     * @return
     */
    DeskingComponentWorkVO findComponentsWorkBySeq(Long seq);
    

    
    List<EditionVO> findEditionAll(Long pageSeq);
}
