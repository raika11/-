package jmnet.moka.core.tps.mvc.sns.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsSharePK;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
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
    Page<ArticleSnsShare> findAllArticleSnsShare(ArticleSnsShareSearchDTO searchDTO);

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
    Optional<ArticleSnsShare> findArticleSnsShareById(Long totalId, String type);

    Optional<ArticleSnsShare> findArticleSnsShareById(ArticleSnsSharePK id);

    ArticleSnsShare insertArticleSnsShare(ArticleSnsShare entity);

    int insertFbInstanceArticle(ArticleSnsShareItemVO vo);

    ArticleSnsShare updateArticleSnsShare(ArticleSnsShare entity);

    void deleteArticleSnsShare(ArticleSnsShare entity);

    void deleteArticleSnsShareById(Long totalId, String snsType);

    /**
     * 기사 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    Page<ArticleSnsShareItemVO> findAllSendArticle(ArticleSnsShareSearchDTO searchDTO);
}
