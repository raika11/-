package jmnet.moka.core.tps.mvc.user.dto;

import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jmnet.moka.core.tps.mvc.user.entity.User;

/**
 * <pre>
 * User DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오전 9:46:42
 * @author jeon
 */
public class UserDTO implements UserDetails {

    private static final long serialVersionUID = 9125823719530590136L;

    private String userId;

    private String userName;

    @JsonIgnore
    private String password;

    private Integer deptNo;

    private String position;

    private String emailaddress;

    private String phoneNo;

    private String cellPhoneNo;

    private String workYn;

    private String userLevel;

    private String photo;

    private String allowMediaIds;

    private String sessionId;

    // private String createYmdt;
    //
    // private String creator;
    //
    // private String modifiedYmdt;
    //
    // private String modifier;

    @JsonIgnore
    private Collection<? extends GrantedAuthority> authorities;

    public UserDTO() {}

    public UserDTO(String userId, String allowMediaIds, String cellPhoneNo, Integer deptNo,
            String emailaddress,
            // String createYmdt, String creator, String modifiedYmdt, String modifier,
            String password, String phoneNo, String photo, String position, String userLevel,
            String userName, String workYn, Collection<? extends GrantedAuthority> authorities) {
        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.deptNo = deptNo;
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
    }

    public static UserDTO create(User user, List<GrantedAuthority> authorities) {
        return new UserDTO(user.getUserId(), user.getAllowMediaIds(), user.getCellPhoneNo(),
                user.getDeptNo(), user.getEmailaddress(),
                // user.getCreateYmdt(), user.getCreator(), user.getModifiedYmdt(),
                // user.getModifier(),
                user.getPassword(), user.getPhoneNo(), user.getPhoto(), user.getPosition(),
                user.getUserLevel(), user.getUserName(), user.getWorkYn(), authorities);
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

    public Integer getDeptNo() {
        return deptNo;
    }

    public void setDeptNo(int deptNo) {
        this.deptNo = deptNo;
    }

    public String getEmailaddress() {
        return emailaddress;
    }

    public void setEmailaddress(String emailaddress) {
        this.emailaddress = emailaddress;
    }

    // public String getModifiedYmdt() {
    // return modifiedYmdt;
    // }
    //
    // public void setModifiedYmdt(String modifiedYmdt) {
    // this.modifiedYmdt = modifiedYmdt;
    // }
    //
    // public String getModifier() {
    // return modifier;
    // }
    //
    // public void setModifier(String modifier) {
    // this.modifier = modifier;
    // }

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

}
