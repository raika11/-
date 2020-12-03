package jmnet.moka.core.tps.mvc.bulk.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.bulk.dto.BulkArticleDTO;
import jmnet.moka.core.tps.mvc.bulk.dto.BulkSearchDTO;
import jmnet.moka.core.tps.mvc.bulk.entity.Bulk;
import jmnet.moka.core.tps.mvc.bulk.entity.BulkArticle;
import jmnet.moka.core.tps.mvc.bulk.entity.BulkArticlePK;
import jmnet.moka.core.tps.mvc.bulk.repository.BulkArticleRepository;
import jmnet.moka.core.tps.mvc.bulk.repository.BulkRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 벌크목록 서비스 2020. 11. 11. ssc 최초생성
 *
 * @author ssc
 * @since 2020. 11. 11. 오후 2:07:40
 */
@Service
@Slf4j
public class BulkServiceImpl implements BulkService {

    private final BulkRepository bulkRepository;

    private final BulkArticleRepository bulkArticleRepository;

    private final ModelMapper modelMapper;

    public BulkServiceImpl(BulkRepository bulkRepository, BulkArticleRepository bulkArticleRepository, ModelMapper modelMapper) {
        this.bulkRepository = bulkRepository;
        this.bulkArticleRepository = bulkArticleRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Page<Bulk> findAllBulkList(BulkSearchDTO search) {
        return bulkRepository.findAllBulkList(search);
    }

    @Override
    public List<BulkArticle> findAllByBulkartSeq(Long bulkartSeq) {
        BulkArticlePK param = new BulkArticlePK();
        param.setBulkartSeq(bulkartSeq);
        return bulkArticleRepository.findAllByBulkartSeq(param);
    }

    @Override
    public Optional<Bulk> findById(Long bulkartSeq) {
        return bulkRepository.findById(bulkartSeq);
    }

    @Override
    public void updateArticle(Bulk bulk) {
        bulkRepository.updateArticle(bulk);
    }

    @Transactional
    @Override
    public Bulk insertBulk(Bulk bulk, List<BulkArticleDTO> asList) {

        Bulk saveBulk = bulk;

        try {

            if (MokaConstants.STATUS_PUBLISH.equals(saveBulk.getStatus())) {
                saveBulk.setSendDt(McpDate.now());
            }

            // 마스터 테이블에 한건
            saveBulk = bulkRepository.save(saveBulk);

            // 상세내역 인설트
            //bulkRepository.updateArticle(saveBulk);
            for (BulkArticleDTO bulkArticleDTO : asList) {
                BulkArticle bulkArticle = modelMapper.map(bulkArticleDTO, BulkArticle.class);
                BulkArticlePK bulkArticlePK = BulkArticlePK
                        .builder()
                        .bulkartSeq(saveBulk.getBulkartSeq())
                        .ordNo((long) (asList.indexOf(bulkArticleDTO) + 1))
                        .build();
                bulkArticle.setId(bulkArticlePK);
                bulkArticleRepository.save(bulkArticle);
            }
        } catch (Exception e) {
            log.error(e.toString());
        }

        return saveBulk;
    }

    @Override
    public boolean isDuplicatedId(Long bulkartSeq) {
        Optional<Bulk> existingArticle = this.findById(bulkartSeq);
        return existingArticle.isPresent();
    }

}
