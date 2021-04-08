package jmnet.moka.web.bulk;

import jmnet.moka.web.bulk.config.MokaBulkConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@AutoConfigureBefore(MokaBulkConfiguration.class)
public class MokaBulkApplication {
	public static void main(String[] args) {
		SpringApplication.run(MokaBulkApplication.class, args);
	}
}
