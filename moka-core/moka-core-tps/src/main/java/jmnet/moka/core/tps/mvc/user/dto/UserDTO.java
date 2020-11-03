package jmnet.moka.core.tps.mvc.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Collection;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.member.entity.Member;
import jmnet.moka.core.tps.mvc.user.entity.User;
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

    private String status;

    // private String createYmdt;
    //
    // private String creator;
    //
    // private String modifiedYmdt;
    //
    // private String modifier;

    @JsonIgnore
    private Collection<? extends GrantedAuthority> authorities;

    public UserDTO() {
    }

    public UserDTO(String userId, String allowMediaIds, String cellPhoneNo, String dept, String emailaddress,
            // String createYmdt, String creator, String modifiedYmdt, String modifier,
            String password, String phoneNo, String photo, String position, String userLevel, String userName, String workYn,
            Collection<? extends GrantedAuthority> authorities, String status) {
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
        // this.createYmdt = createYmdt;
        // this.creator = creator;
        // this.modifiedYmdt = modifiedYmdt;
        // this.modifier = modifier;
        this.authorities = authorities;
        this.status = status;
    }

    public static UserDTO create(User user, List<GrantedAuthority> authorities) {
        return new UserDTO(user.getUserId(), user.getAllowMediaIds(), user.getCellPhoneNo(), String.valueOf(user.getDeptNo()), user.getEmailaddress(),
                // user.getCreateYmdt(), user.getCreator(), user.getModifiedYmdt(),
                // user.getModifier(),
                user.getPassword(), user.getPhoneNo(), user.getPhoto(), user.getPosition(), user.getUserLevel(), user.getUserName(), user.getWorkYn(),
                authorities, MokaConstants.YES);
    }

    public static UserDTO create(Member user, List<GrantedAuthority> authorities) {
        return new UserDTO(user.getMemberId(), null, user.getMobilePhone(), user.getDept(), user.getEmail(), user.getPassword(),
                user.getCompanyPhone(), null, user.getGroup(), null, user.getMemberNm(), user.getStatus(), authorities, user.getStatus());
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
