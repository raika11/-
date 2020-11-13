package jmnet.moka.core.tps.mvc.member.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.dto
 * ClassName : MemberDTO
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 16:08
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MemberSearchDTO extends SearchDTO {
    /**
     * 사용자ID
     */
    private String memberId;

    /**
     * 사용자명
     */
    private String memberNm;

    /**
     * 상태(유효/정지)
     */
    private MemberStatusCode status;

    /**
     * 부서
     */
    @Builder.Default
    private String dept = "";


}
