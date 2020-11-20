package jmnet.moka.core.tps.mvc.auth.service;

import java.util.List;
import java.util.Set;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import org.springframework.security.core.GrantedAuthority;

public interface AuthService {

    //	public Optional<UserInfo> findByUserIdAndUserPassword(String userId, String userPassword);
    List<GrantedAuthority> getAuthorities(Set<GroupMember> groupMembers);

    List<GrantedAuthority> getAuthorities(String position);

    /**
     * 사용자 아이디와 메뉴 아이디로 메뉴 권한 목록 조회
     *
     * @param memberId 사용자 아이디
     * @param menuId   메뉴 ID
     * @return 메뉴 권한 일련번호
     */
    boolean hasMenuAuth(String memberId, String menuId);
}
