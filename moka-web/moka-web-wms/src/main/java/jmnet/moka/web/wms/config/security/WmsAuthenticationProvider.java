/**
 * msp-tps TpsAuthenticationProvider.java 2020. 1. 3. 오후 3:31:22 ssc
 */
package jmnet.moka.web.wms.config.security;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.member.entity.LoginLog;
import jmnet.moka.core.tps.mvc.member.service.MemberService;
import jmnet.moka.web.wms.config.security.exception.AccountStatusUnactiveException;
import jmnet.moka.web.wms.config.security.exception.GroupWareException;
import jmnet.moka.web.wms.config.security.exception.GroupWareUserStatusException;
import jmnet.moka.web.wms.config.security.exception.GroupwareUserNotFoundException;
import jmnet.moka.web.wms.config.security.exception.LimitExcessBadCredentialsException;
import jmnet.moka.web.wms.config.security.exception.NewUserSmsAuthRequiredException;
import jmnet.moka.web.wms.config.security.exception.PasswordUnchangedException;
import jmnet.moka.web.wms.config.security.exception.UnauthrizedErrorCode;
import jmnet.moka.web.wms.config.security.exception.WmsBadCredentialsException;
import jmnet.moka.web.wms.config.security.exception.WmsUsernameNotFoundException;
import jmnet.moka.web.wms.config.security.groupware.GroupWareUserInfo;
import jmnet.moka.web.wms.config.security.groupware.SoapWebServiceGatewaySupport;
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

    //@Value("${login.password.changed-days-noti-limit:30}")
    //private int passwordChangeNotiDays;

    @Value("${login.password.changed-days-lock.limit:35}")
    private int passwordUnchangedLockDays;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    public SoapWebServiceGatewaySupport groupWareAuthClient;

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

            // 1. 회원 정보를 조회한다.
            boolean groupwareCheck = true;
            UserDTO userDetails = (UserDTO) userService.loadUserByUsername(userId);

            /**
             * 개발 단계이기 때문에 사용자 권한이 슈퍼관리자인 경우 그룹웨어 존재여부 체크하지 않는다.
             */
            if (userDetails != null && userDetails.getAuthorities() != null && userDetails
                    .getAuthorities()
                    .stream()
                    .filter(grantedAuthority -> grantedAuthority
                            .getAuthority()
                            .equals(TpsConstants.ROLE_SUPERADMIN))
                    .count() > 0) {
                groupwareCheck = false;
            }
            GroupWareUserInfo groupwareUserInfo = null;
            if (groupwareCheck) {
                try {
                    // 0. Groupware 아이디 존재 여부 확인. 추후 그룹웨어 호출 로직 추가 예정
                    groupwareUserInfo = groupWareAuthClient.getUserInfo(userId);
                    boolean exists = groupwareUserInfo != null && McpString.isNotEmpty(groupwareUserInfo.getUserName());

                    if (!exists) {

                        loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_ERROR.getCode()));
                        loginLog.setErrMsg(messageByLocale.get("wms.login.error.GroupwareUserNotFoundException"));
                        throw new GroupwareUserNotFoundException(messageByLocale.get("wms.login.error.GroupwareUserNotFoundException"));
                    }
                } catch (GroupWareException ex) {
                    /**
                     * 그룹웨어 관련 오류 메세지 처리
                     */
                    if (ex.getErrorCode() == UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_ERROR) {

                        loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_ERROR.getCode()));
                        loginLog.setErrMsg(messageByLocale.get("wms.login.error.GroupwareUserNotFoundException"));

                        throw new GroupwareUserNotFoundException(messageByLocale.get("wms.login.error.GroupwareUserNotFoundException"));
                    }
                    if (ex.getErrorCode() == UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_PARSING_ERROR) {

                        loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_PARSING_ERROR.getCode()));
                        loginLog.setErrMsg(messageByLocale.get("wms.login.error.groupware-authnumber"));

                        throw new GroupWareUserStatusException(ex.getErrorCode(), messageByLocale.get("wms.login.error.groupware-authnumber"));
                    }
                    if (ex.getErrorCode() == UnauthrizedErrorCode.GROUPWARE_USER_PARSING_ERROR) {

                        loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.GROUPWARE_USER_PARSING_ERROR.getCode()));
                        loginLog.setErrMsg(messageByLocale.get("wms.login.error.groupware-userinfo"));

                        throw new GroupWareUserStatusException(ex.getErrorCode(), messageByLocale.get("wms.login.error.groupware-userinfo"));
                    }

                    loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.GROUPWARE_USER_PARSING_ERROR.getCode()));
                    loginLog.setErrMsg(messageByLocale.get("wms.login.error.groupware-userinfo"));

                    throw new GroupWareUserStatusException(ex.getErrorCode(), messageByLocale.get("wms.login.error.groupware"));
                }
            }


            // 2. 회원 정보가 없으면 로그 테이블에 이력 남기고 UsernameNotFoundException 발생
            if (userDetails == null) {

                loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.USERNAME_NOTFOUND.getCode()));
                loginLog.setErrMsg(messageByLocale.get("wms.login.error.UsernameNotFoundException"));

                throw new WmsUsernameNotFoundException(messageByLocale.get("wms.login.error.UsernameNotFoundException"));
            }

            // 4. status 체크
            if (MemberStatusCode.Y != userDetails.getStatus()) {
                if (MemberStatusCode.P == userDetails.getStatus()) { // 잠김 상태
                    if (userDetails.getErrorCnt() == passwordErrorLimit) { // 비밀번호 입력 오류 잠김 상태

                        loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.USER_STATUS.getCode()));
                        loginLog.setErrMsg(messageByLocale.get("wms.login.error.limit-excesss-bad-credentials-locked", passwordErrorLimit));

                        throw new LimitExcessBadCredentialsException(
                                messageByLocale.get("wms.login.error.limit-excesss-bad-credentials-locked", passwordErrorLimit), passwordErrorLimit);
                    } else { // 비밀번호 갱신 만료일이 지나 잠김 상태

                        loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.USER_STATUS.getCode()));
                        loginLog.setErrMsg(messageByLocale.get("wms.login.error.PasswordUnchangedException"));

                        throw new PasswordUnchangedException(messageByLocale.get("wms.login.error.PasswordUnchangedException"));
                    }
                } else if (MemberStatusCode.I == userDetails.getStatus()) {// 사용 신청 중인 상태 - 인증번호 인증 전

                    loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.USER_STATUS.getCode()));
                    loginLog.setErrMsg(messageByLocale.get("wms.login.error.NewUserSmsAuthRequiredException"));

                    throw new NewUserSmsAuthRequiredException(messageByLocale.get("wms.login.error.NewUserSmsAuthRequiredException"));
                } else if (MemberStatusCode.N == userDetails.getStatus()) {// 사용 신청 상태

                    loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.USER_STATUS.getCode()));
                    loginLog.setErrMsg(messageByLocale.get("wms.login.error.BeforeNewApprovalException"));

                    throw new AccountStatusUnactiveException(messageByLocale.get("wms.login.error.BeforeNewApprovalException"));
                } else if (MemberStatusCode.R == userDetails.getStatus()) {// 잠김 해제 요청 상태

                    loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.USER_STATUS.getCode()));
                    loginLog.setErrMsg(messageByLocale.get("wms.login.error.BeforeUnlockApprovalException"));

                    throw new AccountStatusUnactiveException(messageByLocale.get("wms.login.error.BeforeUnlockApprovalException"));
                } else if (MemberStatusCode.D == userDetails.getStatus()) { // 사용 중지 상태

                    loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.USER_STATUS.getCode()));
                    loginLog.setErrMsg(messageByLocale.get("wms.login.error.StopUsingException"));

                    throw new AccountStatusUnactiveException(messageByLocale.get("wms.login.error.StopUsingException"));
                } else { // 기타 계정 오류

                    loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.USER_STATUS.getCode()));
                    loginLog.setErrMsg(messageByLocale.get("wms.login.error.InsufficientAuthenticationException"));

                    throw new AccountStatusUnactiveException(messageByLocale.get("wms.login.error.InsufficientAuthenticationException"));
                }
            }

            // 3. 패스워드 오류
            if (!passwordEncoder.matches(userPassword, userDetails.getPassword())) {
                int errorCnt = userDetails.getErrorCnt() + 1;
                if (errorCnt < passwordErrorLimit) { // 오류 한도 초과 전
                    String errMsg = messageByLocale.get("wms.login.error.BadCredentials", errorCnt, passwordErrorLimit);
                    memberService.addMemberLoginErrorCount(userId);

                    loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.PASSWORD_UNMATCHED.getCode()));
                    loginLog.setErrMsg(errMsg);

                    throw new WmsBadCredentialsException(errMsg, errorCnt);
                } else {// 한도가 초과한 경우
                    String errMsg = messageByLocale.get("wms.login.error.limit-excesss-bad-credentials", McpDate.nowDateStr());
                    if (userDetails.getErrorCnt() + 1 == passwordErrorLimit) { // 현재 오류 횟수가 한도와 동일한 경우 update
                        memberService.updateMemberStatus(userId, MemberStatusCode.P, passwordErrorLimit, errMsg);
                    }

                    loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.PASSWORD_LIMIT.getCode()));
                    loginLog.setErrMsg(errMsg);

                    throw new LimitExcessBadCredentialsException(
                            messageByLocale.get("wms.login.error.LimitExcessBadCredentialsException", passwordErrorLimit), passwordErrorLimit);
                }
            }

            // 5. 계정 만료일
            if (userDetails.getExpireDt() != null) {
                if (McpDate.term(userDetails.getExpireDt()) < 0) {
                    String errMsg = messageByLocale.get("wms.login.error.expire-date", McpDate.nowDateStr());
                    memberService.updateMemberStatus(userId, MemberStatusCode.P, userDetails.getErrorCnt(), errMsg);

                    loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.USER_STATUS.getCode()));
                    loginLog.setErrMsg(messageByLocale.get("wms.login.error.AccountExpiredException"));

                    throw new AccountExpiredException(messageByLocale.get("wms.login.error.AccountExpiredException"));
                }
            }

            // 6. 장기 미접속자 처리
            /*
            if (userDetails.getLastLoginDt() != null) {
                if (McpDate.dayTerm(userDetails.getLastLoginDt()) < -(longTermUnconnectedDays)) {
                    String errMsg = messageByLocale.get("wms.login.error.long-term-unconnected", McpDate.nowDateStr());
                    memberService.updateMemberStatus(userId, MemberStatusCode.P, userDetails.getErrorCnt(), errMsg);
                    throw new LongTermUnconnectedException(
                            messageByLocale.get("wms.login.error.LongTermUnconnectedException", longTermUnconnectedDays));
                }
            }*/

            // 7. 패스워드 변경 일자 확인
            if (userDetails.getPasswordModDt() != null) {
                if (McpDate.dayTerm(userDetails.getPasswordModDt()) < -(passwordUnchangedLockDays)) {
                    String errMsg = messageByLocale.get("wms.login.error.password-unchanged-lock", McpDate.nowDateStr());
                    memberService.updateMemberStatus(userId, MemberStatusCode.P, userDetails.getErrorCnt(), errMsg);

                    loginLog.setErrCd(String.valueOf(UnauthrizedErrorCode.PASSWORD_LIMIT.getCode()));
                    loginLog.setErrMsg(messageByLocale.get("wms.login.error.PasswordUnchangedException"));

                    throw new PasswordUnchangedException(
                            messageByLocale.get("wms.login.error.PasswordUnchangedException", passwordUnchangedLockDays));
                }
            }

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userId, null, userDetails.getAuthorities());

            /**
             * 그룹웨어 정보로 사용자 정보 변경
             */
            if (groupwareUserInfo != null) {
                userDetails.setUserName(groupwareUserInfo.getUserName());
                userDetails.setPhoneNo(groupwareUserInfo.getPhone());
                //userDetails.setPosition(groupwareUserInfo.getPositionName());
                userDetails.setCellPhoneNo(groupwareUserInfo.getMobile());
                userDetails.setDept(groupwareUserInfo.getGroupName());
                userDetails.setEmailaddress(groupwareUserInfo.getEmail());
            }


            memberService.updateMemberLoginInfo(userId, McpDate.now(), userIp, userDetails);
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
