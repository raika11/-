package jmnet.moka.web.tms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// dps를 별도 서버로 구성함
// @SpringBootApplication(exclude={DpsApiAutoConfiguration.class,
// DpsSqlSessionAutoConfiguration.class})
@SpringBootApplication
public class MokaTmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(MokaTmsApplication.class, args);
	}

}
