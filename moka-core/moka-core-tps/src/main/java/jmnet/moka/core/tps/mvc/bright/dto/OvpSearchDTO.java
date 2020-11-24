package jmnet.moka.core.tps.mvc.bright.dto;

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
 * Package : jmnet.moka.core.tps.mvc.bright.dto
 * ClassName : OvpSearchDTO
 * Created : 2020-11-24 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-24 09:08
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class OvpSearchDTO extends SearchDTO {

    private String folderId;
}
