package jmnet.moka.core.tps.mvc.page.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class ParentPageDTO implements Serializable {

    private static final long serialVersionUID = 4232007330201723143L;

    public static final Type TYPE = new TypeReference<List<ParentPageDTO>>() {}.getType();

    @Min(value = 0, message = "{tps.page.error.invalid.pageSeq}")
    private Long pageSeq;

    @NotNull(message = "{tps.page.error.invalid.pageName}")
    private String pageName;

    @NotNull(message = "{tps.page.error.invalid.pageUrl}")
    private String pageUrl;

}
