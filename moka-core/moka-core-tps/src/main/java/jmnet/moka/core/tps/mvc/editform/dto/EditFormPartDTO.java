package jmnet.moka.core.tps.mvc.editform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
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
@JacksonXmlRootElement(localName = "part")
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
    @DTODateTimeFormat
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
     * 사용 여부
     */
    private String usedYn = MokaConstants.YES;
    /**
     * 상태
     */
    private EditStatusCode status;
    /**
     * 필드 그룹 목록
     */
    @JacksonXmlElementWrapper(localName = "fieldGroups")
    @JacksonXmlProperty(localName = "fieldGroup")
    private List<FieldGroupDTO> fieldGroups;

}
