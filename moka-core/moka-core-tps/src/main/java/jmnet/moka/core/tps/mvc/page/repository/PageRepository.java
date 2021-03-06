package jmnet.moka.core.tps.mvc.page.repository;

import jmnet.moka.core.tps.mvc.page.entity.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 * 페이지 Repository
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 4:13:48
 */
@Repository
public interface PageRepository extends JpaRepository<Page, Long>, PageRepositorySupport {

    // 자식노드 모두 찾기(mySql)
    //    @Query(value = "SELECT GROUP_CONCAT(lv SEPARATOR ',') " + "FROM ("
    //            + "SELECT @pv\\:=(SELECT GROUP_CONCAT(PAGE_SEQ SEPARATOR ',') FROM WMS_PAGE WHERE FIND_IN_SET(PARENT_PAGE_SEQ, @pv) AND DOMAIN_ID= :domainId) AS lv "
    //            + "    FROM WMS_PAGE JOIN (SELECT @pv\\:= :pageSeq) tmp " + ") a", nativeQuery = true)
    //    public String findSubNodes(@Param("domainId") String domainId, @Param("pageSeq") Long pageSeq);

    /**
     * 도메인아이디와 관련된 페이지를 찾는다
     *
     * @param domainId 도메인아이디
     * @return 페이지 목록
     */
    @EntityGraph(attributePaths = {"domain"})
    public org.springframework.data.domain.Page<Page> findByDomain_DomainId(String domainId, Pageable pageable);

}
