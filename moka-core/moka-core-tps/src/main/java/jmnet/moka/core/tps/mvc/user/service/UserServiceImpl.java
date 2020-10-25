package jmnet.moka.core.tps.mvc.user.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.member.entity.Member;
import jmnet.moka.core.tps.mvc.member.repository.MemberRepository;
import jmnet.moka.core.tps.mvc.user.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private MemberRepository memberRepository;

    // @Override
    // public Optional<UserInfo> findByUserIdAndUserPassword(String userId, String userPassword) {
    // return userRepository.findByUserIdAndUserPassword(userId, userPassword);
    // }

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        Optional<Member> opt = memberRepository.findByMemberId(username);

        // 사용자를 못찾을 경우 Exception 발생
        Member member = opt.orElseThrow(() -> new UsernameNotFoundException(username));

        return UserDTO.create(member, getAuthorities(member.getGroupMembers()));
    }

    /**
     * 권한 목록
     *
     * @return 권한 목록
     */
    public List<GrantedAuthority> getAuthorities(Set<GroupMember> groupMembers) {
        if (groupMembers != null && !groupMembers.isEmpty()) {
            if (groupMembers
                    .stream()
                    .filter(gm -> gm
                            .getGroup()
                            .getGroupCd()
                            .equals(TpsConstants.SUPER_ADMIN_GROUP_CD))
                    .count() > 0) {
                return Arrays.asList(new SimpleGrantedAuthority(TpsConstants.ROLE_SUPERADMIN));
            } else {
                return Arrays.asList(new SimpleGrantedAuthority(TpsConstants.ROLE_USER));
            }
        }
        return null;
    }

    public List<GrantedAuthority> getAuthorities(String position) {
        if (position.equals(TpsConstants.SUPER_ADMIN_GROUP_CD)) {
            return Arrays.asList(new SimpleGrantedAuthority(TpsConstants.ROLE_SUPERADMIN));
        } else if (position.equals("1")) {
            return Arrays.asList(new SimpleGrantedAuthority(TpsConstants.ROLE_USER));
        }
        return null;
    }
}
