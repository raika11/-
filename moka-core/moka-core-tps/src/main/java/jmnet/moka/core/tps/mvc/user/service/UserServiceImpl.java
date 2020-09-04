package jmnet.moka.core.tps.mvc.user.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.user.dto.UserDTO;
import jmnet.moka.core.tps.mvc.user.entity.User;
import jmnet.moka.core.tps.mvc.user.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // @Override
    // public Optional<UserInfo> findByUserIdAndUserPassword(String userId, String userPassword) {
    // return userRepository.findByUserIdAndUserPassword(userId, userPassword);
    // }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> opt = userRepository.findByUserId(username);

        // 사용자를 못찾을 경우 Exception 발생
        User user = opt.orElseThrow(() -> new UsernameNotFoundException(username));

        return UserDTO.create(user, getAuthorities(user.getPosition()));
    }

    /**
     * 권한 목록
     * 
     * @return 권한 목록
     */
    public List<GrantedAuthority> getAuthorities(String position) {
        if (position.equals("1")) {
            return Arrays.asList(new SimpleGrantedAuthority(TpsConstants.ROLE_USER));
        } else if (position.equals("2")) {
            return Arrays.asList(new SimpleGrantedAuthority(TpsConstants.ROLE_SUPERADMIN));
        }
        return null;
    }
}
