package jmnet.moka.core.tps.mvc.member.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.Member;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.repository
 * ClassName : MemberRepositorySupport
 * Created : 2020-11-02 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-02 18:49
 */
public interface MemberRepositorySupport {
    public Page<Member> findAllMember(MemberSearchDTO memberSearchDTO);

    public Optional<Member> findByMemberId(String memberId);
}
