/**
 * msp-tps DatasetServiceImpl.java 2020. 4. 24. 오후 4:23:25 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jmnet.moka.common.data.mybatis.support.McpMybatis;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.helper.RelationHelper;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetSearchDTO;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.dataset.mapper.DatasetMapper;
import jmnet.moka.core.tps.mvc.dataset.repository.DatasetRepository;
import jmnet.moka.core.tps.mvc.dataset.vo.DatasetVO;
import jmnet.moka.core.tps.mvc.desking.service.DeskingService;

/**
 * <pre>
 * 
 * 2020. 4. 24. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 24. 오후 4:23:25
 * @author ssc
 */
@Service
public class DatasetServiceImpl implements DatasetService {

    private static final Logger logger = LoggerFactory.getLogger(DatasetServiceImpl.class);

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private DeskingService deskingService;

    @Autowired
    private RelationHelper relationHelper;

    @Autowired
    private DatasetMapper datasetMapper;

    @Override
    public Dataset insertDataset(Dataset dataset) {
        return datasetRepository.save(dataset);
    }

    // @Override
    // public Page<Dataset> findList(DatasetSearchDTO search, Pageable pageable) {
    // return datasetRepository.findList(search, pageable);
    // }

    @Override
    public List<DatasetVO> findList(DatasetSearchDTO search) {
        return datasetMapper.findAll(search,
                McpMybatis.getRowBounds(search.getPage(), search.getSize()));
    }

    @Override
    public Long findListCount(DatasetSearchDTO search) {
        return datasetMapper.count(search);
    }

    @Override
    public Optional<Dataset> findByDatasetSeq(Long datasetSeq) {
        return datasetRepository.findById(datasetSeq);
    }

    @Override
    public Dataset updateDataset(Dataset dataset) {
        return datasetRepository.save(dataset);
    }

    @Override
    public boolean isRelated(Long datasetSeq) {
        // desking 사용여부 조회
        if (deskingService.usedByDatasetSeq(datasetSeq))
            return true;

        // compnent, container, skin, page
        if (relationHelper.hasRelations(datasetSeq, MokaConstants.ITEM_DATASET))
            return true;

        return false;
    }

    @Override
    public void deleteDataset(Long datasetSeq) {
        // 삭제
        datasetRepository.deleteById(datasetSeq);
        logger.info("DELETE Dataset datasetSeq : {}", datasetSeq);
    }

    @Override
    public boolean deleteAfterCheckDataset(Long datasetSeq) {
        // 사용여부 조사
        if (isRelated(datasetSeq))
            return false;

        // 삭제
        datasetRepository.deleteById(datasetSeq);
        logger.info("DELETE Dataset datasetSeq : {}", datasetSeq);

        return true;
    }
}
