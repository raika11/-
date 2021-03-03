package jmnet.moka.web.schedule.mvc.reserve.dto;

import java.util.Date;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import jmnet.moka.core.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.reserve.dto
 * ClassName : ReserveJobDTO
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:36
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class ReserveJobDTO {

    @NotEmpty
    private String jobCd;

    @NotEmpty
    private String jobTaskId;

    private String paramDesc;

    @NotNull
    @DTODateTimeFormat
    private Date reserveDt;
}
