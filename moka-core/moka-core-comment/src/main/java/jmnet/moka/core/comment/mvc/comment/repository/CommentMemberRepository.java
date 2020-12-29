package jmnet.moka.core.comment.mvc.comment.repository;

import jmnet.moka.core.comment.mvc.comment.entity.CommentMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommentMemberRepository extends JpaRepository<CommentMember, Void>, JpaSpecificationExecutor<CommentMember> {

}