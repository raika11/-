package jmnet.moka.core.tps.common.dto.edit;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import jmnet.moka.common.utils.McpString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * <pre>
 * widget 타입이 SELECT일때 option 정보
 * Project : moka
 * Package : jmnet.moka.core.tps.common.dto.edit
 * ClassName : OutputDTO
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 08:26
 */
@JsonRootName("option")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class OptionDTO {

    /**
     * selectBox에 선택된 항목의 텍스트
     */
    private String text;

    /**
     * selectBox의 선택된 항목의 실제 값
     */
    private String value;

    /**
     * 문자열을 잘라서 text, value 값을 설정한다.
     *
     * @param value value
     */
    public OptionDTO(String value) {
        String[] values = McpString
                .defaultValue(value)
                .split("\\|");
        if (values.length == 2) {
            if (McpString.isNotEmpty(values[0])) {
                this.text = values[0];
            } else {
                this.text = values[1];
            }
            this.value = values[1];
        } else {
            this.value = value;
            this.text = value;
        }
    }

}
