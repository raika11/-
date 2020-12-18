package jmnet.moka.core.tms.mvc.handler;

import java.lang.reflect.Method;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.tms.merge.MokaFunctions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mobile.device.Device;
import org.springframework.mobile.device.DeviceResolver;
import org.springframework.web.method.HandlerMethod;

/**
 *
 */
public abstract class AbstractHandler {
    protected final static String HANDLER_METHOD_NAME = "merge";
    protected final static MokaFunctions MOKA_FUNCTIONS = new MokaFunctions();
    protected String viewName;
    protected HandlerMethod handlerMethod;
    public enum DeviceType {
        MOBILE("mobile"), TABLET("tablet"), NORMAL("normal"), UNKNOWN("unknown");
        private final String code;
        public String getCode(){
            return this.code;
        }
        private DeviceType(String code) {
            this.code = code;
        }
    }

    @Autowired
    private DeviceResolver deviceResolver;

    public void setViewName(String viewName) {
        this.viewName = viewName;
    }

    /**
     * Handler의 Method를 찾는다.
     * @param claz 클래스
     * @return 메소드
     */
    protected Method findMethod(Class<?> claz) {
        Method[] methods = claz.getMethods();
        Method resultMethod = null;
        // 프로퍼티에 설정된 메소드를 찾아 HandlerMethod로 반환한다.
        for (Method method : methods) {
            if (method.getName()
                      .equals(HANDLER_METHOD_NAME)) {
                resultMethod = method;
                break;
            }
        }
        return resultMethod;
    }

    /**
     * URL의 처리가 가능한지 여부를 반환한다.
     * @param request http 요청
     * @param requestPath 요청 경로
     * @param pathList 경로 목록
     * @param domainId 도메인 id
     * @return 처리 메소드
     * @throws Exception 예외
     */
    public abstract HandlerMethod resolvable(HttpServletRequest request, String requestPath, List<String> pathList, String domainId) throws Exception;


    public void setDeviceType(HttpServletRequest request, MergeContext mergeContext) {
        if ( deviceResolver != null ) {
//            Device device = DeviceUtils.getCurrentDevice(request);
            Device device = deviceResolver.resolveDevice(request);
            if (device.isMobile()) {
                mergeContext.set("device", DeviceType.MOBILE.getCode());
            } else if (device.isTablet()) {
                mergeContext.set("device", DeviceType.TABLET.getCode());
            } else {
                mergeContext.set("device", DeviceType.NORMAL.getCode());
            }
        } else {
            mergeContext.set("device", DeviceType.UNKNOWN.getCode());
        }
    }
}
