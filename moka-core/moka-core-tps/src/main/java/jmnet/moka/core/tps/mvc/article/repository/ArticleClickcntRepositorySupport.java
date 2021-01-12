package jmnet.moka.core.tps.mvc.article.repository;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.article.repository
 * ClassName : ArticleClickcntRepositorySupport
 * Created : 2021-01-12 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-12 08:59
 */
public interface ArticleClickcntRepositorySupport {

    /**
     * 기사의 댓글수를 변경한다.
     *
     * @param totalId 기사ID
     * @param cnt     증가/감소 수
     * @return 수정 결과
     */
    long updateReplyCnt(Long totalId, int cnt);

}
