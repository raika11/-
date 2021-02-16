package jmnet.moka.web.push.config;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RequestMethod;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfiguration {
    @Bean
/*    public Docket api(){
        return new Docket(DocumentationType.SWAGGER_2).select()
                .apis(Predicates.not(RequestHandlerSelectors.
                        basePackage("org.springframework.boot")))
                .paths(PathSelectors.any()).build();
    }*/

    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.any()) // 현재 RequestMapping으로 할당된 모든 URL 리스트를 추출
                .paths(PathSelectors.ant("/api/**")) // 그중 /api/** 인 URL들만 필터링
                .build()
                .apiInfo(metaData())
                .useDefaultResponseMessages(false)
                /*
                .globalOperationParameters(
                        Arrays.asList(new ParameterBuilder()
                                .name("Authorization")
                                .description("Description of header")
                                .modelRef(new ModelRef("string"))
                                .parameterType("header")
                                .required(false)
                                .build())
                )*/
                .globalResponseMessage(RequestMethod.GET, Arrays.asList(

                        new ResponseMessageBuilder()
                                .code(500)
                                .message("오류가 발생하였습니다.")
                                .responseModel(new ModelRef("Error"))
                                .build()

                ));// 운영서버 반영 시 해당 주석 풀어서 연동 가이드 숨기기.enable(false);
    }


    private ApiInfo metaData() {
        Contact contact = new Contact("서울시스템기술연구소", "http://www.ssc.co.kr", "");
        return new ApiInfo("moka push", "중앙일보 푸시 서버", "1.0", "", contact, "", "", ApiInfo.DEFAULT.getVendorExtensions());
    }
}
