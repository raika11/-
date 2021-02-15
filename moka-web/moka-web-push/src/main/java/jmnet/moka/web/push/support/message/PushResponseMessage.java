/**
 * NSP MAS MPS FcmResponseMessage.java 2018-03-14
 */
package jmnet.moka.web.push.support.message;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * FCM 결과 메시지
 * Project : moka
 * Package : jmnet.moka.web.push.support.message
 * ClassName : PushResponseMessage
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
public class PushResponseMessage {
    /**
     * 멀티캐스트 고유ID
     */
    @JsonProperty("multicast_id")
    private String multicastId;

    /**
     * 성공한 메시지 갯수
     */
    @JsonProperty("success")
    private int success;

    /**
     * 실패한 메시지 갯수
     */
    @JsonProperty("failure")
    private int failure;

    /**
     * 정식 등록 토큰이 포함된 결과 수
     */
    @JsonProperty("canonical_ids")
    private int canonicalIds;

    /**
     * 메시지 상태 개체 배열
     */
    @JsonProperty("results")
    private List<FcmResponseResultItem> results;

    /**
     * multicastId를(을) 가져온다.
     *
     * @return multicastId
     */
    public String getMulticastId() {
        return multicastId;
    }

    /**
     * success를(을) 가져온다.
     *
     * @return success
     */
    public int getSuccess() {
        return success;
    }

    /**
     * failure를(을) 가져온다.
     *
     * @return failure
     */
    public int getFailure() {
        return failure;
    }

    /**
     * canonicalIds를(을) 가져온다.
     *
     * @return canonicalIds
     */
    public int getCanonicalIds() {
        return canonicalIds;
    }

    /**
     * results를(을) 가져온다.
     *
     * @return results
     */
    public List<FcmResponseResultItem> getResults() {
        return results;
    }



}
