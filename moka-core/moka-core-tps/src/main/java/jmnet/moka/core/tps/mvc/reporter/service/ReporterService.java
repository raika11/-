/**
 * msp-tps DomainService.java 2020. 1. 8. 오후 2:06:54 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.service;

import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import jmnet.moka.core.tps.mvc.reserved.entity.Reserved;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * 도메인 서비스 2020. 1. 8. ssc 최초생성
 * 메소드 생성 규칙
 * 목록 조회 : find{Target}List
 * ID로 상세 조회 : find{Target}ById
 * 여러 속성으로 상세 조회 : find{Target}
 * 수정 : update{Target}
 *
 * @author ssc
 * @since 2020. 1. 8. 오후 2:06:54
 */
public interface ReporterService {

    /**
     * 기자목록 조회
     *
     * @param search 검색조건
     * @return 기자관리 목록조회
     */
    public Page<Reporter> findAllReporterMgr(ReporterSearchDTO search, Pageable pageable);

    /**
     * 기자 조회
     *
     * @param repSeq 기자일련번호
     * @return 기자정보조회
     */
    public Optional<Reporter> findReporterMgrById(Long repSeq);

    /**
     * 도메인 수정
     *
     * @param reporter 수정할 기자정보
     * @return 수정된 기자정보
     */
    public Reporter updateReporterMgr(Reporter reporter);

}
