package jmnet.moka.web.wms;

import org.infinispan.spring.starter.embedded.InfinispanEmbeddedAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import jmnet.moka.common.cache.autoConfig.CacheAutoConfiguration;
import jmnet.moka.core.tms.autoConfig.TmsAutoConfiguration;
import jmnet.moka.core.tps.config.TpsAutoConfiguration;
import jmnet.moka.web.wms.config.ValidationConfiguration;
import jmnet.moka.web.wms.config.WebMvcConfiguration;

@SpringBootApplication(exclude = {TmsAutoConfiguration.class,
        InfinispanEmbeddedAutoConfiguration.class, CacheAutoConfiguration.class})
@AutoConfigureBefore(TpsAutoConfiguration.class)
@Import({ValidationConfiguration.class, WebMvcConfiguration.class})
public class WmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(WmsApplication.class, args);
    }

}
