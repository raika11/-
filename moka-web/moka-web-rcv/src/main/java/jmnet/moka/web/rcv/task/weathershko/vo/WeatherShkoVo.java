package jmnet.moka.web.rcv.task.weathershko.vo;

import java.util.List;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import jmnet.moka.web.rcv.task.weathershko.vo.sub.WeatherShkoAreaVo;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.newsweather
 * ClassName : WeatherShboVo
 * Created : 2020-12-14 014 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-14 014 오후 2:45
 */
@Getter
@Setter
@XmlRootElement(name = "weather")
public class WeatherShkoVo extends BasicVo {
    private static final long serialVersionUID = -3207178015058302579L;

    @XmlElement(name = "area")
    List<WeatherShkoAreaVo> areas;
}
