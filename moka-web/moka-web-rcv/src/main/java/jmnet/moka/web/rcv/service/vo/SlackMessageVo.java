package jmnet.moka.web.rcv.service.vo;

import java.util.Date;
import jmnet.moka.web.rcv.util.RcvUtil;
import lombok.Getter;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.service.vo
 * ClassName : SlackMessageVo
 * Created : 2021-02-19 019 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-19 019 오후 5:26
 */
@Getter
public class SlackMessageVo {
    private final Date date;
    private final String title;
    private final String message;

    public SlackMessageVo(Date date, String title, String message) {
        this.date = RcvUtil.getDeepDate( date );
        this.title = title;
        this.message = message;
    }

    public Date getDate() {
        return RcvUtil.getDeepDate( this.date );
    }
}
