package jmnet.moka.core.tps.mvc.sns.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.tps.common.code.SnsStatusCode;
import jmnet.moka.core.tps.common.code.SnsTypeCode;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareMetaSearchDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.dto.SnsDeleteDTO;
import jmnet.moka.core.tps.mvc.sns.dto.SnsPublishDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsSharePK;
import jmnet.moka.core.tps.mvc.sns.mapper.ArticleSnsShareMapper;
import jmnet.moka.core.tps.mvc.sns.repository.ArticleSnsShareRepository;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * SNS 기사 Service Implementation
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.service
 * ClassName : ArticleSnsShareServiceImpl
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 11:17
 */
@Slf4j
@Service
public class ArticleSnsShareServiceImpl implements ArticleSnsShareService {

    private final ArticleSnsShareRepository articleSnsShareRepository;

    private final ArticleSnsShareMapper articleSnsShareMapper;

    private final SnsApiService facebookApiService;

    private final SnsApiService twitterApiService;

    public ArticleSnsShareServiceImpl(ArticleSnsShareRepository articleSnsShareRepository, ArticleSnsShareMapper articleSnsShareMapper,
            @Qualifier("facebookApiService") SnsApiService facebookApiService, @Qualifier("twitterApiService") SnsApiService twitterApiService) {
        this.articleSnsShareRepository = articleSnsShareRepository;
        this.articleSnsShareMapper = articleSnsShareMapper;
        this.facebookApiService = facebookApiService;
        this.twitterApiService = twitterApiService;
    }

    @Override
    public Page<ArticleSnsShare> findAllArticleSnsShare(ArticleSnsShareMetaSearchDTO searchDTO) {
        return articleSnsShareRepository.findAllArticleSnsShare(searchDTO);
    }

    @Override
    public Optional<ArticleSnsShare> findArticleSnsShareById(Long totalId) {
        ArticleSnsShare articleSnsShare = null;
        List<ArticleSnsShare> list = articleSnsShareRepository.findByIdTotalId(totalId);
        if (list != null && list.size() > 0) {
            articleSnsShare = list.get(0);
        }
        return Optional.ofNullable(articleSnsShare);
    }

    @Override
    public Optional<ArticleSnsShare> findArticleSnsShareById(Long totalId, SnsTypeCode type) {
        if (McpString.isNotEmpty(type)) {
            return articleSnsShareRepository.findById(ArticleSnsSharePK
                    .builder()
                    .totalId(totalId)
                    .snsType(type)
                    .build());
        } else {
            return findArticleSnsShareById(totalId);
        }
    }

    @Override
    public Optional<ArticleSnsShare> findArticleSnsShareById(ArticleSnsSharePK id) {
        return articleSnsShareRepository.findById(id);
    }

    @Override
    public ArticleSnsShare insertArticleSnsShare(ArticleSnsShare entity) {
        return articleSnsShareRepository.save(entity);
    }

    @Override
    public int insertFbInstanceArticle(ArticleSnsShareItemVO vo) {
        return articleSnsShareMapper.insertFbInstanceArticle(vo);
    }

    @Override
    public ArticleSnsShare updateArticleSnsShare(ArticleSnsShare entity) {
        return articleSnsShareRepository.save(entity);
    }

    @Override
    public ArticleSnsShare updateArticleSnsShareStatus(ArticleSnsShare entity)
            throws NoDataException {
        ArticleSnsShare share = findArticleSnsShareById(entity.getId()).orElseThrow(() -> new NoDataException());

        share.setSnsArtId(entity.getSnsArtId());
        share.setSnsArtSts(entity.getSnsArtSts());
        share.setSnsInsDt(McpDate.now());

        if (entity
                .getSnsArtSts()
                .equals(SnsStatusCode.I.getCode())) {
            share.setSnsRegDt(McpDate.now());
        }
        return articleSnsShareRepository.save(share);
    }

    @Override
    public void deleteArticleSnsShare(ArticleSnsShare entity) {
        articleSnsShareRepository.delete(entity);
    }

