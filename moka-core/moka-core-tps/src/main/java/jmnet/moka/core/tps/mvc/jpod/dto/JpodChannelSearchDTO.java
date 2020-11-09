package jmnet.moka.core.tps.mvc.jpod.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.dto
 * ClassName : JpodChannelSearchDTO
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 13:42
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class JpodChannelSearchDTO extends SearchDTO {

    @Pattern(regexp = "[N|Y]{1}$", message = "{tps.common.error.pattern.usedYn}")
    private String usedYn;

    private Date startDt;

    private Date endDt;

}
