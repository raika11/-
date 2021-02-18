package jmnet.moka.web.push.support.sender;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.Executor;
import javax.annotation.PostConstruct;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.push.config.PropertyHolder;
import jmnet.moka.web.push.mvc.sender.entity.MobPushItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.AbstractEnvironment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * ReserveJobHandler
 * Project : moka
 * Package : jmnet.moka.web.push.support.reserve
 * ClassName : ReserveJobHandler
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 14:59
 */
@Component
@Slf4j
public class PushSenderHandler {


    @Autowired
    private ApplicationContext context;

    /**
     * 스케줄 설정 정보 파일
     */
    private final String RESOURCE_PATH = "sender-info.json";

    @Autowired
    public Executor pushSendJobTaskExecutor;

    private final PropertyHolder propertyHolder;

    private Map<String, Sender> scheduleMap;

    public PushSenderHandler(PropertyHolder propertyHolder, Map<String, Sender> scheduleMap) {
        this.propertyHolder = propertyHolder;
        this.scheduleMap = scheduleMap;
    }

    /**
     * 예약작업 초기화
     */
    @PostConstruct
    public void initPushSenderMap() {
        if (propertyHolder.getScheduleAction()) { // 스케줄 작업 실행 여부 체크

            String SPRING_PROFILES_ACTIVE = System.getProperty(AbstractEnvironment.ACTIVE_PROFILES_PROPERTY_NAME, "");
            String resourcePath =
                    McpString.isEmpty(SPRING_PROFILES_ACTIVE) ? RESOURCE_PATH : McpFile.addSuffix(RESOURCE_PATH, "-" + SPRING_PROFILES_ACTIVE);
            Resource resource = new ClassPathResource(resourcePath);
            try {
                File file = resource.getFile();
                if (file.exists()) {
                    TypeReference<Map<String, PushSenderJob>> typeRef = new TypeReference<>() {
                    };

                    Map<String, PushSenderJob> scheduleList = ResourceMapper
                            .getDefaultObjectMapper()
                            .readValue(file, typeRef);

                    scheduleList.forEach((s, pushSenderJob) -> {
                        try {
                            Sender job = (Sender) context.getBean(Class.forName(pushSenderJob.getClassName()));
                            pushSenderJob.setName(s);
                            job.init(pushSenderJob);
                            scheduleMap.put(s, job);
                        } catch (BeansException | ClassNotFoundException e) {
                            log.error(e.toString());
                        }
                    });
                }
            } catch (IOException io) {
                log.error("FtpHelper error => exception : {}", io.getMessage());
            }
        }
    }


    /**
     * 푸시 전송 작업 추가
     *
     * @param pushItem job 정보
     */
    public boolean addPushJob(MobPushItem pushItem) {
        boolean result = false;

        if (scheduleMap.containsKey(pushItem.getPushType())) {// 작업 유형 존재할 경우 실행
            pushSendJobTaskExecutor.execute(() -> scheduleMap
                    .get(pushItem.getPushType())
                    .doTask(pushItem));
            result = true;
        }
        return result;
    }

    /**
     * 예약 작업 제거
     *
     * @param pushSendJobProcSeq 작업 일련번호
     */
    public boolean removeReservePushJob(Long pushSendJobProcSeq) {

        // TODO 1. 예약 작업 테이블에 del_yn을 'N'으로 변경
        return false;
    }

    /**
     * 푸시타입 존재 여부 확인
     *
     * @param pushType 푸시 유형
     * @return 존재 여부
     */
    public boolean existPushType(String pushType) {
        return scheduleMap != null && scheduleMap.containsKey(pushType);
    }


}