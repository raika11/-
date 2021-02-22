package jmnet.moka.web.push.mvc.sender.dto;

import jmnet.moka.common.data.support.SearchDTO;
import lombok.*;

import java.io.Serializable;

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
public class PushRelContentIdSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 관련 콘텐트ID
     */
    private Long relContentId;
}
