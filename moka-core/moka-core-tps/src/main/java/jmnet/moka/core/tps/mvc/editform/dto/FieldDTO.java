package jmnet.moka.core.tps.mvc.editform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 편집 필드
 * Project : moka
 * Package : jmnet.moka.core.tps.common.dto.edit
 * ClassName : FieldDTO
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 08:26
 */
@JsonRootName("field")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class FieldDTO {


    /**
     * Field ID
     */
    @JacksonXmlProperty(isAttribute = true)
    private String name;


    /**
     * Widget 유형 TEXT,IMAGE,LINK,CONTENT,SELECT,SEPERATOR
     */
    @JacksonXmlProperty(isAttribute = true)
    private String type;

    /**
     * 필드명
     */
    @JacksonXmlProperty(isAttribute = true)
    private String title;

    /**
     * 그룹번호
     */
    @JacksonXmlProperty(isAttribute = true)
    private Integer group;

    /**
     * 그룹 내 표시 순번 값 없을 경우 default는 Integer 최대값
     */
    @JacksonXmlProperty(isAttribute = true)
    private Integer sequence = 1;

    /**
     * 추가 버튼 표시 여부 기본값은 no
     */
    @JacksonXmlProperty(isAttribute = true)
    private String insert = "no";
    /**
     * 삭제 버튼 표시 여부 기본값은 no
     */
    @JacksonXmlProperty(isAttribute = true)
    private String delete = "no";
    /**
     * 검색 버튼 표시 여부 기본값은 no
     */
    @JacksonXmlProperty(isAttribute = true)
    private String search = "no";
    /**
     * 이동 버튼 표시 여부 기본값은 no
     */
    @JacksonXmlProperty(isAttribute = true)
    private String move = "no";

    /**
     * Widget의 value 기본값은 no, type이 SELECT일때 항목을 '^'로 구분하고 텍스트와값은 '|'로 구분
     */
    @JacksonXmlProperty(isAttribute = true)
    private String value = "";


    /**
     * type이 SELECT일때 값 목록
     */
    @JacksonXmlElementWrapper(localName = "options")
    @JacksonXmlProperty(localName = "option")
    private Set<OptionDTO> options;
}
