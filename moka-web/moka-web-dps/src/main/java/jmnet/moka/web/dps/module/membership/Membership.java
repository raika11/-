package jmnet.moka.web.dps.module.membership;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * <pre>
 *
 * Project : moka-web-bbs
 * Package : jmnet.moka.core.dps.api.membership
 * ClassName : Category
 * Created : 2020-11-13 kspark
 * </pre>
 *
 * @author kspark
 * @since 2020-11-13 오전 8:36
 */
//@NoArgsConstructor
//@AllArgsConstructor
//@Data
//@Builder
public class Membership extends HashMap {

    /* 공통 */
    //    private int memSeq; // 공통
    //    private String memState; // 공통

    /* api */
    //    private String memName;
    //    private String memMainEmail;
    //    private String memPhone;

    /**
     * cookie
     **/
    //    private int loginSeq;
    //    private String loginType;
    //    private long loginTime;
    //    private String loginYn;

    @JsonIgnore
    private final static String[] names = {"loginTime", "memSeq", "loginSeq", "loginType", "memState", "loginYn"};

    public static Membership getMembershipFromCookie(String decoded) {
        Map<String, String> valueMap = new HashMap<>();
        short count = 0;
        for (String value : decoded.split("\\|")) {
            valueMap.put(names[count++], value);
        }
        Membership membership = new Membership();
        membership.putAll(valueMap);
        membership.put("memSeq", Integer.parseInt(valueMap.get("memSeq")));
        membership.put("loginSeq", Integer.parseInt(valueMap.get("loginSeq")));
        membership.put("loginTime", new Date(Long.parseLong(valueMap.get("loginTime"))));
        return membership;
    }

    public static Membership getMembershipFromApi(Map valueMap) {
        Membership membership = new Membership();
        membership.putAll(valueMap);
        return membership;
    }
}
