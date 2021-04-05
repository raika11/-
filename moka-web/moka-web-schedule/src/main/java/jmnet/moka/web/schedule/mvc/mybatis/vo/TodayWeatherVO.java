package jmnet.moka.web.schedule.mvc.mybatis.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * TodayWeather 목록 조회용 VO
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.mybatis.vo
 * ClassName : TodayWeatherVO
 * </pre>
 *
 * @author 김정민
 * @since 2021-04-02
 */

@Alias("TodayWeatherVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class TodayWeatherVO {

    private String targetDate;

    private String regionCd;

    private String regionNm;

    private String curTemp;

    private String highTemp;

    private String lowTemp;

    private String weatherCd;

    private String weatherIconUrl;

    private String weatherSts;

    private String weatherStsEng;

    private String weatherStsChn;

    private String weatherStsJpn;

    private String dustVal;

    private String dustGrade;
}
