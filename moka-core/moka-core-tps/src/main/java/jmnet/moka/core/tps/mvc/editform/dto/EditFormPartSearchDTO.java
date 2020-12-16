package jmnet.moka.core.tps.mvc.editform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 * 편집 폼 Part 검색
 * Project : moka
 * Package : jmnet.moka.core.tps.common.dto
 * ClassName : EditFormDTO
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 07:36
 */
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@ApiModel("편집폼 Part 검색 DTO")
public class EditFormPartSearchDTO extends SearchDTO {

    public static final Type TYPE = new TypeReference<List<EditFormPartSearchDTO>>() {
    }.getType();

    @ApiModelProperty("폼 일련번호")
    private Long formSeq;

    @ApiModelProperty("폼 Part 일련번호")
    private Long partSeq;

    // 정렬 기본값을 설정
    public EditFormPartSearchDTO() {
        super("partTitle,asc");
    }


}
