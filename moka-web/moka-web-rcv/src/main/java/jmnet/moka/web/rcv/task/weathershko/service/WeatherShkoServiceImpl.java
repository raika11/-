package jmnet.moka.web.rcv.task.weathershko.service;

import jmnet.moka.web.rcv.mapper.moka.WeatherShkoMapper;
import jmnet.moka.web.rcv.task.weathershko.vo.WeatherShkoTotalVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.weathershko.service
 * ClassName : WeatherShkoServiceImpl
 * Created : 2020-12-14 014 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-14 014 오후 3:51
 */
@Service
@Slf4j
public class WeatherShkoServiceImpl implements WeatherShkoService {
    private final WeatherShkoMapper weatherShkoMapper;

    public WeatherShkoServiceImpl(WeatherShkoMapper weatherShkoMapper) {
        this.weatherShkoMapper = weatherShkoMapper;
    }

    @Override
    public void insertRegionKweather(WeatherShkoTotalVo weatherShkoTotal) {
        this.weatherShkoMapper.callUsp15ReRegionKweatherIns(weatherShkoTotal);
    }
}
