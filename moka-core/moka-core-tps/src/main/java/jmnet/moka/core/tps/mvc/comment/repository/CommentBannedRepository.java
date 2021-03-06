package jmnet.moka.core.tps.mvc.comment.repository;

import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommentBannedRepository
        extends JpaRepository<CommentBanned, Long>, JpaSpecificationExecutor<CommentBanned>, CommentBannedRepositorySupport {

}