    @Override
    public void deleteArticleSnsShareById(Long totalId, SnsTypeCode snsType) {
        articleSnsShareRepository.deleteById(ArticleSnsSharePK
                .builder()
                .totalId(totalId)
                .snsType(snsType)
                .build());
    }

    @Override
    public Page<ArticleSnsShareItemVO> findAllSendArticle(ArticleSnsShareSearchDTO searchDTO) {
        List<ArticleSnsShareItemVO> articleSnsShareList = articleSnsShareMapper.findAll(searchDTO);
        return new PageImpl<>(articleSnsShareList, searchDTO.getPageable(), searchDTO.getTotal());
    }

    @Override
    public ArticleSnsShare publishSnsArticleSnsShare(SnsPublishDTO snsPublish)
            throws Exception {

        ArticleSnsShare share = null;
        // insert

        Map<String, Object> result = getSnsAipService(snsPublish.getSnsType()).publish(SnsPublishDTO
                .builder()
                .totalId(snsPublish.getTotalId())
                .snsType(snsPublish.getSnsType())
                .message(snsPublish.getMessage())
                .build());

        if (McpString.isNotEmpty(result.getOrDefault("id", ""))) {
            share = updateArticleSnsShareStatus(ArticleSnsShare
                    .builder()
                    .id(ArticleSnsSharePK
                            .builder()
                            .totalId(snsPublish.getTotalId())
                            .snsType(snsPublish.getSnsType())
                            .build())
                    .snsArtId(String.valueOf(result.get("id")))
                    .snsArtSts(SnsStatusCode.I.getCode())
                    .build());
        }
        return share;
    }

    @Override
    public ArticleSnsShare deleteSnsArticleSnsShare(SnsDeleteDTO snsDelete)
            throws Exception {
        ArticleSnsShare share = null;

        // 삭제
        Map<String, Object> result = getSnsAipService(snsDelete.getSnsType()).delete(SnsDeleteDTO
                .builder()
                .snsId(snsDelete.getSnsId())
                .snsType(snsDelete.getSnsType())
                .totalId(snsDelete.getTotalId())
                .build());

        if (McpString.isNotEmpty(result.getOrDefault("id", ""))) {
            share = updateArticleSnsShareStatus(ArticleSnsShare
                    .builder()
                    .id(ArticleSnsSharePK
                            .builder()
                            .totalId(snsDelete.getTotalId())
                            .snsType(snsDelete.getSnsType())
                            .build())
                    .snsArtId(snsDelete.getSnsId())
                    .snsArtSts(SnsStatusCode.D.getCode())
                    .build());

        }

        return share;
    }


    /**
     * 예약 배포 처리
     *
     * @param snsPublish SNS 공유 정보
     * @throws MokaException
     */
    @Async
    public void reservePublishSnsArticleSnsShare(SnsPublishDTO snsPublish)
            throws Exception {
        try {
            Thread.sleep(McpDate.term(snsPublish.getReserveDt()));
            publishSnsArticleSnsShare(snsPublish);
        } catch (InterruptedException ie) {
            log.error("SNS Share publish failed : {}", snsPublish.getTotalId(), ie);
        }
    }

    /**
     * 예약 배포 처리
     *
     * @param snsDelete SNS 삭제 정보
     * @throws MokaException
     */
    @Async
    public void reserveDeleteSnsArticleSnsShare(SnsDeleteDTO snsDelete)
            throws Exception {
        try {
            Thread.sleep(McpDate.term(snsDelete.getReserveDt()));
            deleteSnsArticleSnsShare(snsDelete);
        } catch (InterruptedException ie) {
            log.error("SNS Share delete failed : {}", snsDelete.getSnsId(), ie);
        }
    }

    private SnsApiService getSnsAipService(SnsTypeCode snsTypeCode) {
        return snsTypeCode == SnsTypeCode.FB ? facebookApiService : twitterApiService;
    }
}
