package jmnet.moka.web.wms.config.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.auth.service.AuthService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

public class WmsJwtHelper {
    public static final String SECRET = "wmsjwt";
    public static final int EXPIRATION_TIME = 864000000; // 10 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";

    private static ObjectMapper MAPPER = new ObjectMapper();

    static {
        MAPPER.setSerializationInclusion(Include.NON_EMPTY);
        MAPPER.setDefaultPropertyInclusion(Include.NON_NULL);
        MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public static String create(Authentication auth, String sessionId)
            throws JsonProcessingException {
        UserDTO userDetails = (UserDTO) auth.getDetails();
        //session id를 넣는다.
        userDetails.setSessionId(sessionId);
        String detailsJson = MAPPER.writeValueAsString(userDetails);
        String token = JWT
                .create()
                .withSubject(detailsJson)
                .withExpiresAt(new Date(System.currentTimeMillis() + WmsJwtHelper.EXPIRATION_TIME))
                .sign(Algorithm.HMAC512(WmsJwtHelper.SECRET.getBytes()));
        return token;
    }

    public static Authentication getUsernamePasswordAuthentication(HttpServletRequest request, AuthService authService)
            throws JsonParseException, JsonMappingException, IOException {
        String token = request.getHeader(WmsJwtHelper.HEADER_STRING);
        if (token != null) {
            // parse the token and validate it (decode)
            String detailsJson = JWT
                    .require(Algorithm.HMAC512(WmsJwtHelper.SECRET.getBytes()))
                    .build()
                    .verify(token.replace(WmsJwtHelper.TOKEN_PREFIX, ""))
                    .getSubject();

            if (detailsJson != null) {
                UserDTO userDetails = MAPPER.readValue(detailsJson, UserDTO.class);

                // jwt token에서 복원한 userDetails의 권한을 설정한다.
                userDetails.setAuthorities(authService.getAuthorities(userDetails.getGroup()));
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails.getUserId(), null, userDetails.getAuthorities());
                authenticationToken.setDetails(userDetails);
                return authenticationToken;
            }
            return null;
        }
        return null;
    }
}
