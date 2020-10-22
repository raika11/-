package jmnet.moka.common.utils.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.http.HttpStatus;

/**
 * <pre>
 * 공통 결과 메세지
 * 2017. 4. 21. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2017. 4. 21. 오후 2:59:15
 */
@SuppressWarnings("serial")
@JsonRootName("resultInfo")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResultDTO<T> implements Serializable {

    protected ResultHeaderDTO header;
    protected T body;
    
    public ResultDTO(HttpStatus status, T body) {
        this(status, body, null);
    }

    public ResultDTO(HttpStatus status, T body, String message) {
        header = ResultHeaderDTO.create(status, message);
        this.body = body;
    }

    // 성공: body 세팅
    public ResultDTO(T successBody) {
        this(successBody, null);
    }

    public ResultDTO(T successBody, String message) {
        header = ResultHeaderDTO.success(message);
        this.body = successBody;
    }

    // 실패: 헤더만 세팅
    public ResultDTO(int resultCode, String failMessage) {
        header = ResultHeaderDTO.fail(resultCode, failMessage);
    }

}
