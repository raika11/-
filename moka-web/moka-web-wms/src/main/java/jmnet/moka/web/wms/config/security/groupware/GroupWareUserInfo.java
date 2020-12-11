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
@Getter
@Setter
public class GroupWareUserInfo {

    @JsonProperty("NAME")
    private String userName;

    @JsonProperty("DN_NAME")
    private String compnayName;

    @JsonProperty("GR_NAME")
    private String groupName;

    @JsonProperty("PHONE")
    private String phone;

    @JsonProperty("MOBILE")
    private String mobile;

    @JsonProperty("PO_NAME")
    private String positionName;

    @JsonProperty("TI_NAME")
    private String teamName;

    @JsonProperty("MAILID")
    private String email;
}
