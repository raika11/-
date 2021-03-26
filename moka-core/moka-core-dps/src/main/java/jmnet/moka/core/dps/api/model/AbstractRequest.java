package jmnet.moka.core.dps.api.model;

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
public abstract class AbstractRequest implements Request {
    protected String type;
    protected boolean async;
    protected String resultName;

    public AbstractRequest(String type, boolean async, String resultName) {
        this.type = type;
        this.async = async;
        this.resultName = resultName;
    }

    @Override
    public String getType() {
        return this.type;
    }

    @Override
    public boolean getAsync() {
        return this.async;
    }

    @Override
    public String getResultName() {
        return this.resultName;
    }

    public String toString() {
        return String.join("/", this.type);
    }
}
