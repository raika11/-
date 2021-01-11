package jmnet.moka.web.rcv.task.weathershko.service;

import jmnet.moka.web.rcv.task.weathershko.vo.WeatherShkoTotalVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.weathershko.service
 * ClassName : WeatherShkoService
 * Created : 2020-12-14 014 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-14 014 오후 3:50
 */
public interface WeatherShkoService {
    void insertRegionKweather( WeatherShkoTotalVo weatherShkoTotal );
}
