/**
 * msp-tps DomainService.java 2020. 1. 8. 오후 2:06:54 ssc
 */
package jmnet.moka.core.tps.mvc.directlink.service;

import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkSearchDTO;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import org.springframework.data.domain.Page;

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
public interface DirectLinkService {

    /**
     * 링크목록 조회
     *
     * @param search 검색조건
     * @return 사이트관리 목록조회
     */
    Page<DirectLink> findAllDirectLink(DirectLinkSearchDTO search);

    /**
     * 링크 조회
     *
     * @param linkSeq 링크일련번호
     * @return 사이트정보조회
     */
    Optional<DirectLink> findById(String linkSeq);

    /**
     * 링크관리 수정
     *
     * @param directLink 링크관리 사이트정보
     * @return 수정된 링크정보
     */
    DirectLink updateDirectLink(DirectLink directLink);

    /**
     * 링크관리 등록
     *
     * @param directLink 링크관리 사이트정보
     * @return 등록된 링크정보
     */
    DirectLink insertDirectLink(DirectLink directLink);

    /**
     * 아이디 존재 여부
     *
     * @param linkSeq 링크일련번호
     * @return 존재 여부
     */
    boolean isDuplicatedId(String linkSeq);

    /**
     * 그룹에 속한 멤버 존재 여부 조회
     *
     * @param linkSeq 링크일련번호
     * @return 존재 여부
     */
    boolean hasMembers(String linkSeq);

}
