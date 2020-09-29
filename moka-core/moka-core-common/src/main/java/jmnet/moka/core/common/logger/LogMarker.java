package jmnet.moka.core.common.logger;

import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

/**
 * <pre>
 *
 * 로그 파일을 분리하기 위한 logback marker 설정
 *
 * 2020. 9. 28. ince 최초생성
 * </pre>
 *
 * @since 2020. 9. 28. 오후 1:14:45
 * @author ince
 */
public class LogMarker {


	private static final String ACTION_MARKER_NAME = "ACTION";
    private static final String USER_MARKER_NAME = "USER";



    // ACTION LOG MARKER
    public static final Marker ACTION = MarkerFactory.getMarker(ACTION_MARKER_NAME);

    // USER LOG MARKER
    public static final Marker USER = MarkerFactory.getMarker(USER_MARKER_NAME);


    /**
     * Multi 마커
     * @param markers logger Marker들
     * @return logger Marker
     */
    public static Marker getMarker(Marker... markers) {
        Marker output = new MultiMarker(markers);
        return output;
    }
}
