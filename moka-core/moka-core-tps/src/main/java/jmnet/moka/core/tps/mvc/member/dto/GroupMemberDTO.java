package jmnet.moka.core.tps.mvc.member.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.tps.mvc.member.entity.Member;
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
 * ClassName : GroupMemberDTO
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
public class GroupMemberDTO {
    /**
     * 일련번호
     */
    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    private Long seqNo;

    /**
     * 그룹코드
     */
    @Pattern(regexp = "[G][0-9]{2}$", message = "{tps.group.error.pattern.groupCd}")
    private String groupCd;

    /**
     * 사용여부 Y : 예, N : 아니오
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
    private String usedYn = "Y";

    /**
     * 사용자ID
     */
    @Pattern(regexp = ".+", message = "{tps.domain.error.notnull.memberId}")
    private String memberId;

    /**
     * 사용자 정보
     */
    private Member member;
}
