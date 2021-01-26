package jmnet.moka.core.tps.mvc.comment.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.comment.entity.CommentUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommentUrlRepository extends JpaRepository<CommentUrl, Integer>, JpaSpecificationExecutor<CommentUrl> {

    /**
     * url 목록 모두 조회
     *
     * @param usedYn 사용여부
     * @return url 목록
     */
    List<CommentUrl> findAllByUsedYn(String usedYn);
}
