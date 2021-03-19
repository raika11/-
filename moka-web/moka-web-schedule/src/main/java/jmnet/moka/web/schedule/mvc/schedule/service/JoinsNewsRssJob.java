package jmnet.moka.web.schedule.mvc.schedule.service;

import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.schedule.mvc.mybatis.dto.JoinsNewsRssDTO;
import jmnet.moka.web.schedule.mvc.mybatis.mapper.JoinsNewsRssJobMapper;
import jmnet.moka.web.schedule.mvc.mybatis.vo.JoinsNewsVO;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * joins 뉴스정보를 조회하여 rss 파일로 FTP 업로드
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : JoinsNewsRssJob
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-17
 */
@Slf4j
@Component
public class JoinsNewsRssJob extends AbstractScheduleJob {

    @Autowired
    private JoinsNewsRssJobMapper joinsNewsRssJobMapper;

    @Override
    public void invoke() {
        //전체 조회
        String ctg = "-1";

        try {

            log.debug("param : {}", scheduleInfo.getPkgOpt());
            if (McpString.isNotEmpty(scheduleInfo.getPkgOpt())) {
                JSONObject jsonParam = (JSONObject) new JSONParser().parse(scheduleInfo.getPkgOpt());
                ctg = McpString.defaultValue((String) jsonParam.get("ctg"));
            }
            log.debug("ctg : {}", ctg);
            JoinsNewsRssDTO dto = new JoinsNewsRssDTO();
            dto.setPiCtgId(ctg);

            List<JoinsNewsVO> list = joinsNewsRssJobMapper.findAll(dto);
            for (JoinsNewsVO vo : list) {
                log.debug("vo : {} : {}", vo.getTotalId(), vo.getArticleTitle());
            }



            StringBuffer stringBuffer = new StringBuffer();

            //boolean success = stringFileUpload(stringBuffer.toString());
            //AbstractSchduleJob.finish() 에서 필요한 schedule 실행 결과 값 입력
            //임시로 성공/실패만 입력 + 그외 입력값은 입력정의 필요
            //setFinish(success);

        } catch (Exception ex) {
            log.error(ex.toString());
        }
    }
}
