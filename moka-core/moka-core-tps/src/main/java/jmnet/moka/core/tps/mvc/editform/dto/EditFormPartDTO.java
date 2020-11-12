package jmnet.moka.core.tps.mvc.editform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.editform.code.EditFormStatusCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * <pre>
 * 편집 폼 아이템
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
public class EditFormPartDTO {

    /**
     * 예약일시
     */
    protected Date reserveDt;
    /**
     * Edit Form 일련번호
     */
    private Long formSeq;
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
     * EditForm
     */
    private EditFormDTO editForm;
    /**
     * 사용 여부
     */
    private String usedYn = MokaConstants.YES;
    /**
     * 상태
     */
    private EditFormStatusCode status;
    /**
     * 필드 그룹 목록
     */
    private List<FieldGroupDTO> fieldGroups;

}
