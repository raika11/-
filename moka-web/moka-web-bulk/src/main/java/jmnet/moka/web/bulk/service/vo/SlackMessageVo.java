package jmnet.moka.web.bulk.service.vo;

import java.util.Date;
import lombok.AllArgsConstructor;
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
@AllArgsConstructor
public class SlackMessageVo {
    private final Date date;
    private final String title;
    private final String message;
}
