package jmnet.moka.web.push.support.message;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * iOS용 FCM Message 추가 정보
 * Project : moka
 * Package : jmnet.moka.web.push.support.message
 * ClassName : Notification
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:33
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class Notification {

    /**
     * 제목
     */
    private String title;

    /**
     * 내용
     */
    private String body;

    private String icon;
    private String color;
    /**
     * 개별 푸시 알림음, 기본값 : default
     */
    private String sound = "default";
    private String tag;
    private String bodyLocKey;
    private List<String> bodyLocArgs;
    private String titleLocKey;
    private List<String> titleLocArgs;
    private String clickAction;

    // 안드로이드 전용
    private String androidChannelId;

    // iOS 전용
    private String subtitle;

    private int badge = 0;
}
