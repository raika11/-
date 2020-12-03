package jmnet.moka.web.wms.mvc.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.web.wms.config.security.jwt.WmsJwtAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
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

    @Autowired
    private AuthenticationProvider authenticationProvider;    //AuthenticationProvider



    /**
     * @param request HttpServletRequest
     * @param userId  사용자 ID
     * @return ResponseEntity
     */
    @ApiOperation(value = "테스트용 로그인", tags = {"*** TEST LOGIN ***"})
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "사용자 ID", required = true, dataType = "String", paramType = "query", defaultValue = "ssc01"),
            @ApiImplicitParam(name = "userPassword", value = "사용자 ID", required = true, dataType = "String", paramType = "query", format = "password", defaultValue = "sscMoka#2020")})
    @PostMapping("/api/user/test-login")
    public ResponseEntity<?> postLogin(HttpServletRequest request, String userId, String userPassword) {

        Authentication authentication = authenticationProvider.authenticate(new WmsJwtAuthenticationToken(userId, userPassword));

        return new ResponseEntity<>(authentication, HttpStatus.OK);
    }
}
