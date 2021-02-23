package jmnet.moka.web.push.mvc.sender.dto;

import jmnet.moka.common.data.support.SearchDTO;
import lombok.*;

/**
 * <pre>
 * 푸시 전송 앱 정보
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.dto
 * ClassName : PushAppSearchDTO
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
public class PushContentUsedYnSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 노출유무
     */
    private String usedYn;
}
