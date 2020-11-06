package jmnet.moka.web.rcv;

import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@AutoConfigureBefore(MokaRcvConfiguration.class)
public class MokaRcvApplication {
    public static void main(String[] args) {
        SpringApplication.run(MokaRcvApplication.class, args);
    }
}
