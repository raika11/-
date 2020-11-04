/**
 * msp-tps TpsAuthenticationProvider.java 2020. 1. 3. 오후 3:31:22 ssc
 */
package jmnet.moka.web.wms.config.security;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.mvc.member.entity.LoginLog;
import jmnet.moka.core.tps.mvc.member.service.MemberService;
import jmnet.moka.core.tps.mvc.user.dto.UserDTO;
import jmnet.moka.web.wms.config.security.exception.AccountStatusUnactiveException;
import jmnet.moka.web.wms.config.security.exception.GroupwareUserNotFoundException;
import jmnet.moka.web.wms.config.security.exception.LimitExcessBadCredentialsException;
import jmnet.moka.web.wms.config.security.exception.LongTermUnconnectedException;
import jmnet.moka.web.wms.config.security.exception.PasswordUnchangedException;
import jmnet.moka.web.wms.config.security.exception.WmsBadCredentialsException;
import jmnet.moka.web.wms.config.security.exception.WmsUsernameNotFoundException;
import jmnet.moka.web.wms.config.security.jwt.WmsJwtAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private UserDetailsService userService;    //UserDetailsService

    @Autowired
    private MemberService memberService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${login.password.error-count.limit:5}")
    private int passwordErrorLimit;

    @Value("${login.long-term.connected-days.limit:30}")
    private int longTermUnconnectedDays;

    @Value("${login.password.changed-days-noti-limit:30}")
    private int passwordChangeNotiDays;

    @Value("${login.password.changed-days-lock.limit:35}")
    private int passwordUnchangedLockDays;

    @Autowired
    private MessageByLocale messageByLocale;

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
    public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {

        Assert.notNull(authentication, "No authentication data provided");

        String userId = (String) authentication.getPrincipal();
        String userPassword = (String) authentication.getCredentials();
        String loginSuccessYn = MokaConstants.YES;

        String userIp = HttpHelper.getRemoteAddr();

        LoginLog loginLog = LoginLog
                .builder()
                .memId(userId)
                .ip(userIp)
                .build();

        try {

            // 0. Groupware 아이디 존재 여부 확인. 추후 그룹웨어 호출 로직 추가 예정
            boolean exists = true;
            if (!exists) {
                throw new GroupwareUserNotFoundException(messageByLocale.get("wms.login.error.GroupwareUserNotFoundException"));
            }

            // 1. 회원 정보를 조회한다.
            UserDTO userDetails = (UserDTO) userService.loadUserByUsername(userId);
            // 2. 회원 정보가 없으면 로그 테이블에 이력 남기고 UsernameNotFoundException 발생
            if (userDetails == null) {
                throw new WmsUsernameNotFoundException(messageByLocale.get("wms.login.error.UsernameNotFoundException"));
            }

            // 3. 패스워드 오류
            if (!passwordEncoder.matches(userPassword, userDetails.getPassword())) {
                if (userDetails.getErrorCnt() + 1 < passwordErrorLimit) { // 오류 한도 초과 전
                    String errMsg = messageByLocale.get("wms.login.error.BadCredentials", userDetails.getErrorCnt() + 1, passwordErrorLimit);
                    memberService.addMemberLoginErrorCount(userId);
                    throw new WmsBadCredentialsException(errMsg);
                } else {// 한도가 초과한 경우
                    String errMsg = messageByLocale.get("wms.login.error.limit-excesss-bad-credentials", McpDate.nowDateStr());
                    if (userDetails.getErrorCnt() + 1 == passwordErrorLimit) { // 현재 오류 횟수가 한도와 동일한 경우 update
                        memberService.updateMemberStatus(userId, MemberStatusCode.P, passwordErrorLimit, errMsg);
                    }
                    throw new LimitExcessBadCredentialsException(
                            messageByLocale.get("wms.login.error.LimitExcessBadCredentialsException", passwordErrorLimit));
                }
            }

            // 4. status 체크
            if (!McpString.isYes(userDetails.getStatus(), MokaConstants.NO)) {
                throw new AccountStatusUnactiveException(messageByLocale.get("wms.login.error.InsufficientAuthenticationException"));
            }

            // 5. Expire Date 체크
            if (userDetails.getExpireDt() != null) {
                if (McpDate.term(userDetails.getExpireDt()) < 0) {
                    throw new AccountExpiredException(messageByLocale.get("wms.login.error.AccountExpiredException"));
                }
            }

            // 6. 장기 미접속자 처리
            if (userDetails.getLastLoginDt() != null) {
                if (McpDate.dayTerm(userDetails.getLastLoginDt()) < -(longTermUnconnectedDays)) {
                    String errMsg = messageByLocale.get("wms.login.error.long-term-unconnected", McpDate.nowDateStr());
                    memberService.updateMemberStatus(userId, MemberStatusCode.P, userDetails.getErrorCnt(), errMsg);
                    throw new LongTermUnconnectedException(
                            messageByLocale.get("wms.login.error.LongTermUnconnectedException", longTermUnconnectedDays));
                }
            }

            // 7. 패스워드 변경 일자 확인
            if (userDetails.getPasswordModDt() != null) {
                if (McpDate.dayTerm(userDetails.getPasswordModDt()) < -(passwordUnchangedLockDays)) {
                    String errMsg = messageByLocale.get("wms.login.error.password-unchanged-lock", McpDate.nowDateStr());
                    memberService.updateMemberStatus(userId, MemberStatusCode.P, userDetails.getErrorCnt(), errMsg);
                    throw new PasswordUnchangedException(messageByLocale.get("wms.login.error.PasswordUnchangedException", passwordChangeNotiDays));
                }
            }

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userId, null, userDetails.getAuthorities());
            memberService.updateMemberLoginInfo(userId, McpDate.now(), userIp, userDetails.getExpireDt());
            authenticationToken.setDetails(userDetails);

            return authenticationToken;
        } catch (AuthenticationException ex) {
            loginSuccessYn = MokaConstants.NO;
            throw ex;
        } finally {
            loginLog.setSuccessYn(loginSuccessYn);
            memberService.insertLoginLog(loginLog);
        }
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

}
