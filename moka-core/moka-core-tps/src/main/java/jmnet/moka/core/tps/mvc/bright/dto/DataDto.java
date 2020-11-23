package jmnet.moka.core.tps.mvc.bright.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class DataDto {

    @NotNull(message = "{tps.bright.error.notnull.clientId}")
    private  String clientId;

    @NotNull(message = "{tps.bright.error.notnull.clientSecret}")
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
