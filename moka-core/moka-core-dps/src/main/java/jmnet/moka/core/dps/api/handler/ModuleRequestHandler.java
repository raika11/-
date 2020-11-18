package jmnet.moka.core.dps.api.handler;

import java.lang.reflect.Method;
import java.util.HashMap;
import jmnet.moka.common.utils.McpString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.support.GenericApplicationContext;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.api.model.ModuleRequest;

public class ModuleRequestHandler implements RequestHandler {
    public final static Logger logger = LoggerFactory.getLogger(ModuleRequestHandler.class);
    public final static String INVOKE_METHOD = "invoke";
    @Autowired
    private ApiRequestHandler apiRequestHandler;

    @Autowired
    private ApiRequestHelper apiRequestHelper;

    private GenericApplicationContext appContext;

    private HashMap<String, ModuleInterface> moduleMap = new HashMap<String, ModuleInterface>(16);

    @Autowired
    public ModuleRequestHandler(GenericApplicationContext appContext) {
        this.appContext = appContext;
    }

    @Override
    public ApiResult processRequest(ApiContext apiContext) {
        long startTime = System.currentTimeMillis();
        ModuleRequest moduleRequest = (ModuleRequest) apiContext.getCurrentRequest();
        try {
            ModuleInterface module = getModule(moduleRequest);
            Object result = callMethod(module, moduleRequest, apiContext);
            long endTime = System.currentTimeMillis();
            return ApiResult.createApiResult(startTime, endTime, result, true, null);
        } catch (Exception e) {
            logger.error("Module invoke Failed:",e);
            return ApiResult.createApiErrorResult(
                    String.format("Module invoke Failed: %s", moduleRequest.getClass().getName()),
                    e);

        }
    }

    private Object callMethod(ModuleInterface module, ModuleRequest moduleRequest, ApiContext apiContext)
            throws Exception {
        String methodName = moduleRequest.getMethodName();
        if (McpString.isEmpty(methodName) || methodName.equals(INVOKE_METHOD)) {
            return module.invoke(apiContext, apiRequestHandler, apiRequestHelper);
        } else {
            Method method = module.getClass().getMethod(methodName,ApiContext.class,ApiRequestHandler.class,ApiRequestHelper.class);
            return method.invoke(module, apiContext,apiRequestHandler,apiRequestHelper);
        }
    }

    @Override
    public void processAsyncRequest(AsyncRequestContext asyncRequestContext) {
        // TODO Auto-generated method stub
    }


    private ModuleInterface getModule(ModuleRequest moduleRequest) throws ClassNotFoundException {
        String className = moduleRequest.getClassName();
        if (this.moduleMap.containsKey(className)) {
            return this.moduleMap.get(className);
        }
        ModuleInterface module = null;
        synchronized (this) {
            // 선행 thread에 의해서 생성된 경우 생성된 module을 반환한다.
            if (this.moduleMap.containsKey(className)) {
                return this.moduleMap.get(className);
            }
            Class<?> moduleClass = Class.forName(moduleRequest.getClassName());
            appContext.registerBean(moduleClass.getName(), moduleClass, (beanDefinition) -> {
                beanDefinition.setScope(ConfigurableBeanFactory.SCOPE_SINGLETON);
            });
            module = (ModuleInterface) appContext.getBean(moduleClass);
            this.moduleMap.put(className, module);
        }
        return module;
    }
}
