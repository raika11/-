/**
 * msp-tps ReservedRepositorySupport.java 2020. 6. 17. 오전 11:31:58 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.repository;

import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 *
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 17. 오전 11:31:58
 */
public interface ReporterRepositorySupport {
    // 페이지목록. 페이징O
    public Page<Reporter> findList(ReporterSearchDTO search, Pageable pageable);

    /**
     * 기사의 댓글수를 변경한다.
     *
     * @param regSeq 기자일련번호
     * @param cnt    증가/감소 수
     * @return 수정 결과
     */
    long updateReplyCnt(String regSeq, String regId, int cnt);
}
