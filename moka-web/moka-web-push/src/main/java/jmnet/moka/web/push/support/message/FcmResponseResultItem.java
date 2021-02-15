/**
 * NSP MAS MPS FcmResponseResultItem.java 2018-03-14
 */
package jmnet.moka.web.push.support.message;

import com.fasterxml.jackson.annotation.JsonProperty;
import jmnet.moka.web.push.support.code.FcmErrorType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * FCM 메시지 상태
 * Project : moka
 * Package : jmnet.moka.web.push.support.message
 * ClassName : FcmResponseResultItem
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:33
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class FcmResponseResultItem {
    /**
     * 메시지 고유 ID
     */
    @JsonProperty("message_id")
    private String messageId;

    /**
     * 변경할 토큰
     */
    @JsonProperty("registration_id")
    private String registrationId;

    /**
     * 오류
     */
    @JsonProperty("error")
    private FcmErrorType error;


}
