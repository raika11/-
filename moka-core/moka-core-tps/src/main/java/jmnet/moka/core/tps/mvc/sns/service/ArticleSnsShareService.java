package jmnet.moka.core.tps.mvc.sns.service;

import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
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
     * 기사 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    Page<ArticleSnsShareItemVO> findAllArticleSnsShareItem(ArticleSnsShareSearchDTO searchDTO);
}
