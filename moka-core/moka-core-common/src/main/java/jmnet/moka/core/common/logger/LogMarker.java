package jmnet.moka.core.common.logger;

import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

public class LogMarker {

	
	private static final String ACTION_MARKER_NAME = "ACTION";
    private static final String SYSTEM_MARKER_NAME = "SYSTEM";
    private static final String USER_MARKER_NAME = "USER";



    // ACTION LOG MARKER
    public static final Marker ACTION = MarkerFactory.getMarker(ACTION_MARKER_NAME);

    // SYSTEM LOG MARKER
    public static final Marker SYSTEM = MarkerFactory.getMarker(SYSTEM_MARKER_NAME);

    // USER LOG MARKER
    public static final Marker USER = MarkerFactory.getMarker(USER_MARKER_NAME);



    public static Marker getMarker(Marker... markers) {
        Marker output = new MultiMarker(markers);
        return output;
    }
}
