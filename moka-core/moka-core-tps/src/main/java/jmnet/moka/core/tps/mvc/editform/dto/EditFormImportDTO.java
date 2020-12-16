package jmnet.moka.core.tps.mvc.editform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 * 편집 폼
 * Project : moka
 * Package : jmnet.moka.core.tps.common.dto
 * ClassName : EditFormDTO
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 07:36
 */
@JsonRootName("editForm")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@ApiModel("편집폼 Import DTO")
public class EditFormImportDTO {

    @ApiModelProperty("폼 일련번호")
    private Long formSeq;

    @ApiModelProperty("폼 Part 일련번호")
    private Long partSeq;

    @ApiModelProperty("import file")
    @NotNull(message = "{tps.edit-form.error.notnull.file}")
    private MultipartFile file;

}
