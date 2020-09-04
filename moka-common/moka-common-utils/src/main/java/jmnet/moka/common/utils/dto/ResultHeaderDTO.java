package jmnet.moka.common.utils.dto;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@SuppressWarnings("serial")
@JsonRootName("header")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResultHeaderDTO implements Serializable {
    private boolean success;

    /** 결과 오류 코드 **/
    // success=true, resultCode=200
    // success=false
    // 인증오류: resultCode=401
    // 서버오류: resultCode=500
    private int resultCode;
    /** 결과 유형 **/
    private String resultType;
    /** 결과 메세지 **/
    private String message;

    /** redirect url **/
    private String redirect;

    public ResultHeaderDTO(boolean success, int resultCode, String resultType, String message) {
        this.success = success;
        this.resultCode = resultCode;
        this.resultType = resultType;
        this.message = message;
    }
}
