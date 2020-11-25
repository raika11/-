package jmnet.moka.core.tps.mvc.editform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.core.type.TypeReference;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.member.dto.MemberDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * <pre>
 * 편집 폼 Part 이력
 * Project : moka
 * Package : jmnet.moka.core.tps.common.dto.edit
 * ClassName : Part
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 07:41
 */
@JsonRootName("part")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@SuperBuilder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class EditFormPartHistDTO {

    public static final Type TYPE = new TypeReference<List<EditFormPartHistDTO>>() {
    }.getType();

    /**
     * 예약일시
     */
    protected Date reserveDt;
    /**
     * 이력 일련번호
     */
    private Long seqNo;
    /**
     * Edit Form Part 일련번호
     */
    private Long partSeq;
    /**
     * Form Part ID
     */
    private String partId;
    /**
     * Form Part Title
     */
    private String partTitle;
    /**
     * Edit Form Data
     */
    private String formData;

    /**
     * 사용 여부
     */
    private String usedYn = MokaConstants.YES;
    /**
     * 상태
     */
    private EditStatusCode status;

    /**
     * 승인 여부
     */
    @Builder.Default
    private String approvalYn = MokaConstants.NO;

    /**
     * 필드 그룹 목록
     */
    private List<FieldGroupDTO> fieldGroups;

    /**
     * 등록자
     */
    private MemberDTO regMember;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    private Date regDt;

}
