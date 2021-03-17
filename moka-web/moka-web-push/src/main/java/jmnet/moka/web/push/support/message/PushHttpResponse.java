/**
 * NSP MAS MPS FcmResponseError.java 2018-03-15
 */
package jmnet.moka.web.push.support.message;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import java.util.Map;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * <pre>
 * FCM 오류 메시지 HTTP 200이 아닌 결과인 경우의 메시지
 * Project : moka
 * Package : jmnet.moka.web.push.support.message
 * ClassName : PushHttpResponse
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
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class PushHttpResponse {


    private PushAppToken pushToken;

    private int statusCode;

    private Map<String, List<String>> headers;

    private String message;

    private String body;



    public PushAppToken getPushToken() {
        return pushToken;
    }



    public void setPushToken(PushAppToken pushToken) {
        this.pushToken = pushToken;
    }


    public int getStatusCode() {
        return statusCode;
    }



    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }



    public Map<String, List<String>> getHeaders() {
        return headers;
    }



    public void setHeaders(Map<String, List<String>> headers) {
        this.headers = headers;
    }



    public String getMessage() {
        return message;
    }



    public void setMessage(String message) {
        this.message = message;
    }



    public String getBody() {
        return body;
    }



    public void setBody(String body) {
        this.body = body;
    }



}
