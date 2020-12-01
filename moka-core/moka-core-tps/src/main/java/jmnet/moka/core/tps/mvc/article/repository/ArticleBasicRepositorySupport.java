package jmnet.moka.core.tps.mvc.article.repository;

/**
 * <pre>
 * ArticleBasicRepository 추가 지원 interface
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.article.repository
 * ClassName : ArticleBasicRepositorySupport
 * Created : 2020-12-01 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-01 13:07
 */
public interface ArticleBasicRepositorySupport {
    /**
     * 기사 유형으로 가장 최근 기사의 id를 조회한다.
     *
     * @param artType 기사 유형
     * @return totalId
     */
    Long findLastestByTotalIdByArtType(String artType);
}
