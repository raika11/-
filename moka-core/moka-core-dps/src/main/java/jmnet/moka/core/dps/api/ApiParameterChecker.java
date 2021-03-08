package jmnet.moka.core.dps.api;

import java.text.ParseException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.api.model.DefaultApiConfig;
import jmnet.moka.core.dps.api.model.Parameter;
import jmnet.moka.core.dps.excepton.ParameterException;
import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JexlEngine;
import org.apache.commons.jexl3.JexlScript;
import org.apache.commons.jexl3.MapContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class ApiParameterChecker {

    private static final Logger logger = LoggerFactory.getLogger(ApiParameterChecker.class);
    public final static JexlBuilder jexlb = new JexlBuilder();
    public final static JexlEngine jexl = jexlb.create();
    private HashMap<String, JexlScript> scriptMap = new HashMap<String, JexlScript>(256);
    private ApiRequestHelper apiRequestHelper;

    @Autowired
    public ApiParameterChecker(ApiRequestHelper apiRequestHelper) {
        this.apiRequestHelper = apiRequestHelper;
    }

    public boolean validateParameter(Api api, Parameter parameter, String paramValue)
            throws ParameterException {
        String checkValue = paramValue;
        if (McpString.isEmpty(paramValue)) {
            if (parameter.isRequire() && McpString.isEmpty(parameter.getDefaultValueStr())) {
                throw new ParameterException(String.format("Parameter %s is required", parameter.getName()), api);
            }
            checkValue = parameter.getDefaultValueStr();
        }

        if (McpString.isNotEmpty(parameter.getFilter())) {
            if (McpString.isEmpty(checkValue)) {
                if (parameter.isRequire()) { //필수 파라미터면 false, 그렇지 않으면 true 
                    return false;
                } else {
                    return true;
                }
            } else {
                return checkValue.matches(parameter.getFilter());
            }
        }
        return false;
    }

    public Object decideParameter(Api api, Parameter parameter, String paramValue)
            throws ParameterException {
        if (McpString.isEmpty(paramValue)) {
            if (parameter.getDefaultValue() != null) {
                return parameter.getDefaultValue();
            } else if (parameter.isRequire()) {
                throw new ParameterException(String.format("Parameter is required,but default & paramerer value not found : [%s] [%s] [%s] [%s] [%s]",
                        api
                                .getApiConfig()
                                .getPath(), api.getId(), parameter.getName(), parameter.getDefaultValue(), parameter.getFilter()), api);
            } else {
                if (parameter
                        .getType()
                        .equals(ApiParser.PARAM_TYPE_NUMBER) || parameter
                        .getType()
                        .equals(ApiParser.PARAM_TYPE_DATE)) {
                    return null;
                }
            }
        } else {
            if (parameter
                    .getType()
                    .equals(ApiParser.PARAM_TYPE_NUMBER)) {
                return Integer.parseInt(paramValue);
            } else if (parameter
                    .getType()
                    .equals(ApiParser.PARAM_TYPE_DATE)) {
                try {
                    return MokaConstants
                            .jsonDateFormat()
                            .parse(paramValue);
                } catch (ParseException e) {
                    // 날짜 형식에 맞지 않으면 null을 반환한다.
                    return null;
                }
            }
        }
        return paramValue;
    }

    public Map<String, Object> checkKeyParameter(Api api, Map<String, String> parameterMap)
            throws ParameterException {
        DefaultApiConfig defaultApiConfig = this.apiRequestHelper.getDefaultApiConfig(api
                .getApiConfig()
                .getPath());
        Map<String, Object> checkedParamMap = new LinkedHashMap<String, Object>(16);
        Map<String, Parameter> apiParameterMap = api.getParameterMap();
        for (String key : api.getKeyList()) {
            Parameter parameter = apiParameterMap.get(key);
            if (parameterMap.containsKey(key)) {
                Object value = parameterMap.get(key);
                if (parameter
                        .getType()
                        .equals(ApiParser.PARAM_TYPE_NUMBER)) {
                    try {
                        value = Integer.parseInt(parameterMap.get(key));
                    } catch (NumberFormatException e) {
                        throw new ParameterException(String.format("Cache Key Parameter is not number : %s %s %s %", api
                                .getApiConfig()
                                .getPath(), api.getId(), key, value), api);
                    }
                } else if (parameter
                        .getType()
                        .equals(ApiParser.PARAM_TYPE_DATE)) {
                    try {
                        value = MokaConstants
                                .jsonDateFormat()
                                .parse(parameterMap.get(key));
                    } catch (ParseException e) {
                        throw new ParameterException(String.format("Cache Key Parameter is not Date : %s %s %s %", api
                                .getApiConfig()
                                .getPath(), api.getId(), key, value), api);
                    }
                }
                checkedParamMap.put(key, value);
            } else if (defaultApiConfig != null && defaultApiConfig.getDefaultParameter(key) != null) {
                parameter = defaultApiConfig.getDefaultParameter(key);
                checkedParamMap.put(key, parameter.getDefaultValue());
            } else {
                throw new ParameterException(String.format("Cache Key Parameter is not found : %s %s %s", api
                        .getApiConfig()
                        .getPath(), api.getId(), key), api);
            }
        }
        return checkedParamMap;
    }

    public Map<String, Object> checkParameter(Api api, Map<String, String> parameterValueMap)
            throws ParameterException {
        Map<String, Object> checkedParamMap = new LinkedHashMap<String, Object>(16);
        for (Parameter parameter : api
                .getParameterMap()
                .values()) {
            String parameterName = parameter.getName();
            String parameterValue = parameterValueMap.get(parameterName);
            if (McpString.isNotEmpty(parameter.getEvalStr())) { // eval인 경우
                Object result = this.evaluate(api, parameter, checkedParamMap);
                checkedParamMap.put(parameterName, result);
            } else {
                if (validateParameter(api, parameter, parameterValue)) {
                    checkedParamMap.put(parameterName, decideParameter(api, parameter, parameterValue));
                } else {
                    throw new ParameterException(String.format("Parameter Filtered : [%s] [%s] [%s] [%s] [%s]", api
                            .getApiConfig()
                            .getPath(), api.getId(), parameterName, parameterValue, parameter.getFilter()), api);
                }
            }
        }
        // default 값이 설정되지 않는 경우를 기본 값을 넣어 준다.
        DefaultApiConfig defaultApiConfig = this.apiRequestHelper.getDefaultApiConfig(api
                .getApiConfig()
                .getPath());
        if (defaultApiConfig != null) {
            setDefaultParameter(api, defaultApiConfig, parameterValueMap, checkedParamMap);
        } else {
            logger.warn("DefaultApiConfig Not Found:{}", api
                    .getApiConfig()
                    .getPath());
        }
        return checkedParamMap;
    }

    private void setDefaultParameter(Api api, DefaultApiConfig defaultApiConfig, Map<String, String> parameterValueMap,
            Map<String, Object> checkedParamMap)
            throws ParameterException {

        for (Parameter parameter : defaultApiConfig.getDefaultValueParameterList()) {
            String parameterName = parameter.getName();
            String parameterValue = parameterValueMap.get(parameterName);
            if (checkedParamMap.containsKey(parameterName) == false) {
                if (parameterValueMap.containsKey(parameterName)) {
                    // api에 설정되지 않은 기본 파라미터에 요청한 값을 설정한다.
                    if (validateParameter(api, parameter, parameterValue)) {
                        checkedParamMap.put(parameterName, decideParameter(api, parameter, parameterValue));
                    } else {
                        throw new ParameterException(String.format("Default Parameter Filtered : [%s] [%s] [%s] [%s] [%s]", api
                                .getApiConfig()
                                .getPath(), api.getId(), parameterName, parameterValue, parameter.getFilter()), api);
                    }
                } else {
                    if (McpString.isNotEmpty(parameter.getEvalStr())) { // eval인 경우
                        checkedParamMap.put(parameterName, this.evaluate(api, parameter, checkedParamMap));
                    } else {
                        checkedParamMap.put(parameter.getName(), parameter.getDefaultValue());
                    }
                }
            }
        }
    }

    private Object evaluate(Api api, Parameter parameter, Map<String, Object> checkedParamMap)
            throws ParameterException {
        Object result = null;
        String jsKey = api
                .getApiConfig()
                .getPath() + "_" + api.getId() + "_" + parameter.getName();
        JexlScript js = this.scriptMap.get(jsKey);
        try {
            if (js == null) {
                js = jexl.createScript(parameter.getEvalStr());
                this.scriptMap.put(jsKey, js);
            }
            result = js.execute(new MapContext(checkedParamMap));
        } catch (Exception e) {
            throw new ParameterException(String.format("Parameter evaluate Fail : %s %s %s %s", api
                    .getApiConfig()
                    .getPath(), api.getId(), parameter.getName(), parameter.getEvalStr()), api, e);
        }
        return result;
    }
}
