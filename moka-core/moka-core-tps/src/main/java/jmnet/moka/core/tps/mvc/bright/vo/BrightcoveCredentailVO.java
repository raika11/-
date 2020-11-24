package jmnet.moka.core.tps.mvc.bright.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;
import jmnet.moka.common.utils.McpDate;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bright.vo
 * ClassName : BrightcoveCredentailVO
 * Created : 2020-11-24 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-24 10:46
 */
@Getter
@Setter
@ToString
public class BrightcoveCredentailVO {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("token_type")
    private String tokenType;

    @JsonProperty("expires_in")
    private int expiresIn;

    private Date expireDt = McpDate.now();
}
