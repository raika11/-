package jmnet.moka.core.tps.mvc.editform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 * 편집 폼 검색
 * Project : moka
 * Package : jmnet.moka.core.tps.common.dto
 * ClassName : EditFormDTO
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 07:36
 */
@JsonRootName("channelFormat")
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@ApiModel("편집폼 검색 DTO")
public class EditFormSearchDTO extends SearchDTO {

    public static final Type TYPE = new TypeReference<List<EditFormSearchDTO>>() {
    }.getType();

    @ApiModelProperty("폼 일련번호")
    private Long formSeq;

    @ApiModelProperty("폼 Part 일련번호")
    private Long partSeq;

    @ApiModelProperty("폼 ID")
    private String formId;

    @ApiModelProperty("등록일시")
    @DTODateTimeFormat
    private Date regDt;

    // 정렬 기본값을 설정
    public EditFormSearchDTO() {
        super("formSeq,desc");
    }


}
