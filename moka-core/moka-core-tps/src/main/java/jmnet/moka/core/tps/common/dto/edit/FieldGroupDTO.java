package jmnet.moka.core.tps.common.dto.edit;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * <pre>
 * 필드 목록을 group 값으로 필드 목록을 분리
 * Project : moka
 * Package : jmnet.moka.core.tps.common.dto.edit
 * ClassName : FieldDTO
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 08:26
 */
@JsonRootName("fieldGroup")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class FieldGroupDTO {
    /**
     * 그룹번호
     */
    private Integer group;
    /**
     * 필드 목록
     */
    private List<FieldDTO> fields;


}
