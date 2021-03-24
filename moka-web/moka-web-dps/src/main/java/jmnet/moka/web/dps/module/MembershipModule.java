package jmnet.moka.web.dps.module;

import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import jmnet.moka.web.dps.module.membership.MembershipHelper;
import org.springframework.beans.factory.annotation.Autowired;

public class MembershipModule implements ModuleInterface {

    private static final String MEMBERSHIP_COOKIE = "JAMemSSOInfo";

    @Autowired
    private MembershipHelper membershipHelper;
    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;

    private String[] names = {"loginTime", "memSeq", "loginSeq", "loginType", "memState", "loginYn"};

    public MembershipModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;
    }

    @Override
    public Object invoke(ApiContext apiContext) {
        return null;
    }

    public Object getCookieInfo(ApiContext apiContext)
            throws Exception {
        String membershipCookie = (String) apiContext
                .getCheckedParamMap()
                .get(MEMBERSHIP_COOKIE);
        if (membershipCookie == null) {
            throw new RuntimeException("Membership cookie is not exists");
        }
        return this.membershipHelper.decodeCookie(membershipCookie);
    }

    public Object getMemberInfo(ApiContext apiContext) {
        String membershipCookie = (String) apiContext
                .getCheckedParamMap()
                .get(MEMBERSHIP_COOKIE);
        if (membershipCookie == null) {
            throw new RuntimeException("Membership cookie is not exists");
        }
        return this.membershipHelper.getMemberInfo(membershipCookie);
    }
}
