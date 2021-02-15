package jmnet.moka.web.push.support.scheduler;

import java.util.List;
import jmnet.moka.web.push.mvc.sender.dto.PushAppDTO;
import jmnet.moka.web.push.support.PushJob;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.push.support.scheduler
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
public class PushSchedulerJob extends PushJob {

    /**
     * 스케줄 주기
     */
    private String term;

    /**
     * 앱 목록
     */
    List<PushAppDTO> apps;

}
