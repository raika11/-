package jmnet.moka.core.tps.mvc.bulk.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * <pre>
 * 벌크문구목록 DTO
 * 2020. 11. 16. obiwan 최초생성
 * </pre>
 *
 * @author obiwan
 * @since 2020. 11. 16. 오후 1:32:16
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class BulkDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722652118L;

    public static final Type TYPE = new TypeReference<List<BulkDTO>>() {
    }.getType();

    /**
     * int   10,0    NO  클릭기사일련번호
     */
    @Min(value = 0, message = "{tps.bulk.error.pattern.bulkartSeq}")
    private Long bulkartSeq;

    /**
     * char 1   NO  클릭기사구분 - H(아티클핫클릭) N(벌크)
     */
    @NotNull(message = "{tps.bulk.error.notnull.bulkartDiv}")
    @Pattern(regexp = "[H|N]{1}$", message = "{tps.bulk.error.pattern.bulkartDiv}")
    private String bulkartDiv;

    /**
     * varchar  2   NO  출처 - 썬데이[60] 중앙일보[3]
     */
    @NotNull(message = "{tps.bulk.error.notnull.sourceCode}")
    private String sourceCode;

    /**
     * char 1   ('N')   NO  서비스여부
     */
    @NotNull(message = "{tps.bulk.error.notnull.usedYn}") @Pattern(regexp = "[Y|N]{1}$", message = "{tps.bulk.error.pattern.usedYn}")
    @Builder.Default
    String usedYn = MokaConstants.NO;

    /**
     * varchar  10  YES 상태 - SAVE(임시) / PUBLISH(전송)
     */
    //    @Pattern(regexp = "[SAVE|PUBLISH]{4,7}$", message = "{tps.bulk.error.pattern.usedYn}")
    @Length(max = 10, message = "{tps.bulk.error.length.status}") String status;

    /**
     * datetime YES 전송일시 - PUBLISH 될때 들어감
     */
    @DTODateTimeFormat
    private Date sendDt;

    /**
     * datetime (getdate()) NO  등록일시
     */
    @DTODateTimeFormat
    private Date regDt;

    /**
     * varchar  30  YES 등록자
     */
    @Length(max = 30, message = "{tps.bulk.error.length.regId}")
    private String regId;


    /**
     * char 1   ('N')   NO  벌크전송여부
     */
    @NotNull(message = "{tps.bulk.error.notnull.bulkSendYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.bulk.error.pattern.bulkSendYn}")
    @Builder.Default
    private String bulkSendYn = MokaConstants.NO;

    /**
     * datetime YES 벌크전송일시
     */
    @DTODateTimeFormat
    private Date bulkSendDt;
}
