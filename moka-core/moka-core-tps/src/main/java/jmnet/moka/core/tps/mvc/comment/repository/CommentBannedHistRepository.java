package jmnet.moka.core.tps.mvc.comment.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBannedHist;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommentBannedHistRepository extends JpaRepository<CommentBannedHist, Long>, JpaSpecificationExecutor<CommentBannedHist> {
    // 차단 일련번호로 이력 목록 조회
    @EntityGraph(attributePaths = {"regMember"}, type = EntityGraphType.FETCH)
    List<CommentBannedHist> findAllByBannedSeq(Long bannedSeq);
}
