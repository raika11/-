package jmnet.moka.web.dps.mvc.menu.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 *
 * Project : moka-web-bbs
 * Package : jmnet.moka.web.dps.mvc.menu.model
 * ClassName : Url
 * Created : 2020-11-03 kspark
 * </pre>
 *
 * @author kspark
 * @since 2020-11-03 오전 10:51
 */

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Url {
    @JsonProperty("Path")
    private String path;

    @JsonProperty("RoutePath")
    private String routePath;
}
