package jmnet.moka.web.wms;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import jmnet.moka.common.cache.autoConfig.CacheAutoConfiguration;
import jmnet.moka.core.tms.autoConfig.TmsAutoConfiguration;
import jmnet.moka.core.tps.config.TpsAutoConfiguration;
import jmnet.moka.web.wms.config.ValidationConfiguration;
import jmnet.moka.web.wms.config.WebMvcConfiguration;
import org.infinispan.spring.starter.embedded.InfinispanEmbeddedAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(exclude = {TmsAutoConfiguration.class, InfinispanEmbeddedAutoConfiguration.class, CacheAutoConfiguration.class})
@AutoConfigureBefore(TpsAutoConfiguration.class)
@Import({ValidationConfiguration.class, WebMvcConfiguration.class})
@EnableEncryptableProperties
@EnableJpaAuditing
public class MokaWmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(MokaWmsApplication.class, args);
    }

}
