package jmnet.moka.web.push.support.sender;

import jmnet.moka.web.push.support.PushJob;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.push.support.sender
 * ClassName : PushSenderJob
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 18:54
 */

@NoArgsConstructor
@Setter
@Getter
@SuperBuilder
@ToString
public class PushSenderJob extends PushJob {
    /**
     * 1회 fcm 발송 토큰 최대 건수
     */
    @Builder.Default
    Integer tokenCnt = 100;

    /**
     * 쓰레드 풀 생성 갯수
     */
    @Builder.Default
    Integer threadPoolCnt = 10;
}
