package jmnet.moka.web.push.mvc.sender.repository;

import java.util.Optional;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 작업 Repository 2021. 2. 18.
 */
@Repository
public interface PushContentsRepository extends JpaRepository<PushContents, Long>, PushContentsRepositorySupport {

    /**
     * 콘텐트 Seq 로 작업 목록 조회
     *
     * @param contentSeq 콘텐트 seq
     * @return 작업 목록
     */
    @EntityGraph(attributePaths = {"appProcs"}, type = EntityGraphType.LOAD)
    Optional<PushContents> findByContentSeq(Long contentSeq);

}
