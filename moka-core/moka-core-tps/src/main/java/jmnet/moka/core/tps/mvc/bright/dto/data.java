package jmnet.moka.core.tps.mvc.bright.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class data {
    private  String clientId;
    private  String clientSecret;

    private Map<String, String> info = new HashMap<>();

    public Map<String, String> getInfo() {
        return info;
    }

    public void setInfo(Map<String, String> info) {
        this.info = info;
    }

    public void addInfo(String key, String value) {
        this.info.put(key, value);
    }
}
