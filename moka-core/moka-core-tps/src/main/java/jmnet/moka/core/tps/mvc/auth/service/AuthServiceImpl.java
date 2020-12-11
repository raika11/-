package jmnet.moka.core.tps.mvc.auth.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import jmnet.moka.core.tps.mvc.member.service.MemberService;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService, UserDetailsService {


    @Autowired
    private MemberService memberService;

    @Autowired
    private MenuService menuService;

    // @Override
    // public Optional<UserInfo> findByUserIdAndUserPassword(String userId, String userPassword) {
    // return userRepository.findByUserIdAndUserPassword(userId, userPassword);
    // }

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        Optional<MemberInfo> opt = memberService.findMemberById(username);


        return opt.isPresent() ? UserDTO.create(opt.get(), getAuthorities(opt
                .get()
                .getGroupMembers())) : null;
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
                            .equals(TpsConstants.SUPER_ADMIN_GROUP_CD) && MokaConstants.YES.equals(gm.getUsedYn()))
                    .count() > 0) {
                return Arrays.asList(new SimpleGrantedAuthority(TpsConstants.ROLE_SUPERADMIN));
            }
        }
        // 일단 아무나 사용자 권한 부여 이후 position 및 dept에 따라 권한 분기 할 수 있음
        return Arrays.asList(new SimpleGrantedAuthority(TpsConstants.ROLE_USER));
    }

    public List<GrantedAuthority> getAuthorities(String position) {
        if (position.equals(TpsConstants.SUPER_ADMIN_GROUP_CD)) {
            return Arrays.asList(new SimpleGrantedAuthority(TpsConstants.ROLE_SUPERADMIN));
        } else if (position.equals("J")) {
            return Arrays.asList(new SimpleGrantedAuthority(TpsConstants.ROLE_USER));
        }
        return null;
    }

    @Override
    public boolean hasMenuAuth(String memberId, String menuId) {
        Long menuSeq = menuService.findMenuAuthSeq(MenuSearchDTO
                .builder()
                .grpMemId(memberId)
                .menuId(menuId)
                .build());
        return (menuSeq != null && menuSeq > 0);
    }
}
