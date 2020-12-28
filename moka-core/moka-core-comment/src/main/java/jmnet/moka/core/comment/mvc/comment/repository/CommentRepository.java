package jmnet.moka.core.comment.mvc.comment.repository;

import jmnet.moka.core.comment.mvc.comment.entity.Comment;
import jmnet.moka.core.comment.mvc.comment.entity.CommentPk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommentRepository extends JpaRepository<Comment, CommentPk>, JpaSpecificationExecutor<Comment> {

}
