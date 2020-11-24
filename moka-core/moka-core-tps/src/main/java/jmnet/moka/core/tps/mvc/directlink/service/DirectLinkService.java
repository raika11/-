/**
 * msp-tps DirectLinkService.java 2020. 1. 8. 오후 2:06:54 ssc
 */
package jmnet.moka.core.tps.mvc.directlink.service;

import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkSearchDTO;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import jmnet.moka.core.tps.mvc.group.entity.GroupInfo;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * 사이트이동 서비스 2020. 1. 8. ssc 최초생성
 * 메소드 생성 규칙
 * 목록 조회 : findAllDirectLink{Target}List
 * ID로 상세 조회 : find{Target}ById
 * 여러 속성으로 상세 조회 : find{Target}
 * 등록 : insertDirectLink{Target}
 * 수정 : updateDirectLink{Target}
 * 삭제 :  deleteDirectLink{Target}
 * 중복조회 : isDuplicatedId{Target}
 * 이미지저장 : saveImage{Target}
 * 이미지삭제 : deleteImage{Target}
 * 멤버목록조회 : hasMembers{Target}
 * @author ssc
 * @since 2020. 1. 8. 오후 2:06:54
 */
public interface DirectLinkService {

    /**
     * 사이트이동 목록 조회
     *
     * @param search 검색조건
     * @return 사이트관리 목록조회
     */
    Page<DirectLink> findAllDirectLink(DirectLinkSearchDTO search);

    /**
     * 사이트정보 조회
     *
     * @param linkSeq 링크일련번호
     * @return 사이트정보조회
     */
    Optional<DirectLink> findById(Long linkSeq);

    /**
     * 링크관리 수정
     *
     * @param directLink 사이트관리 사이트정보
     * @return 수정된 사이트정보
     */
    DirectLink updateDirectLink(DirectLink directLink);

    /**
     * 사이트관리에 등록
     *
     * @param directLink 사이트관리 사이트정보
     * @return 등록된 사이트정보
     */
    DirectLink insertDirectLink(DirectLink directLink);

    /**
     * 아이디 존재 여부
     *
     * @param linkSeq 링크일련번호
     * @return 존재 여부
     */
    boolean isDuplicatedId(Long linkSeq);

    /**
     * 사이트관리에 속한 멤버 존재 여부 조회
     *
     * @param linkSeq 링크일련번호
     * @return 존재 여부
     */
    boolean hasMembers(Long linkSeq);

    /**
     * 그룹 삭제
     *
     * @param directLink 그룹 정보
     */
    void deleteDirectLink(DirectLink directLink);

    /**
     * 썸네일 이미지 저장
     * @param directLink 템플릿
     * @param thumbnail 썸네일 이미지(Multipart)
     * @return 이미지 uri
     * @throws Exception 예외처리
     */
    String saveImage(DirectLink directLink, MultipartFile thumbnail) throws Exception;

    /**
     * 썸네일 이미지 삭제
     * @param directLink 템플릿
     * @return 삭제 결과
     * @throws Exception 예외처리
     */
    boolean deleteImage(DirectLink directLink) throws Exception;


}
