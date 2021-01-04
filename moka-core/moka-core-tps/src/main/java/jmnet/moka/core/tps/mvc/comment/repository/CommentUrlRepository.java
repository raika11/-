package jmnet.moka.core.tps.mvc.comment.repository;

import jmnet.moka.core.tps.mvc.comment.entity.CommentUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommentUrlRepository extends JpaRepository<CommentUrl, Integer>, JpaSpecificationExecutor<CommentUrl> {

}
