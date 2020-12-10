package jmnet.moka.web.wms.config.security;

import jmnet.moka.web.wms.config.security.groupware.SoapWebServiceGatewaySupport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.common.soap
 * ClassName : SoapConfiguration
 * Created : 2020-12-10 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-10 09:42
 */
@Configuration
public class GroupWareConfiguration {

    @Value("${groupware.service-id}")
    private String serviceId;

    @Bean
    public Jaxb2Marshaller marshaller() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setContextPath("jmnet.moka.web.wms.config.security.groupware.webservice");
        return marshaller;
    }

    @Bean
    public SoapWebServiceGatewaySupport groupWareAuthClient(Jaxb2Marshaller marshaller) {
        SoapWebServiceGatewaySupport client = new SoapWebServiceGatewaySupport(serviceId);
        client.setDefaultUri("https://ep.joins.net/webSite/mobile/controls/MobileWebServiceExternal_JBO.asmx");
        client.setMarshaller(marshaller);
        client.setUnmarshaller(marshaller);
        return client;
    }



}
