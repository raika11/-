package jmnet.moka.web.wms.config.security.groupware;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.common.soap
 * ClassName : RequestUserInfo
 * Created : 2020-12-10 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-10 10:32
 */
@NoArgsConstructor
@AllArgsConstructor
public class GroupWareUserInfo {

    @Getter
    @Setter
    private String userId;

    /**
     * 사용자명
     */
    private String userName;

    /**
     * 회사명
     */
    private String compnayName;

    /**
     * 그룹명
     */
    private String groupName;

    /**
     * 전번
     */
    private String phone;

    /**
     * 모바일폰
     */
    private String mobile;

    /**
     * 직책
     */
    private String positionName;

    /**
     * 팀명
     */
    private String teamName;

    /**
     * 이메일
     */
    private String email;

    @JsonProperty("userName")
    public String getUserName() {
        return userName;
    }

    @JsonProperty("NAME")
    public void setUserName(String userName) {
        this.userName = userName;
    }

    @JsonProperty("compnayName")
    public String getCompnayName() {
        return compnayName;
    }

    @JsonProperty("DN_NAME")
    public void setCompnayName(String compnayName) {
        this.compnayName = compnayName;
    }

    @JsonProperty("groupName")
    public String getGroupName() {
        return groupName;
    }

    @JsonProperty("GR_NAME")
    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    @JsonProperty("phone")
    public String getPhone() {
        return phone;
    }

    @JsonProperty("PHONE")
    public void setPhone(String phone) {
        this.phone = phone;
    }

    @JsonProperty("mobile")
    public String getMobile() {
        return mobile;
    }

    @JsonProperty("MOBILE")
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    @JsonProperty("positionName")
    public String getPositionName() {
        return positionName;
    }

    @JsonProperty("PO_NAME")
    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    @JsonProperty("teamName")
    public String getTeamName() {
        return teamName;
    }

    @JsonProperty("TI_NAME")
    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    @JsonProperty("email")
    public String getEmail() {
        return email;
    }

    @JsonProperty("MAILID")
    public void setEmail(String email) {
        this.email = email;
    }
}
