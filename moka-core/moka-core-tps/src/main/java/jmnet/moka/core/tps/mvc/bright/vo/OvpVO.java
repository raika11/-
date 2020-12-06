package jmnet.moka.core.tps.mvc.bright.vo;

import java.io.Serializable;
import java.util.Date;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bright.vo
 * ClassName : OvpVO
 * Created : 2020-11-24 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-24 09:09
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class OvpVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;

    private String thumbFileName;

    private String name;

    private String state;

    @DTODateTimeFormat
    private Date regDt;
}
