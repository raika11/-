package jmnet.moka.web.schedule.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;

/**
 * <pre>
 * 프로퍼티 정보 관리
 * 2017. 4. 21. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2017. 4. 21. 오후 3:11:57
 */
public class PropertyHolder {

    @Value("${schedule.action:true}")
    private boolean scheduleAction;

    /**
     * @return the scheduleAction
     */
    public boolean getScheduleAction() {
        return scheduleAction;
    }

    /**
     * 서버 환경 정보
     */
    @Autowired
    private Environment environment;


    /**
     * <pre>
     * 서버 환경 정보에서 현재 운영중인 profile 정보 조회
     * </pre>
     *
     * @return profile
     */
    public final String getProfile() {
        if (environment == null) {
            return Profiles.LOCAL;
        }
        String[] profiles = environment.getActiveProfiles();
        if (profiles.length > 0) {
            return profiles[0];
        }
        return Profiles.LOCAL;
    }


    /**
     * <pre>
     * Profiles
     * 2017. 4. 25. ince 최초생성
     * </pre>
     *
     * @author ince
     * @since 2017. 4. 25. 오후 12:33:27
     */
    public static final class Profiles {
        public static final String LOCAL = "";

        public static final String STG = "stg";

        public static final String PRODUCTION = "prod";

        public static final String SKIP = "local";

        public static final String NONE = "none";

        public static boolean isLocal(String profile) {
            return LOCAL.equals(profile);
        }

        public static boolean isStg(String profile) {
            return STG.equals(profile);
        }

        public static boolean isProd(String profile) {
            return PRODUCTION.equals(profile);
        }
    }

}
