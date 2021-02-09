package jmnet.moka.web.schedule.mvc.reserve.dto;

import java.util.Date;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

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

    private Long jobSeq;

    private String workType;

    @DateTimeFormat(pattern = MokaConstants.JSON_DATE_FORMAT)
    private Date reserveDt;
}
