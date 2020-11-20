package jmnet.moka.core.tps.mvc.bright.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Response {
    private jmnet.moka.core.tps.mvc.bright.dto.data data;
    private Map<String, String> headers;

    public jmnet.moka.core.tps.mvc.bright.dto.data getData() {
        return data;
    }

    public void setData(jmnet.moka.core.tps.mvc.bright.dto.data data) {
        this.data = data;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<String, String> headers) {
        this.headers = headers;
    }
}
