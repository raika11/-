package jmnet.moka.web.rcv.task.weathershko.vo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.web.rcv.common.vo.TotalVo;
import jmnet.moka.web.rcv.task.weathershko.vo.sub.WeatherShkoAreaVo;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.newsweather.vo
 * ClassName : WeatherShboTotalVo
 * Created : 2020-12-14 014 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-14 014 오후 2:44
 */
@Getter
@Setter
@XmlRootElement(name = "weather")
@XmlAccessorType(XmlAccessType.FIELD)
public class WeatherShkoTotalVo extends TotalVo<WeatherShkoVo> {
    private static final long serialVersionUID = 240755541047879014L;

    public WeatherShkoTotalVo(WeatherShkoVo mainData) {
        super(mainData);
    }

    private WeatherShkoAreaVo curArea;
}
