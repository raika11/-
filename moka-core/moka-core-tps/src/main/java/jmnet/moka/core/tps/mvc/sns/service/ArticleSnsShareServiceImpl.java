package jmnet.moka.core.tps.mvc.sns.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.sns.SnsApiService;
import jmnet.moka.core.common.sns.SnsDeleteDTO;
import jmnet.moka.core.common.sns.SnsPublishDTO;
import jmnet.moka.core.common.sns.SnsStatusCode;
import jmnet.moka.core.common.sns.SnsTypeCode;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareMetaSearchDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsSharePK;
import jmnet.moka.core.tps.mvc.sns.mapper.ArticleSnsShareMapper;
import jmnet.moka.core.tps.mvc.sns.repository.ArticleSnsShareRepository;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
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

    private final CodeMgtService codeMgtService;

    @Value("${sns.facebook.token-code}")
    private String facebookTokenCode;

    @Value("${moka.schedule-server.reserved-task.url}")
    private String reservedTaskUrl;

    /**
     * 외부 API URL 호출용
     */
    @Autowired
    protected RestTemplateHelper restTemplateHelper;



    public ArticleSnsShareServiceImpl(ArticleSnsShareRepository articleSnsShareRepository, ArticleSnsShareMapper articleSnsShareMapper,
            @Qualifier("facebookApiService") SnsApiService facebookApiService, @Qualifier("twitterApiService") SnsApiService twitterApiService,
            CodeMgtService codeMgtService) {
        this.articleSnsShareRepository = articleSnsShareRepository;
        this.articleSnsShareMapper = articleSnsShareMapper;
        this.facebookApiService = facebookApiService;
        this.twitterApiService = twitterApiService;
        this.codeMgtService = codeMgtService;
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
        SnsPublishDTO pubInfo = SnsPublishDTO
                .builder()
                .totalId(snsPublish.getTotalId())
                .snsType(snsPublish.getSnsType())
                .message(snsPublish.getMessage())
                .build();

        if (pubInfo
                .getSnsType()
                .equals(SnsTypeCode.FB)) {
            CodeMgt tokenCode = codeMgtService
                    .findByDtlCd(facebookTokenCode)
                    .orElseThrow(() -> new NoDataException("Not Found Facebook Token"));
            pubInfo.setTokenCode(tokenCode.getCdNm());
        }

        Map<String, Object> result = getSnsAipService(pubInfo.getSnsType()).publish(pubInfo);



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

        SnsDeleteDTO delInfo = SnsDeleteDTO
                .builder()
                .snsId(snsDelete.getSnsId())
                .snsType(snsDelete.getSnsType())
                .totalId(snsDelete.getTotalId())
                .build();

        if (delInfo
                .getSnsType()
                .equals(SnsTypeCode.FB)) {
            CodeMgt tokenCode = codeMgtService
                    .findByDtlCd(facebookTokenCode)
                    .orElseThrow(() -> new NoDataException("Not Found Facebook Token"));
            delInfo.setTokenCode(tokenCode.getCdNm());
        }

        // 삭제
        Map<String, Object> result = getSnsAipService(snsDelete.getSnsType()).delete(delInfo);

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
    //@Async
    public String reservePublishSnsArticleSnsShare(SnsPublishDTO snsPublish)
            throws Exception {
        String result = null;
        try {
            String jobCd = TpsConstants.SNS_RESERVED_PUBLISH_JOB_CD;
            String paramDesc = ResourceMapper
                    .getDefaultObjectMapper()
                    .writeValueAsString(snsPublish);
            ResponseEntity<String> responseEntity = restTemplateHelper.post(reservedTaskUrl, MapBuilder
                    .getInstance()
                    .add("jobCd", TpsConstants.SNS_RESERVED_PUBLISH_JOB_CD)
                    .add("jobTaskId", jobCd + "_" + snsPublish.getTotalId())
                    .add("paramDesc", paramDesc)
                    .add("reserveDt", McpDate.dateTimeStr(snsPublish.getReserveDt()))
                    .getMultiValueMap());

            result = responseEntity.getBody();

        } catch (InterruptedException ie) {
            log.error("SNS Share publish failed : {}", snsPublish.getTotalId(), ie);
        }
        return result;
    }

    /**
     * 예약 배포 처리
     *
     * @param snsDelete SNS 삭제 정보
     * @throws MokaException
     */
    public String reserveDeleteSnsArticleSnsShare(SnsDeleteDTO snsDelete)
            throws Exception {
        String result = null;
        try {
            String jobCd = TpsConstants.SNS_RESERVED_DELETE_JOB_CD;
            String paramDesc = ResourceMapper
                    .getDefaultObjectMapper()
                    .writeValueAsString(snsDelete);
            ResponseEntity<String> responseEntity = restTemplateHelper.post(reservedTaskUrl, MapBuilder
                    .getInstance()
                    .add("jobCd", TpsConstants.SNS_RESERVED_DELETE_JOB_CD)
                    .add("jobTaskId", jobCd + "_" + snsDelete.getTotalId())
                    .add("paramDesc", paramDesc)
                    .add("reserveDt", McpDate.dateTimeStr(snsDelete.getReserveDt()))
                    .getMultiValueMap());

            result = responseEntity.getBody();
        } catch (InterruptedException ie) {
            log.error("SNS Share delete failed : {}", snsDelete.getSnsId(), ie);
        }
        return result;
    }

    private SnsApiService getSnsAipService(SnsTypeCode snsTypeCode) {
        return snsTypeCode == SnsTypeCode.FB ? facebookApiService : twitterApiService;
    }
}
