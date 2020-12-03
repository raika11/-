package jmnet.moka.web.wms.mvc.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * 테스트를 위한 로그인  Controller
 * 2020. 10. 7. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2020. 10. 7. ince 최초생성
 */
@RestController
public class TestLoginController {

    private static ObjectMapper MAPPER = new ObjectMapper();

    private UserDetailsService userService;    //UserService

    private AuthService authService;    //UserService

    @Autowired
    private SessionRegistry sessionRegistry;    //UserService


    /**
     * 생성자 UserService를 Autowired 하지 않고 Arguments로 받는다.
     *
     * @param authService userService
     */
    public TestLoginController(AuthService authService, UserDetailsService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    /**
     * @param request HttpServletRequest
     * @param userId  사용자 ID
     * @return ResponseEntity
     */
    @ApiOperation(value = "테스트용 로그인", tags = {"*** TEST LOGIN ***"})
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "사용자 ID", required = true, dataType = "String", paramType = "query", defaultValue = "ssc01")})
    @PostMapping("/api/user/test-login")
    public ResponseEntity<?> postLogin(HttpServletRequest request, String userId) {

        UserDTO userDetails = (UserDTO) userService.loadUserByUsername(userId);
        String userIp = HttpHelper.getRemoteAddr();
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, null, userDetails.getAuthorities());
        authenticationToken.setDetails(userDetails);


        SecurityContextHolder
                .getContext()
                .setAuthentication(authenticationToken);

        sessionRegistry.registerNewSession(request
                .getSession()
                .getId(), authenticationToken.getPrincipal());

        return new ResponseEntity<>(userDetails, HttpStatus.OK);

    }
}
