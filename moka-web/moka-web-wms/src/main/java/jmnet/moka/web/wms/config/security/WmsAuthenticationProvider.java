/**
 * msp-tps TpsAuthenticationProvider.java 2020. 1. 3. 오후 3:31:22 ssc
 */
package jmnet.moka.web.wms.config.security;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.user.dto.UserDTO;
import jmnet.moka.core.tps.mvc.user.service.UserServiceImpl;
import jmnet.moka.web.wms.config.security.jwt.WmsJwtAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.Assert;

/**
 * <pre>
 *
 * 2020. 1. 3. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 3. 오후 3:31:22
 */
public class WmsAuthenticationProvider implements AuthenticationProvider {

    public final Logger logger = LoggerFactory.getLogger(WmsAuthenticationProvider.class);

    @Autowired
    private UserServiceImpl userService;    //UserDetailsService

    //	@Autowired
    //	private PasswordEncoder passwordEncoder;

    /**
     * <pre>
     *
     * </pre>
     *
     * @param authentication
     * @return
     * @throws AuthenticationException
     * @see org.springframework.security.authentication.AuthenticationProvider#authenticate(org.springframework.security.core.Authentication)
     */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        Assert.notNull(authentication, "No authentication data provided");

        String userId = (String) authentication.getPrincipal();
        String userPassword = (String) authentication.getCredentials();

        UserDTO userDetails = (UserDTO) userService.loadUserByUsername(userId);
        /*
        * 2020-10-13 차상인 주석 처리
        * 임시 로그인 처리를 위해 비밀번호 체크 로직 주석 처리
        if(!matchPassword(userDetails.getPassword(), userPassword)) {
        	throw new BadCredentialsException("Authentication Failed. Username or Password not valid.");
        }
         */

        if (McpString.defaultValue(userDetails.getStatus(), MokaConstants.NO)
                     .equals(MokaConstants.NO)) {
            throw new InsufficientAuthenticationException("This is a member whose use has been suspended.");
        }

        if (userDetails.getAuthorities() == null) {
            throw new InsufficientAuthenticationException("User has no roles assigned");
        }

        //        List<GrantedAuthority> authorities = userDetails.getAuthorities().stream()
        //                .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
        //                .collect(Collectors.toList());

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, null, userDetails.getAuthorities());

        authenticationToken.setDetails(userDetails);

        return authenticationToken;
    }

    /**
     * <pre>
     *
     * </pre>
     *
     * @param authentication
     * @return
     * @see org.springframework.security.authentication.AuthenticationProvider#supports(java.lang.Class)
     */
    @Override
    public boolean supports(Class<?> authentication) {
        return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication) || WmsJwtAuthenticationToken.class.isAssignableFrom(
                authentication));
    }

    private boolean matchPassword(String loginPassword, String password) {
        //      if (!passwordEncoder.matches(userPassword, userDetails.getPassword())) {
        return loginPassword.equals(password);
    }

}
