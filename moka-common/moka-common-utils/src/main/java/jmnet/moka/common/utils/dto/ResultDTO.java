package jmnet.moka.common.utils.dto;

import java.io.Serializable;
import org.springframework.http.HttpStatus;
import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 
 * <pre>
 * 공통 결과 메세지
 * 2017. 4. 21. ince 최초생성
 * </pre>
 * 
 * @since 2017. 4. 21. 오후 2:59:15
 * @author ince
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
        header = ResultHeaderDTO.builder()
                .success(status.equals(HttpStatus.OK) || status.equals(HttpStatus.ACCEPTED))
                .resultCode(status.value()).resultType(status.name())
                .message(status.getReasonPhrase()).build();
        this.body = body;
    }

    // 성공: body 세팅
    public ResultDTO(T successBody) {
        header = ResultHeaderDTO.builder().success(true).resultCode(HttpStatus.OK.value())
                .resultType("").message("").build();
        this.body = successBody;
    }

    // 실패: 헤더만 세팅
    public ResultDTO(int resultCode, String failMessage) {
        header = ResultHeaderDTO.builder().success(false).resultCode(resultCode).resultType("")
                .message(failMessage).build();
    }

}
