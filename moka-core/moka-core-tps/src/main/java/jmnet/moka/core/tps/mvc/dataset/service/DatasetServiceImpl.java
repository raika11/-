/**
 * msp-tps DatasetServiceImpl.java 2020. 4. 24. 오후 4:23:25 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetSearchDTO;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.dataset.mapper.DatasetMapper;
import jmnet.moka.core.tps.mvc.dataset.repository.DatasetRepository;
import jmnet.moka.core.tps.mvc.dataset.vo.DatasetVO;
import jmnet.moka.core.tps.mvc.desking.service.DeskingService;
import jmnet.moka.core.tps.mvc.relation.service.RelationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * 2020. 4. 24. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 4. 24. 오후 4:23:25
 */
@Service
@Slf4j
public class DatasetServiceImpl implements DatasetService {

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private DeskingService deskingService;

    @Autowired
    private RelationService relationService;

    @Autowired
    private DatasetMapper datasetMapper;

    @Override
    public Dataset insertDataset(Dataset dataset) {
        return datasetRepository.save(dataset);
    }

    @Override
    public List<DatasetVO> findAllDataset(DatasetSearchDTO search) {
        return datasetMapper.findAll(search);
    }

    @Override
    public Optional<Dataset> findDatasetBySeq(Long datasetSeq) {
        return datasetRepository.findById(datasetSeq);
    }

    @Override
    public Dataset updateDataset(Dataset dataset) {
        return datasetRepository.save(dataset);
    }

    @Override
    public boolean isRelated(Long datasetSeq) {
        // desking 사용여부 조회
        if (deskingService.usedByDatasetSeq(datasetSeq)) {
            return true;
        }

        // compnent, container, skin, page
        if (relationService.hasRelations(datasetSeq, MokaConstants.ITEM_DATASET)) {
            return true;
        }

        return false;
    }

    @Override
    public void deleteDataset(Long datasetSeq) {
        // 삭제
        datasetRepository.deleteById(datasetSeq);
        log.info("DELETE Dataset datasetSeq : {}", datasetSeq);
    }

    @Override
    public boolean deleteAfterCheckDataset(Long datasetSeq) {
        // 사용여부 조사
        if (isRelated(datasetSeq)) {
            return false;
        }

        // 삭제
        datasetRepository.deleteById(datasetSeq);
        log.info("DELETE Dataset datasetSeq : {}", datasetSeq);

        return true;
    }
}
