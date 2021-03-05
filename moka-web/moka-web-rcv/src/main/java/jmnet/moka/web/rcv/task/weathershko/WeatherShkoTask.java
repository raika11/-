package jmnet.moka.web.rcv.task.weathershko;

import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.weathershko.service.WeatherShkoService;
import jmnet.moka.web.rcv.task.weathershko.vo.WeatherShkoTotalVo;
import jmnet.moka.web.rcv.task.weathershko.vo.WeatherShkoVo;
import jmnet.moka.web.rcv.task.weathershko.vo.sub.WeatherShkoAreaVo;
import jmnet.moka.web.rcv.taskinput.FileXmlTaskInput;
import jmnet.moka.web.rcv.taskinput.FileXmlTaskInputData;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.weathershbo
 * ClassName : NewsWeatherTask
 * Created : 2020-12-14 014 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-14 014 오전 9:51
 */
@Slf4j
public class WeatherShkoTask extends Task<FileXmlTaskInputData<WeatherShkoTotalVo, WeatherShkoVo>> {
    public WeatherShkoTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        return new FileXmlTaskInput<>( WeatherShkoTotalVo.class, WeatherShkoVo.class);
    }

    @Override
    protected boolean doVerifyData(FileXmlTaskInputData<WeatherShkoTotalVo, WeatherShkoVo> taskInputData) {
        final WeatherShkoTotalVo weatherShkoTotal = taskInputData.getTotalData();
        if (weatherShkoTotal == null) {
            log.error("{} 파일 [{}] XML 파싱 에러, WeatherShkoTotalVo를 생성할 수 없습니다.", getTaskName(), taskInputData.getFile());
            return false;
        }
        final WeatherShkoVo weatherShko = weatherShkoTotal.getMainData();
        if( weatherShko == null ){
            log.error("{} 파일 [{}] XML 파싱 에러, weatherShkoVo를 생성할 수 없습니다.", getTaskName(), taskInputData.getFile());
            return false;
        }
        if( weatherShko.getAreas() == null || weatherShko.getAreas().size() == 0 ){
            log.error("{} 파일 [{}] XML 파싱 에러, 처리할 데이터가 없습니다.", getTaskName(), taskInputData.getFile());
            return false;
        }
        return true;
    }

    @Override
    public void doProcess(FileXmlTaskInputData<WeatherShkoTotalVo, WeatherShkoVo> taskInputData)
            throws RcvDataAccessException {
        final WeatherShkoTotalVo weatherShkoTotal = taskInputData.getTotalData();
        final WeatherShkoVo weatherShko = weatherShkoTotal.getMainData();

        final WeatherShkoService weatherShkoService = getTaskManager().getWeatherShkoService();

        log.info("{} 파일 [{}] 작업 시작", getTaskName(), taskInputData.getFile());

        for(WeatherShkoAreaVo area : weatherShko.getAreas()){
            weatherShkoTotal.setCurArea(area);
            weatherShkoService.insertRegionKweather(weatherShkoTotal);
            log.info( "  {} Area {}({}) Insert", getTaskName(), area.getAreaName(), area.getAreaCode());
        }

        log.info("{} 파일 [{}] 작업 완료", getTaskName(), taskInputData.getFile());

        taskInputData.setSuccess(true);
    }

    @Override
    protected void doAfterProcess(FileXmlTaskInputData<WeatherShkoTotalVo, WeatherShkoVo> taskInputData)
            throws RcvDataAccessException, InterruptedException {
        super.doAfterProcess(taskInputData);

        taskInputData.doAfterProcess();
    }
}
