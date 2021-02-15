package jmnet.moka.web.push.mvc.sender.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * <pre>
 * 푸시 요청 정보
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.dto
 * ClassName : PushSendDTO
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
public class PushSendDTO {

    private Long jobSeq;

    private String pushType;

    @Builder.Default
    private List<PushAppDTO> pushApps = new ArrayList<>();

    @DateTimeFormat(pattern = MokaConstants.JSON_DATE_FORMAT)
    private Date reserveDt;
}
