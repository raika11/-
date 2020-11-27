/**
 * msp-tps DomainService.java 2020. 1. 8. 오후 2:06:54 ssc
 */
package jmnet.moka.core.tps.mvc.naverbulk.service;

import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkListDTO;
import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkSearchDTO;
import jmnet.moka.core.tps.mvc.naverbulk.entity.Article;
import jmnet.moka.core.tps.mvc.naverbulk.entity.ArticleList;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

/**
 * 네이버벌크문구 서비스 2020. 1. 8. ssc 최초생성
 * 메소드 생성 규칙
 * 목록 조회 : find{Target}List
 * ID로 상세 조회 : find{Target}ById
 * 여러 속성으로 상세 조회 : find{Target}
 * 수정 : update{Target}
 *
 * @author ssc
 * @since 2020. 1. 8. 오후 2:06:54
 */
public interface NaverBulkService {

    /**
     * 네이버벌크문구목록 조회
     *
     * @param search 검색조건
     * @return 네이버벌크문구 목록조회
     */
    Page<Article> findAllNaverBulkList(NaverBulkSearchDTO search);

//    /**
//     * 네이버벌크문구목록 목록조회
//     *
//     * @param clickartSeq 클릭기사일련번호
//     * @return 네이버벌크문구 목록조회
//     */
//    List<ArticleList> findAllByClickartSeq(Long clickartSeq);


    /**
     * 네이버벌크문구정보 조회
     *
     * @param clickartSeq 클릭기사일련번호
     * @return 네이버벌크문구 단건조회
     */
    Optional<Article> findById(Long clickartSeq);

    /**
     * 네이버벌크문구정보 조회
     *
     * @param article 클릭기사일련번호
     * @return 네이버벌크문구 단건조회
     */
    void updateArticle(Article article);

    /**
     * 중복여부
     *
     * @param clickartSeq 일련번호
     * @return 존재 여부
     */
    boolean isDuplicatedId(Long clickartSeq);

    /**
     * 벌크문구목록저장
     *
     * @param naverBulkListDTO 벌크문구목록
     * @return 존재 여부
     */
    Article insertNaverBulk(List<NaverBulkListDTO> naverBulkListDTO, String clickartDiv, String sourceCode, String status);
}
