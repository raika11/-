package jmnet.moka.core.tps.mvc.sns.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.sns.SnsDeleteDTO;
import jmnet.moka.core.common.sns.SnsPublishDTO;
import jmnet.moka.core.common.sns.SnsTypeCode;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareMetaSearchDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.dto.InstantArticleSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsSharePK;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
import jmnet.moka.core.tps.mvc.sns.vo.InstantArticleVO;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.service
 * ClassName : ArticleSnsShareService
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 11:15
 */
public interface ArticleSnsShareService {

    /**
     * 메타 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    Page<ArticleSnsShare> findAllArticleSnsShare(ArticleSnsShareMetaSearchDTO searchDTO);

    /**
     * 상세 조회
     *
     * @param totalId
     * @return
     */
    Optional<ArticleSnsShare> findArticleSnsShareById(Long totalId);

    /**
     * totalId와 sysType으로 상세 조회
     *
     * @param totalId
     * @param type
     * @return
     */
    Optional<ArticleSnsShare> findArticleSnsShareById(Long totalId, SnsTypeCode type);

    Optional<ArticleSnsShare> findArticleSnsShareById(ArticleSnsSharePK id);

    ArticleSnsShare insertArticleSnsShare(ArticleSnsShare entity);

    int insertFbInstanceArticle(ArticleSnsShareItemVO vo);

    ArticleSnsShare updateArticleSnsShare(ArticleSnsShare entity);

    ArticleSnsShare updateArticleSnsShareStatus(ArticleSnsShare entity)
            throws NoDataException;

    void deleteArticleSnsShare(ArticleSnsShare entity);

    void deleteArticleSnsShareById(Long totalId, SnsTypeCode snsType);

    /**
     * 기사 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    Page<ArticleSnsShareItemVO> findAllSendArticle(ArticleSnsShareSearchDTO searchDTO);

    /**
     * sns에 수신하고 수신 결과를 DB에 저장 후 리턴한다.
     *
     * @param snsPublish SNS 공유
     * @return
     */
    ArticleSnsShare publishSnsArticleSnsShare(SnsPublishDTO snsPublish)
            throws Exception;

    /**
     * sns에 수신하고 수신 결과를 DB에 저장 후 리턴한다.
     *
     * @param snsDelete SNS 공유 제거
     * @return
     */
    ArticleSnsShare deleteSnsArticleSnsShare(SnsDeleteDTO snsDelete)
            throws Exception;

    /**
     * sns에 수신하고 수신 결과를 DB에 저장 후 리턴한다.
     *
     * @param snsPublish SNS 공유
     * @return
     */
    String reservePublishSnsArticleSnsShare(SnsPublishDTO snsPublish)
            throws Exception;

    /**
     * sns에 수신하고 수신 결과를 DB에 저장 후 리턴한다.
     *
     * @param snsDelete SNS 공유 제거
     * @return
     */
    String reserveDeleteSnsArticleSnsShare(SnsDeleteDTO snsDelete)
            throws Exception;

    /**
     * Facebook Instance Articles 조회.
     *
     * @param search 조회 조건
     * @return 검색 결과
     */
    List<InstantArticleVO> findFbInstantArticles(InstantArticleSearchDTO search);

    /**
     * Facebook Instance Article 저장.
     *
     * @param instanceArticle
     * @return
     */
    Integer saveFbInstantArticle(InstantArticleVO instanceArticle);
}
