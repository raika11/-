package jmnet.moka.core.tps.mvc.tour.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 견학 안내 메일 정보
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.tour.vo
 * ClassName : TourGuideMailVO
 * Created : 2021-02-26 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-26 11:16
 */
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TourGuideMailVO {

    // 이메일 제목
    private String emailTitle;

    // 이메일 본문
    private String emailBody;
}
