/**
 * msp-tps DomainService.java 2020. 1. 8. 오후 2:06:54 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.service;

import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;

import java.util.List;
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
    public List<ReporterVO> findAllReporterMgr(ReporterSearchDTO search);

    /**
     * 기자 조회
     *
     * @param repSeq 기자일련번호
     * @return 기자정보조회
     */
    public Optional<Reporter> findReporterMgrById(String repSeq);

    /**
     * 기자 조회
     *
     * @param repSeq 기자일련번호
     * @return 기자정보조회
     */
    public ReporterVO findBySeq(String repSeq);


    /**
     * 도메인 수정
     *
     * @param reporter 수정할 기자정보
     * @return 수정된 기자정보
     */
    public Reporter updateReporterMgr(Reporter reporter);

}
