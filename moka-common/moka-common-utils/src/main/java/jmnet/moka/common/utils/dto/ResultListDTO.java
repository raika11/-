package jmnet.moka.common.utils.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.google.common.reflect.TypeToken;

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
public class ResultListDTO<T> implements Serializable {

    private long totalCnt;
    private List<T> list;

    @JsonIgnore
    public Type getListType() {
        Type listType = new TypeToken<List<T>>() {}.getType();
        return listType;
    }
}
