package jmnet.moka.core.tps.mvc.user.service;

import java.util.List;
import org.springframework.security.core.GrantedAuthority;

public interface UserService {
	
//	public Optional<UserInfo> findByUserIdAndUserPassword(String userId, String userPassword);
    List<GrantedAuthority> getAuthorities(String position);
}
