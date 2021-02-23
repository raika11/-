package jmnet.moka.web.push.support.sender;

import jmnet.moka.web.push.support.PushJob;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
public class PushSenderJob extends PushJob {
    private int tokenCnt = 1000;
    private int threadPoolCnt = 10;
}
