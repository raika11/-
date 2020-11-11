package jmnet.moka.core.tps.mvc.reporter.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

/**
 * <pre>
 * 리포트 DTO
 * 2020. 11. 09. obiwan 최초생성
 * </pre>
 *
 * @author obiwan
 * @since 2020. 11. 09. 오후 1:32:16
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReporterDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722632117L;

    public static final Type TYPE = new TypeReference<List<ReporterDTO>>() {
    }.getType();

    /**
     * 기자일련버호
     */
    @NotNull(message = "{tps.reporterMsg.error.notnull.repSeq}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.reporterMsg.error.pattern.repSeq}")
    private long repSeq;

    /**
     * 아이디
     */
    private String joinsId;

    /**
     * 이름
     */
    private String repName;

    /**
     * 직접관리용 회사코드
     */
    private String r1Cd;

    /**
     * 직접관리용 회사코드명
     */
    private String r1CdNm;

    /**
     * 조직개편 부서 코드
     */
    private String r2Cd;

    /**
     * 조직개편 부서 코드명
     */
    private String r2CdNm;

    /**
     * 조직개편 실/국 코드
     */
    private String r3Cd;

    /**
     * 조직개편 실/국 코드명
     */
    private String r3CdNm;

    /**
     * 조직개편 팀 코드
     */
    private String r4Cd;

    /**
     * 조직개편 팀 코드명
     */
    private String r4CdNm;


    /**
     * 이메일
     */
    private String repEmail1;

    /**
     * 노출여부
     */
    private String usedYn;

    /**
     * 기자페이지
     */
    private String joinsBlog;
}
