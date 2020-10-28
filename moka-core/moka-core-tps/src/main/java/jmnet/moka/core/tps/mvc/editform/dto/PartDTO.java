package jmnet.moka.core.tps.mvc.editform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * <pre>
 * 채널(화면)의 부분 요소(영역)
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
@ToString
@EqualsAndHashCode
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class PartDTO {

    /**
     * 사용 여부
     */
    @JacksonXmlProperty(isAttribute = true)
    private String active = MokaConstants.YES;

    /**
     * 상태
     */
    @JacksonXmlProperty(isAttribute = true)
    private String status;

    /**
     * 작성자
     */
    @JacksonXmlProperty(isAttribute = true)
    private String user;

    /**
     * 수정일시
     */
    @JacksonXmlProperty(isAttribute = true, localName = "modifydate")
    private String modifyDate;

    /**
     * 예약일시
     */
    @JacksonXmlProperty(isAttribute = true, localName = "reservedate")
    private String reserveDate;

    /**
     * 아이디
     */
    private String id;

    /**
     * 화면 내 영역 명
     */
    private String title;

    /**
     * 필드 목록
     */
    @JacksonXmlElementWrapper(localName = "fields")
    private List<FieldDTO> fields;

    /**
     * 필드 그룹 목록
     */
    private List<FieldGroupDTO> fieldGroups;

    /**
     * output 목록
     */
    @JacksonXmlElementWrapper(localName = "outputlist")
    private List<OutputDTO> outputs;


}
