/**
 * msp-tps DomainService.java 2020. 1. 8. 오후 2:06:54 ssc
 */
package jmnet.moka.core.tps.mvc.bulk.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.bulk.dto.BulkArticleDTO;
import jmnet.moka.core.tps.mvc.bulk.dto.BulkSearchDTO;
import jmnet.moka.core.tps.mvc.bulk.entity.Bulk;
import jmnet.moka.core.tps.mvc.bulk.entity.BulkArticle;
import org.springframework.data.domain.Page;

/**
 * 벌크문구 서비스 2020. 1. 8. ssc 최초생성 메소드 생성 규칙 목록 조회 : find{Target}List ID로 상세 조회 : find{Target}ById 여러 속성으로 상세 조회 : find{Target} 수정 : update{Target}
 *
 * @author ssc
 * @since 2020. 1. 8. 오후 2:06:54
 */
public interface BulkService {

    /**
     * 벌크문구목록 조회
     *
     * @param search 검색조건
     * @return 벌크문구 목록조회
     */
    Page<Bulk> findAllBulkList(BulkSearchDTO search);

    /**
     * 벌크문구목록 목록조회
     *
     * @param bulkartSeq 클릭기사일련번호
     * @return 벌크문구 목록조회
     */
    List<BulkArticle> findAllByBulkartSeq(Long bulkartSeq);


    /**
     * 벌크문구정보 조회
     *
     * @param bulkartSeq 클릭기사일련번호
     * @return 벌크문구 단건조회
     */
    Optional<Bulk> findById(Long bulkartSeq);

    /**
     * 벌크문구정보 조회
     *
     * @param bulk 클릭기사일련번호
     * @return 벌크문구 단건조회
     */
    void updateArticle(Bulk bulk);

    /**
     * 중복여부
     *
     * @param bulkartSeq 일련번호
     * @return 존재 여부
     */
    boolean isDuplicatedId(Long bulkartSeq);

    /**
     * 벌크문구목록저장
     *
     * @param bulkArticleDTO 벌크문구목록
     * @return 존재 여부
     */
    Bulk insertBulk(Bulk bulk, List<BulkArticleDTO> bulkArticleDTO);
}
