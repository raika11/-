package jmnet.moka.core.comment.mvc.comment.repository;

import jmnet.moka.core.comment.mvc.comment.entity.CommentUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommentUrlRepository extends JpaRepository<CommentUrl, Integer>, JpaSpecificationExecutor<CommentUrl> {

}
