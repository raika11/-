package jmnet.moka.web.push.support.message;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.push.support.code.FcmPriorityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * Fcm 푸시 메시지 spec
 * Project : moka
 * Package : jmnet.moka.web.push.support.message
 * ClassName : FcmMessage
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:32
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class FcmMessage {

    /**
     * 다중 수신자 최대 갯수 FCM 규약
     */
    public static final int MAX_REGISTRATION_IDS = 1000;

    /**
     * 수신자 기기토큰 또는 알림 키 또는 단일토픽(/topics/토픽) 다수의 수신은 registrationIds 사용 다수의 토픽은 condition을 사용
     */
    private String to;

    /**
     * 다수의 수신자 배열에 포함될 수 있는 등록 토큰 수는 1~1,000개
     */
    private List<String> registration_ids;

    /**
     * 다수의 토픽 조건 토픽 in topics. &amp;&amp;, || 지원
     */
    private String condition;

    /**
     * 메시지 축소 키. 온라인 또는 활성 상태가 되었을 때 동일한 메시지가 너무 많이 전송되는 것을 방지하기 위한 메시지. 지정한 기간에 최대 4개의 다른 축소 키가 허용.
     */
    private String collapseKey;

    /**
     * 우선순위 normal, high. iOS APN의 5, 10
     */
    private FcmPriorityType priority = FcmPriorityType.HIGH;

    /**
     * 앱 활성화 여부
     */
    private Boolean contentAvailable;

    /**
     * 알림 서비스 앱 확장 프로그램을 사용하여 알림의 내용을 수정 가능 여부 iOS 10 이상 지원. Android 등은 무시
     */
    private Boolean mutableContent;

    /**
     * (오프라인등으로) 미전송 받은 기기를 위해서 FCM에 메시지를 보관하는 시간 단위는 초 기본 4주. 최대 4주
     */
    private Integer timeToLive;

    /**
     * 애플리케이션의 패키지 이름 등록 토큰이 일치해야 메시지를 수신 가능
     */
    private String restrictedPackageName;

    /**
     * 개발자가 실제로 메시지를 보내지 않고도 요청을 테스트 기본 false
     */
    private Boolean dryRun;

    /**
     * 메시지 페이로드
     */
    private Map<String, String> data;

    /**
     * 알림 페이로드
     */
    private Notification notification;

}
