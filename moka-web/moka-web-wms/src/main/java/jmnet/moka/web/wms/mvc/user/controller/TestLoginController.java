/**
 * msp-wms AATestLoginController.java 2020. 10. 7. 오후 2:09:06 ince
 */
package jmnet.moka.web.wms.mvc.user.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.user.dto.UserDTO;
import jmnet.moka.core.tps.mvc.user.entity.User;
import jmnet.moka.core.tps.mvc.user.service.UserService;
import jmnet.moka.core.tps.mvc.user.service.UserServiceImpl;
import jmnet.moka.web.wms.config.security.jwt.WmsJwtAuthenticationToken;
import jmnet.moka.web.wms.config.security.jwt.WmsJwtHelper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * 테스트를 위한 로그인  Controller
 * 2020. 10. 7. ince 최초생성
 * </pre>
 *
 * @since 2020. 10. 7. ince 최초생성
 * @author ince
 */
@RestController
public class TestLoginController {

    private static ObjectMapper MAPPER = new ObjectMapper();

    private UserService userService;	//UserService

    /**
     * 생성자
     * UserService를 Autowired 하지 않고 Arguments로 받는다.
      * @param userService userService
     */
    public TestLoginController(UserService userService) {
        this.userService = userService;
    }

    /**
     *
     * @param request HttpServletRequest
     * @param userId 사용자 ID
     * @return ResponseEntity
     * @throws InvalidDataException InvalidDataException
     * @throws Exception 기본 Exception
     */
    @ApiOperation(value = "테스트용 로그인", tags = {"*** TEST LOGIN ***"})
    @ApiImplicitParams({
        @ApiImplicitParam(name = "userId", value = "사용자 ID", required = true, dataType = "String",
            paramType = "query", defaultValue = "ssc_test")
    })
    @PostMapping("/api/user/test-login")
    public ResponseEntity<?> postLogin(HttpServletRequest request, String userId) throws InvalidDataException, Exception {

        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        String loginUserId = McpString.defaultValue(userId, MokaConstants.USER_UNKNOWN);
        UserDTO userDetails = UserDTO.create(User.builder().userId(loginUserId).userName(MokaConstants.USER_UNKNOWN).build(), grantedAuthorities);

        String detailsJson = MAPPER.writeValueAsString(userDetails);
        String token = JWT.create().withSubject(detailsJson)
                .withExpiresAt(new Date(System.currentTimeMillis() + WmsJwtHelper.EXPIRATION_TIME))
                .sign(Algorithm.HMAC512(WmsJwtHelper.SECRET.getBytes()));



        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginUserId, loginUserId, grantedAuthorities);

        authenticationToken.setDetails(userDetails);


        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        return new ResponseEntity<>(token, HttpStatus.OK);

    }
}
