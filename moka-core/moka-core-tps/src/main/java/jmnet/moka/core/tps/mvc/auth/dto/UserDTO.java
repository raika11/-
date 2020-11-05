package jmnet.moka.core.tps.mvc.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * <pre>
 * User DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오전 9:46:42
 */
public class UserDTO implements UserDetails {

    private static final long serialVersionUID = 9125823719530590136L;

    private String userId;

    private String userName;

    @JsonIgnore
    private String password;

    private String dept;

    private String position;

    private String emailaddress;

    private String phoneNo;

    private String cellPhoneNo;

    private String workYn;

    private String userLevel;

    private String photo;

    private String allowMediaIds;

    private String sessionId;

    private MemberStatusCode status;

    private Integer errorCnt;

    private Date expireDt;

    private Date passwordModDt;

    private Date lastLoginDt;

    private String notify;

    @JsonIgnore
    private Collection<? extends GrantedAuthority> authorities;

    public UserDTO() {
    }

    public UserDTO(String userId, String allowMediaIds, String cellPhoneNo, String dept, String emailaddress, String password, String phoneNo,
            String photo, String position, String userLevel, String userName, String workYn, Collection<? extends GrantedAuthority> authorities,
            MemberStatusCode status, Integer errorCnt, Date expireDt, Date passwordModDt, Date lastLoginDt) {
        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.dept = dept;
        this.position = position;
        this.emailaddress = emailaddress;
        this.phoneNo = phoneNo;
        this.cellPhoneNo = cellPhoneNo;
        this.workYn = workYn;
        this.userLevel = userLevel;
        this.photo = photo;
        this.allowMediaIds = allowMediaIds;
        this.authorities = authorities;
        this.status = status;
        this.errorCnt = errorCnt;
        this.expireDt = expireDt;
        this.passwordModDt = passwordModDt;
        this.lastLoginDt = lastLoginDt;
    }



    public static UserDTO create(MemberInfo user, List<GrantedAuthority> authorities) {
        return new UserDTO(user.getMemberId(), null, user.getMobilePhone(), user.getDept(), user.getEmail(), user.getPassword(),
                user.getCompanyPhone(), null, user.getGroup(), null, user.getMemberNm(), user
                .getStatus()
                .getCode(), authorities, user.getStatus(), user.getErrCnt(), user.getExpireDt(), user.getPasswordModDt(), user.getLastLoginDt());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.userId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAllowMediaIds() {
        return allowMediaIds;
    }

    public void setAllowMediaIds(String allowMediaIds) {
        this.allowMediaIds = allowMediaIds;
    }

    public String getCellPhoneNo() {
        return cellPhoneNo;
    }

    public void setCellPhoneNo(String cellPhoneNo) {
        this.cellPhoneNo = cellPhoneNo;
    }

    // public String getCreateYmdt() {
    // return createYmdt;
    // }
    //
    // public void setCreateYmdt(String createYmdt) {
    // this.createYmdt = createYmdt;
    // }
    //
    // public String getCreator() {
    // return creator;
    // }
    //
    // public void setCreator(String creator) {
    // this.creator = creator;
    // }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getEmailaddress() {
        return emailaddress;
    }

    public void setEmailaddress(String emailaddress) {
        this.emailaddress = emailaddress;
    }


    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getUserLevel() {
        return userLevel;
    }

    public void setUserLevel(String userLevel) {
        this.userLevel = userLevel;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getWorkYn() {
        return workYn;
    }

    public void setWorkYn(String workYn) {
        this.workYn = workYn;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public MemberStatusCode getStatus() {
        return status;
    }

    public void setStatus(MemberStatusCode status) {
        this.status = status;
    }

    public Integer getErrorCnt() {
        return errorCnt;
    }

    public void setErrorCnt(Integer errorCnt) {
        this.errorCnt = errorCnt;
    }

    public Date getExpireDt() {
        return expireDt;
    }

    public void setExpireDt(Date expireDt) {
        this.expireDt = expireDt;
    }

    public Date getPasswordModDt() {
        return passwordModDt;
    }

    public void setPasswordModDt(Date passwordModDt) {
        this.passwordModDt = passwordModDt;
    }

    public Date getLastLoginDt() {
        return lastLoginDt;
    }

    public void setLastLoginDt(Date lastLoginDt) {
        this.lastLoginDt = lastLoginDt;
    }

    public String getNotify() {
        return notify;
    }

    public void setNotify(String notify) {
        this.notify = notify;
    }
}
