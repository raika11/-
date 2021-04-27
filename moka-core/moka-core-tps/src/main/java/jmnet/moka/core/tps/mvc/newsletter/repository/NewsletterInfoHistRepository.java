package jmnet.moka.core.tps.mvc.newsletter.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfoHist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.repository
 * ClassName : NewsletterHistRepository
 * Created : 2021-04-26 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-26 오후 5:45
 */
public interface NewsletterInfoHistRepository extends JpaRepository<NewsletterInfoHist, Long>, JpaSpecificationExecutor<NewsletterInfoHist> {

    /**
     * 뉴스레터 일련번호별 히스토리 조회
     *
     * @param letterSeq 뉴스레터 일련번호
     * @param pageable
     * @return
     */
    Page<NewsletterInfoHist> findByLetterSeq(Long letterSeq, Pageable pageable);

    /**
     * 뉴스레터 일련번호별 히스토리 상세 비교
     *
     * @param letterSeq
     * @return
     */
    List<NewsletterInfoHist> findTop2ByLetterSeqAndHistSeqLessThanEqualOrderByHistSeqDesc(Long letterSeq, Long histSeq);
}
