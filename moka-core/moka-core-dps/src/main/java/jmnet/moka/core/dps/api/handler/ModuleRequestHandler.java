package jmnet.moka.core.dps.api.handler;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.proxy.autoConfig.HttpProxyConfiguration;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.api.model.ModuleRequest;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.support.GenericApplicationContext;

public class ModuleRequestHandler implements RequestHandler {
    public final static Logger logger = LoggerFactory.getLogger(ModuleRequestHandler.class);
    public final static String INVOKE_METHOD = "invoke";
    @Autowired
    private ApiRequestHandler apiRequestHandler;

    @Autowired
    private ApiRequestHelper apiRequestHelper;

    private GenericApplicationContext appContext;

    private HashMap<String, ModuleInterface> moduleMap = new HashMap<String, ModuleInterface>(16);

    private HttpProxy httpProxy;

    @Autowired
    public ModuleRequestHandler(GenericApplicationContext appContext) {
        this.appContext = appContext;
    }

    public HttpProxy getHttpProxy() {
        if (this.httpProxy == null) {
            synchronized (this) {
                if (this.httpProxy != null) {
                    return this.httpProxy;
                }
                this.httpProxy = (HttpProxy) appContext.getBean(HttpProxyConfiguration.HTTP_PROXY);
            }
        }
        return this.httpProxy;
    }

    @Override
    public ApiResult processRequest(ApiContext apiContext) {
        long startTime = System.currentTimeMillis();
        ModuleRequest moduleRequest = (ModuleRequest) apiContext.getCurrentRequest();
        try {
            ModuleInterface module = getModule(moduleRequest.getClassName());
            Object result = callMethod(module, moduleRequest, apiContext);
            long endTime = System.currentTimeMillis();
            if (result instanceof ApiResult) {
                if (((ApiResult) result).containsKey(ApiResult.MAIN_DATA)) {
                    return (ApiResult) result;
                }
            }
            return ApiResult.createApiResult(startTime, endTime, result, true, null);
        } catch (InvocationTargetException ie) {
            logger.error("Module invoke Failed:", ie.getTargetException());
            return ApiResult.createApiErrorResult(String.format("Module invoke Failed: %s", moduleRequest
                    .getClass()
                    .getName()), (Exception) ie.getTargetException());
        } catch (Exception e) {
            logger.error("Module invoke Failed:", e);
            return ApiResult.createApiErrorResult(String.format("Module invoke Failed: %s", moduleRequest
                    .getClass()
                    .getName()), e);

        }
    }

    private Object callMethod(ModuleInterface module, ModuleRequest moduleRequest, ApiContext apiContext)
            throws Exception {
        String methodName = moduleRequest.getMethodName();
        if (McpString.isEmpty(methodName) || methodName.equals(INVOKE_METHOD)) {
            return module.invoke(apiContext);
        } else {
            Method method = module
                    .getClass()
                    .getMethod(methodName, ApiContext.class);
            return method.invoke(module, apiContext);
        }
    }

    @Override
    public void processAsyncRequest(AsyncRequestContext asyncRequestContext) {
        // TODO Auto-generated method stub
    }

    public ModuleInterface getModule(String className)
            throws ClassNotFoundException {
        if (this.moduleMap.containsKey(className)) {
            return this.moduleMap.get(className);
        }
        ModuleInterface module = null;
        synchronized (this) {
            // ?????? thread??? ????????? ????????? ?????? ????????? module??? ????????????.
            if (this.moduleMap.containsKey(className)) {
                return this.moduleMap.get(className);
            }
            Class<?> moduleClass = Class.forName(className);
            appContext.registerBean(moduleClass.getName(), moduleClass, (beanDefinition) -> {
                beanDefinition.setScope(ConfigurableBeanFactory.SCOPE_SINGLETON);
            });
            module = (ModuleInterface) appContext.getBean(moduleClass, this, apiRequestHandler, apiRequestHelper);
            this.moduleMap.put(className, module);
        }
        return module;
    }

    public GenericApplicationContext getApplicationContext() {
        return this.appContext;
    }
}
