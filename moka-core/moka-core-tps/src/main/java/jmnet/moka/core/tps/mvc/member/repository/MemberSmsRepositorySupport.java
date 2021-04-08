package jmnet.moka.core.tps.mvc.member.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.member.entity.MemberSms;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.repository
 * ClassName : MemberSmsRepositorySupport
 * Created : 2020-11-02 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-02 18:49
 */
public interface MemberSmsRepositorySupport {
    Optional<MemberSms> findFirstByMemberIdOrderByRegDtDesc(String memberId);
}
