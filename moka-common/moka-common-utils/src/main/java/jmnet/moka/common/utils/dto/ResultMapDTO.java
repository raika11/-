package jmnet.moka.common.utils.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.HashMap;
import java.util.Map;
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
public class ResultMapDTO extends ResultDTO<Map<String, Object>> {
    // 목록
    public static final String LIST = "LIST";
    // 건수
    public static final String COUNT = "COUNT";

    public ResultMapDTO() {
        this.body = new HashMap<>();
    }

    public ResultMapDTO(HttpStatus status, Map<String, Object> body) {
        this(status, body, null);
    }

    public ResultMapDTO(HttpStatus status) {
        this(status, (String) null);
    }

    public ResultMapDTO(HttpStatus status, String message) {
        header = ResultHeaderDTO.create(status, message);
        this.body = new HashMap<>();
    }

    public ResultMapDTO(HttpStatus status, Map<String, Object> body, String message) {
        header = ResultHeaderDTO.create(status, message);
        this.body = new HashMap<>();
        this.body.putAll(body);
    }

    // 성공: body 세팅
    public ResultMapDTO(Map<String, Object> successBody) {
        this(successBody, null);
    }

    public ResultMapDTO(Map<String, Object> successBody, String message) {
        header = ResultHeaderDTO.success(message);
        this.body = new HashMap<>();
        this.body.putAll(successBody);
    }

    // 실패: 헤더만 세팅
    public ResultMapDTO(int resultCode, String failMessage) {
        header = ResultHeaderDTO.fail(resultCode, failMessage);
    }

    /**
     * BODY에 정보를 추가한다.
     *
     * @param key   정보 KEY
     * @param value 정보 VALUE
     */
    public void addBodyAttribute(String key, Object value) {
        this.body.put(key, value);
    }

    /**
     * BODY에 LIST를 추가한다.
     *
     * @param value 정보 VALUE
     */
    public void addBodyListAttribute(Object value) {
        this.body.put(LIST, value);
    }

    /**
     * BODY에 COUNT를 추가한다.
     *
     * @param value 정보 VALUE
     */
    public void addBodyCountAttribute(Object value) {
        this.body.put(COUNT, value);
    }

    /**
     * BODY에 ResultListDTO를 추가한다.
     *
     * @param value ResultListDTO
     */
    public void addBodyResultListDTO(ResultListDTO<?> value) {
        this.body.put(LIST, value);
    }

}
