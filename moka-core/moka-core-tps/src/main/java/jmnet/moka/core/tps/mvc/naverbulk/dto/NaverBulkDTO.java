package jmnet.moka.core.tps.mvc.naverbulk.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Column;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

/**
 * <pre>
 * 네이버벌크문구목록 DTO
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
public class NaverBulkDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722652118L;

    public static final Type TYPE = new TypeReference<List<NaverBulkDTO>>() {
    }.getType();

    /**
     * int   10,0    NO  클릭기사일련번호
     */
    @Min(value = 0, message = "{tps.naver-bulk.error.pattern.clickartSeq}")
    private Long clickartSeq;

    /**
     * char 1   NO  클릭기사구분 - H(아티클핫클릭) N(네이버벌크)
     */
    @NotNull(message = "{tps.naver-bulk.error.notnull.clickartDiv}")
    @Pattern(regexp = "[H|N]{1}$", message = "{tps.naver-bulk.error.pattern.clickartDiv}")
    private String clickartDiv;

    /**
     * varchar  2   NO  출처 - 썬데이[60] 중앙일보[3]
     */
    @NotNull(message = "{tps.naver-bulk.error.notnull.sourceCode}")
    private String sourceCode;

    /**
     * char 1   ('N')   NO  서비스여부
     */
    @NotNull(message = "{tps.naver-bulk.error.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.naver-bulk.error.pattern.usedYn}")
    @Builder.Default
    String usedYn = MokaConstants.NO;

    /**
     * varchar  10  YES 상태 - SAVE(임시) / PUBLISH(전송)
     */
//    @Pattern(regexp = "[SAVE|PUBLISH]{4,7}$", message = "{tps.naver-bulk.error.pattern.usedYn}")
    @Length(max = 10, message = "{tps.naver-bulk.error.length.status}")
    String status;

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
    @Length(max = 30, message = "{tps.naver-bulk.error.length.regId}")
    private String regId;


    /**
     * char 1   ('N')   NO  벌크전송여부
     */
    @NotNull(message = "{tps.naver-bulk.error.notnull.bulkSendYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.naver-bulk.error.pattern.bulkSendYn}")
    @Builder.Default
    private String bulkSendYn = MokaConstants.NO;

    /**
     * datetime YES 벌크전송일시
     */
    @DTODateTimeFormat
    private Date bulkSendDt;
}
