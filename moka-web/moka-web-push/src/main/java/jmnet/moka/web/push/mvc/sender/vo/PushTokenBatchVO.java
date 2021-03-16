package jmnet.moka.web.push.mvc.sender.vo;

import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.vo
 * ClassName : PushTokenBatchVO
 * Created : 2021-03-16 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-16 09:34
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class PushTokenBatchVO {

    /**
     * 토큰 일련번호 배열 형태 문자열
     */
    private String tokenSeqs;

    /**
     * 앱 일련번호
     */
    private int appSeq;

    /**
     * 푸시 컨텐츠 일련번호
     */
    private Long contentsSeq;

    /**
     * 전송 여부 N 전송전, Y 전송완료
     */
    @Builder.Default
    private String sendYn = MokaConstants.NO;
}
