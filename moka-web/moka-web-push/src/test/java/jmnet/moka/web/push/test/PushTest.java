package jmnet.moka.web.push.test;

import java.util.ArrayList;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.push.dto.PushSendDTO;
import jmnet.moka.core.common.push.service.PushSendService;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * <pre>
 * 푸시 테스트
 * Project : moka
 * Package : jmnet.moka.web.push
 * ClassName : PushTest
 * Created : 2020-11-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-19 09:02
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Slf4j
public class PushTest {


    @Autowired
    private PushSendService pushSendService;

    /**
     * 푸시 테스트
     *
     * @throws Exception 예외 처리
     */
    @Test
    public void pushTest()
            throws Exception {

        List<Integer> appIds = new ArrayList<>();
        appIds.add(1);
        pushSendService.send(PushSendDTO
                .builder()
                .appSeq(appIds)
                .content("앱에서 답변 내용을 확인해 주세요.")
                .pushType(MokaConstants.PUSH_TYPE_BOARD_REPLY)
                .relContentId(283L)
                .title("질문에 답변이 등록되었습니다.")
                .build());
    }



}
