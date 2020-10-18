package jmnet.moka.core.tps.mvc.codeMgt.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.*;
import org.hibernate.validator.constraints.Length;

/**
 * <pre>
 * 공통코드 그룹 DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오전 10:24:33
 * @author jeon
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class CodeMgtGrpDTO implements Serializable {

    private static final long serialVersionUID = -6243730311717090869L;

    public static final Type TYPE = new TypeReference<List<CodeMgtGrpDTO>>() {}.getType();

    /**
     * 일련번호
     */
    @Min(value = 0, message = "{tps.codeMgtGrp.error.invalid.seqNo}")
    private Long seqNo;

    /**
     * 그룹코드
     */
    @NotNull(message = "{tps.codeMgtGrp.error.invalid.grpCd}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.invalid.grpCd2}")
    @Length(min = 1, max = 12, message = "{tps.codeMgtGrp.error.invalid.grpCd3}")
    private String grpCd;

    /**
     * 코드명
     */
    @NotNull(message = "{tps.codeMgtGrp.error.invalid.cdNm}")
    @Pattern(regexp = ".+", message = "{tps.codeMgtGrp.error.invalid.cdNm}")
    @Length(min = 1, max = 100, message = "{tps.codeMgtGrp.error.invalid.cdNm2}")
    private String cdNm;

    /**
     * 코드영문명
     */
    @Length(max = 100, message = "{tps.codeMgtGrp.error.invalid.cdEngNm}")
    private String cdEngNm;

    /**
     * 코드코멘트
     */
    @Length(max = 100, message = "{tps.codeMgtGrp.error.invalid.cdComment}")
    private String cdComment;

    /**
     * 하위 기타코드 갯수. 디비에는 없는 데이타임.
     */
    private Long countCodeMgt;
}
