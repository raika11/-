package jmnet.moka.core.tps.mvc.user.service;

import java.util.List;
import java.util.Set;
import jmnet.moka.core.tps.mvc.member.entity.GroupMember;
import org.springframework.security.core.GrantedAuthority;

public interface UserService {
	
//	public Optional<UserInfo> findByUserIdAndUserPassword(String userId, String userPassword);
    List<GrantedAuthority> getAuthorities(Set<GroupMember> groupMembers);

    List<GrantedAuthority> getAuthorities(String position);
}
