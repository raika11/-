package jmnet.moka.web.push.support;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.push.support
 * ClassName : PushSchedule
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 18:54
 */

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@SuperBuilder
@ToString
public class PushJob {
    /**
     * 스케줄명
     */
    protected String name;

    /**
     * 스케줄 클래스명
     */
    protected String className;

    /**
     * 푸시 Title
     */
    protected String pushTitle;
}
