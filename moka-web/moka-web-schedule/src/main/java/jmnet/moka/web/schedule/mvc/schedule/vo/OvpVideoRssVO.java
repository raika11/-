package jmnet.moka.web.schedule.mvc.schedule.vo;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.vo
 * ClassName : OvpVideoRSS
 * Created : 2021-02-18 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-18 15:15
 */

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class OvpVideoRssVO {

    private Date pubDate;

    private Long size;

    private String container;

    private String id;

    private Long duration;

    private String description;

    private String sourceUrl;

    private String title;
}
