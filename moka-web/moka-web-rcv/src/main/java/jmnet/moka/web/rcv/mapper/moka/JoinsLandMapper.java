package jmnet.moka.web.rcv.mapper.moka;

import jmnet.moka.web.rcv.task.joinsland.vo.JoinsLandArticleTotalVo;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.mapper.moka
 * ClassName : WeatherShkoMapper
 * Created : 2020-12-14 014 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-14 014 오후 3:36
 */
@Repository
@Mapper
public interface JoinsLandMapper {
    void callUspBulkJoinslandNewstableIns( JoinsLandArticleTotalVo articleTotal);
    void callUspBulkJoinslandNewsMMdataIns( JoinsLandArticleTotalVo articleTotal);
}
