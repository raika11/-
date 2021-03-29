package jmnet.moka.core.dps.api.model;

import jmnet.moka.core.dps.api.handler.ApiCallRequestHandler;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.dps.api.model
 * ClassName : ApiCallRequest
 * Created : 2021-03-26 kspark
 * </pre>
 *
 * @author kspark
 * @since 2021-03-26 오전 11:00
 */
public class ApiCallRequest extends AbstractRequest {

    private String apiPath;
    private String apiId;

    public ApiCallRequest(String type, boolean async, String resultName, String apiPath, String apiId) {
        super(type, async, resultName);
        this.apiPath = apiPath;
        this.apiId = apiId;
    }

    public String getApiPath() {
        return this.apiPath;
    }

    public String getApiId() {
        return this.apiId;
    }

    @Override
    public Class<?> getHandlerClass() {
        return ApiCallRequestHandler.class;
    }

    public String toString() {
        return String.join("/", this.type, this.apiPath, this.apiId);
    }
}
