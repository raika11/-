package jmnet.moka.web.rcv.task.weathershko.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.newsweather.vo.sub
 * ClassName : WeatherShboAreaVo
 * Created : 2020-12-14 014 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-14 014 오후 2:50
 */
@Getter
@Setter
@XmlRootElement(name = "area")
@XmlAccessorType(XmlAccessType.FIELD)
public class WeatherShkoAreaVo implements Serializable {
    private static final long serialVersionUID = 8464181500762829359L;

    @XmlElement(name = "areacode")
    private String areaCode;

    @XmlElement(name = "areaname")
    private String areaName;

    @XmlElement(name = "tm")
    private String tm;

    @XmlElement(name = "icon")
    private Integer icon;

    @XmlElement(name = "temp")
    private String temp;

    @XmlElement(name = "maxtemp")
    private String maxTemp;

    @XmlElement(name = "mintemp")
    private String minTemp;

    @XmlElement(name = "pm10Value")
    private Integer pm10Value;

    @XmlElement(name = "pm10Grade")
    private String pm10Grade;
}
