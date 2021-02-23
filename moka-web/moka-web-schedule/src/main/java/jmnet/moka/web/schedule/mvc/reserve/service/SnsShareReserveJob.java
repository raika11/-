package jmnet.moka.web.schedule.mvc.reserve.service;

import java.util.Map;
import java.util.Optional;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.sns.SnsApiService;
import jmnet.moka.core.common.sns.SnsDeleteDTO;
import jmnet.moka.core.common.sns.SnsPublishDTO;
import jmnet.moka.core.common.sns.SnsStatusCode;
import jmnet.moka.core.common.sns.SnsTypeCode;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.schedule.mvc.common.entity.CommonCode;
import jmnet.moka.web.schedule.mvc.common.repository.repository.CommonCodeRepository;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.mvc.gen.repository.GenContentHistoryRepository;
import jmnet.moka.web.schedule.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.web.schedule.mvc.sns.entity.ArticleSnsSharePK;
import jmnet.moka.web.schedule.mvc.sns.repository.ArticleSnsShareRepository;
import jmnet.moka.web.schedule.support.StatusFlagType;
import jmnet.moka.web.schedule.support.reserve.AbstractReserveJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * SNS 예약 배포 처리 Service
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.reserve.service
 * ClassName : ArticleSnsShareServiceImpl
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:33
 */
@Slf4j
@Component
public class SnsShareReserveJob extends AbstractReserveJob {

    @Autowired
    private CommonCodeRepository commonCodeRepository;

    @Autowired
    private GenContentHistoryRepository genStatusHistoryRepository;

    @Autowired
    private ArticleSnsShareRepository articleSnsShareRepository;

    @Autowired
    private SnsApiService facebookApiService;

    @Autowired
    private SnsApiService twitterApiService;

    @Value("${sns.facebook.token-code}")
    private String facebookTokenCode;

    @Override
    public GenContentHistory invoke(GenContentHistory history) {
        log.debug("비동기 예약 작업 처리 : {}", history.getJobSeq());
        StatusFlagType statusFlagType = StatusFlagType.DONE;
        /**
         * todo 1. 작업 테이블에서 조회하여 이미 완료 되었거나, 삭제 된 작업이 아닌 경우 진행 시작
         * - AbstractReserveJob에 공통 메소드 생성하여 사용할 수 있도록 조치 필요
         */
        try {
            GenContent genContent = history.getGenContent();

            /**
             * todo 2. 작업 테이블의 파라미터 정보를 Map 형태로 전환하여, procedure 또는 업무별 service 객체 호출
             * - 각 업무 담당자가 해당 영역 코딩은 구현할 예정
             */
            ArticleSnsShare ArticleSnsShare = genContent
                    .getJobCd()
                    .equals("SNS_PUBLISH") ? publishSnsArticleSnsShare(history) : deleteSnsArticleSnsShare(history);

        } catch (NoDataException ex) {
            log.error("[GEN STATUS HISTORY ERROR]", ex.toString());
            statusFlagType = StatusFlagType.DELETE_TASK;
        } catch (Exception ex) {
            log.error("[GEN STATUS HISTORY ERROR]", ex.toString());
            statusFlagType = StatusFlagType.ERROR_SERVER;
        }
        history.setStatus(statusFlagType);
        return history;
    }

    public ArticleSnsShare publishSnsArticleSnsShare(GenContentHistory task)
            throws Exception {

        SnsPublishDTO pubInfo = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(task.getParamDesc(), SnsPublishDTO.class);

        ArticleSnsShare share = null;

        if (pubInfo
                .getSnsType()
                .equals(SnsTypeCode.FB)) {
            CommonCode tokenCode = commonCodeRepository
                    .findFirstByDtlCd(facebookTokenCode)
                    .orElseThrow(() -> new NoDataException("Not Found Facebook Token"));
            //pubInfo.setTokenCode(tokenCode.getCdNm());
            pubInfo.setTokenCode(tokenCode.getCdNm());
        }

        Map<String, Object> result = getSnsAipService(pubInfo.getSnsType()).publish(pubInfo);



        if (McpString.isNotEmpty(result.getOrDefault("id", ""))) {
            share = updateArticleSnsShareStatus(ArticleSnsShare
                    .builder()
                    .id(ArticleSnsSharePK
                            .builder()
                            .totalId(pubInfo.getTotalId())
                            .snsType(pubInfo.getSnsType())
                            .build())
                    .snsArtId(String.valueOf(result.get("id")))
                    .snsArtSts(SnsStatusCode.I.getCode())
                    .build());
        }
        return share;
    }

    public ArticleSnsShare deleteSnsArticleSnsShare(GenContentHistory task)
            throws Exception {
        ArticleSnsShare share = null;

        SnsDeleteDTO delInfo = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(task.getParamDesc(), SnsDeleteDTO.class);

        if (delInfo
                .getSnsType()
                .equals(SnsTypeCode.FB)) {
            CommonCode tokenCode = commonCodeRepository
                    .findFirstByDtlCd(facebookTokenCode)
                    .orElseThrow(() -> new NoDataException("Not Found Facebook Token"));
            delInfo.setTokenCode(tokenCode.getCdNm());
        }

        // 삭제
        Map<String, Object> result = getSnsAipService(delInfo.getSnsType()).delete(delInfo);

        if (McpString.isNotEmpty(result.getOrDefault("id", ""))) {
            share = updateArticleSnsShareStatus(ArticleSnsShare
                    .builder()
                    .id(ArticleSnsSharePK
                            .builder()
                            .totalId(delInfo.getTotalId())
                            .snsType(delInfo.getSnsType())
                            .build())
                    .snsArtId(delInfo.getSnsId())
                    .snsArtSts(SnsStatusCode.D.getCode())
                    .build());

        }

        return share;
    }

    public Optional<ArticleSnsShare> findArticleSnsShareById(ArticleSnsSharePK id) {
        return articleSnsShareRepository.findById(id);
    }

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

    private SnsApiService getSnsAipService(SnsTypeCode snsTypeCode) {
        return snsTypeCode == SnsTypeCode.FB ? facebookApiService : twitterApiService;
    }
}
