package jmnet.moka.web.wms.config.security.jwt;

import org.springframework.security.authentication.AbstractAuthenticationToken;

/**
 * <pre>
 * JWT 처리를 위한 인증토큰
 * 2020. 7. 18. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 7. 18. 오후 4:12:08
 * @author kspark
 */
public class WmsJwtAuthenticationToken extends AbstractAuthenticationToken {
    private static final long serialVersionUID = -5319742622436365242L;
    private String userId;
    private String userPassword;

    public WmsJwtAuthenticationToken(String userId, String userPassword) {
		super(null);
		this.userId = userId;
        this.userPassword = userPassword;
	}

	/**
	 * <pre>
	 * 인증을 위한 정보를 반환한다.
	 * </pre>
	 * @return 없음
	 * @see org.springframework.security.core.Authentication#getCredentials()
	 */
	@Override
	public Object getCredentials() {
        return this.userPassword;
	}

	/**
	 * <pre>
	 * 사용자 식별정보를 반환한다.
	 * </pre>
	 * @return userId
	 * @see org.springframework.security.core.Authentication#getPrincipal()
	 */
	@Override
	public Object getPrincipal() {
		return this.userId;
	}

}
