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
import jmnet.moka.web.push.mvc.sender.entity.PushApp;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.mvc.sender.service.PushContentsService;
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
 * Package : jmnet.moka.web.push.support.sender
 * ClassName : PushSenderHandler
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
    private final String RESOURCE_PATH = ".json";

    @Autowired
    public Executor pushSendJobTaskExecutor;

    private final PropertyHolder propertyHolder;

    private Map<String, Sender> scheduleMap;

    private final PushContentsService pushContentsService;

    public PushSenderHandler(PropertyHolder propertyHolder, Map<String, Sender> scheduleMap, PushContentsService pushContentsService) {
        this.propertyHolder = propertyHolder;
        this.scheduleMap = scheduleMap;
        this.pushContentsService = pushContentsService;
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
    public boolean addPushJob(PushContents pushItem) {
        boolean result = false;

        String pushType = pushItem.getPushType();
        System.out.println("==========================================");
        System.out.println("getPushType="+pushItem.getPushType());

        if(pushType.equals("T")){   pushItem.setPushType("senderT");    }
        if(pushType.equals("S")){   pushItem.setPushType("senderS");    }
        if(pushType.equals("R")){   pushItem.setPushType("senderR");    }
        if(pushType.equals("N")){   pushItem.setPushType("senderN");    }

        if (scheduleMap.containsKey(pushItem.getPushType())) {// 작업 유형 존재할 경우 실행
            System.out.println("getContentSeq   ="+pushItem.getContentSeq());
            System.out.println("getRsvDt        ="+pushItem.getRsvDt());
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
     * @param pushContents 작업 일련번호
     */
    public boolean removeReservePushJob(PushContents pushContents) throws Exception {

        // TODO 1. 예약 작업 테이블에 del_yn을 'N'으로 변경

        try {
            PushContents returnValue = pushContentsService.saveDelYn(pushContents);
            log.debug("[SUCCESS TO INSERT PUSH CONTENTS]");
        } catch (Exception e) {
            log.error("[FAIL TO INSERT PUSH CONTENTS]", e);
            throw new Exception("예약 작업 테이블에 del_yn 변경이 되지 않았습니다.", e);
        }




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
