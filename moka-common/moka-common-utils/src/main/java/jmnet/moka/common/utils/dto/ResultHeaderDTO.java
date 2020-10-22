package jmnet.moka.common.utils.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import java.io.Serializable;
import jmnet.moka.common.utils.McpString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@SuppressWarnings("serial")
@JsonRootName("header")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResultHeaderDTO implements Serializable {
    private boolean success;

    /**
     * 결과 오류 코드
     **/
    // success=true, resultCode=200
    // success=false
    // 인증오류: resultCode=401
    // 서버오류: resultCode=500
    private int resultCode;
    /**
     * 결과 유형
     **/
    private String resultType;
    /**
     * 결과 메세지
     **/
    private String message;

    /**
     * redirect url
     **/
    private String redirect;

    public ResultHeaderDTO(boolean success, int resultCode, String resultType, String message) {
        this.success = success;
        this.resultCode = resultCode;
        this.resultType = resultType;
        this.message = message;
    }

    /**
     * 헤더 생성
     *
     * @param status HttpStatus
     * @return ResultHeaderDTO
     */
    public static ResultHeaderDTO create(HttpStatus status) {
        return create(status, null);
    }

    /**
     * 헤더 생성
     *
     * @param status  HttpStatus
     * @param message 메세지
     * @return ResultHeaderDTO
     */
    public static ResultHeaderDTO create(HttpStatus status, String message) {
        return ResultHeaderDTO
                .builder()
                .success(status.equals(HttpStatus.OK) || status.equals(HttpStatus.ACCEPTED))
                .resultCode(status.value())
                .resultType(status.name())
                .message(McpString.defaultValue(message, status.getReasonPhrase()))
                .build();
    }

    /**
     * 성공 헤더 생성
     *
     * @param message 성공 메세지
     * @return ResultHeaderDTO
     */
    public static ResultHeaderDTO success(String message) {
        return create(HttpStatus.OK, message);
    }

    /**
     * 성공 헤더 생성
     *
     * @return ResultHeaderDTO
     */
    public static ResultHeaderDTO success() {
        return create(HttpStatus.OK, null);
    }

    /**
     * 실패 헤더 생성
     *
     * @param resultCode 실패 코드
     * @param message    실패 메세지
     * @return ResultHeaderDTO
     */
    public static ResultHeaderDTO fail(int resultCode, String message) {
        return ResultHeaderDTO
                .builder()
                .success(false)
                .resultCode(resultCode)
                .message(message)
                .build();
    }
}
