/**
 * msp-tps DatasetService.java 2020. 4. 24. 오후 4:22:39 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetSearchDTO;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.dataset.vo.DatasetVO;

/**
 * <pre>
 * 
 * 2020. 4. 24. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 24. 오후 4:22:39
 * @author ssc
 */
public interface DatasetService {

    /**
     * <pre>
      * 데이타셋 등록
     * </pre>
     * 
     * @param dataset 등록할 데이타셋 정보
     * @return 등록된 데이타셋 정보
     */
    public Dataset insertDataset(Dataset dataset);

    /**
     * 데이타셋정보 목록 조회
     * 
     * @param search 검색조건
     * @return 데이타셋정보 목록
     */
    public List<DatasetVO> findAllDataset(DatasetSearchDTO search);

    /**
     * 데이타셋정보 조회
     * 
     * @param datasetSeq 데이타셋순번
     * @return 데이타셋정보
     */
    public Optional<Dataset> findDatasetBySeq(Long datasetSeq);

    /**
     * <pre>
      * 데이타셋 수정
     * </pre>
     * 
     * @param dataset 수정될 데이타셋 정보
     * @return 수정된 데이타셋정보
     */
    public Dataset updateDataset(Dataset dataset);

    /**
     * 데이타셋이 사용됐는지 조사(데스킹여부,CP/CT/CS/PG사용여부)
     * 
     * @param datasetSeq 데이타셋순번
     * @return 사용했으면 true
     */
    public boolean isRelated(Long datasetSeq);

    /**
     * 데이타셋 삭제
     * 
     * @param datasetSeq 삭제할 데이타셋순번
     */
    public void deleteDataset(Long datasetSeq);

    /**
     * 관련데이타 확인 후 데이타셋 삭제
     * 
     * @param datasetSeq 삭제할 데이타셋순번
     * @return 삭제성공시 true
     */
    public boolean deleteAfterCheckDataset(Long datasetSeq);

}
