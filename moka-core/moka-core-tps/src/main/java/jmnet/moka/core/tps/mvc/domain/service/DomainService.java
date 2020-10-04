/**
 * msp-tps DomainService.java 2020. 1. 8. 오후 2:06:54 ssc
 */
package jmnet.moka.core.tps.mvc.domain.service;

import java.util.List;
import java.util.Optional;

import jmnet.moka.common.data.support.SearchDTO;
import org.springframework.data.domain.Page;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;

/**
 * 도메인 서비스 2020. 1. 8. ssc 최초생성
 * 
 * @since 2020. 1. 8. 오후 2:06:54
 * @author ssc
 */
public interface DomainService {

    /**
     * 도메인목록조회
     * @param search 검색조건
     * @return 도메인목록
     */
    public Page<Domain> findList(SearchDTO search);

    /**
     * 도메인목록 전체조회(페이징X)
     * @return 도메인목록
     */
    public List<Domain> findList();
    
    /**
     * 도메인 목록 조회(Mybatis)
     * @param domainId 도메인아이디
     * @return 도메인 목록
     */
    public List<DomainDTO> findByMapper(String domainId);

    /**
     * 도메인 조회
     * @param domainId 도메인아이디
     * @return 도메인정보
     */
    public Optional<Domain> findByDomainId(String domainId);

    /**
     * 도메인 추가
     * @param domain 도메인
     * @return 등록된 도메인
     * @throws Exception 예외처리
     */
    public Domain insertDomain(Domain domain) throws Exception;

    /**
     * 도메인 수정
     * @param domain 수정할 도메인정보
     * @return 수정된 도메인정보
     */
    public Domain updateDomain(Domain domain);
    
    /**
     * 도메인 삭제
     * @param domainId 도메인아이디
     * @throws Exception 예외처리
     */
    public void deleteDomain(String domainId) throws Exception;
    
    /**
     * 도메인 삭제
     * @param domain 도메인
     * @throws Exception 예외처리
     */
    public void deleteDomain(Domain domain) throws Exception;
    
    /**
     * 중복 도메인아이디인지 체크한다
     * @param domainId 도메인아이디
     * @return 중복여부
     */
    public boolean isDuplicatedId(String domainId);

    /**
     * 관련된 정보가 있는지 조사한다.
     * @param domainId 도메인아이디
     * @return 관련아이템 여부
     */
    public boolean hasRelations(String domainId);
}
