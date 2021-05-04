package jmnet.moka.core.tps.mvc.articlePackage.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.articlePackage.dto.ArticlePackageSearchDTO;
import jmnet.moka.core.tps.mvc.articlePackage.entity.ArticlePackage;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.articlePackage.service
 * ClassName : ArticlePackageService
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 오후 4:12
 */
public interface ArticlePackageService {
    /**
     * 기사패키지 목록 조회
     *
     * @param search 검색조건
     * @return
     */
    Page<ArticlePackage> findAll(ArticlePackageSearchDTO search);

    /**
     * 기사패키지 상세조회
     *
     * @param pkgSeq 기사패키지 일련번호
     * @return
     */
    Optional<ArticlePackage> findByPkgSeq(Long pkgSeq);

    /**
     * 기사패키지 등록
     *
     * @param articlePackage 기사패키지
     * @return
     */
    ArticlePackage insertArticlePackage(ArticlePackage articlePackage);

    /**
     * 기사패키지 수정
     *
     * @param articlePackage 기사패키지
     * @return
     */
    ArticlePackage updateArticlePackage(ArticlePackage articlePackage);
}
