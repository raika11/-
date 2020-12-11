package jmnet.moka.web.wms.config.security;

import java.time.Duration;
import jmnet.moka.web.wms.config.security.groupware.SoapWebServiceGatewaySupport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.transport.WebServiceMessageSender;
import org.springframework.ws.transport.http.HttpUrlConnectionMessageSender;

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

    @Value("${groupware.service.id}")
    private String serviceId;

    @Value("${groupware.service.url}")
    private String serviceUrl;

    @Value("${groupware.connection-timeout:5000}")
    private int connectionTimeout;

    @Value("${groupware.read-timeout:12000}")
    private int readTimeout;


    @Bean
    public Jaxb2Marshaller marshaller() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setContextPath("jmnet.moka.web.wms.config.security.groupware.webservice");
        return marshaller;
    }

    @Bean
    public SoapWebServiceGatewaySupport groupWareAuthClient(Jaxb2Marshaller marshaller) {
        SoapWebServiceGatewaySupport client = new SoapWebServiceGatewaySupport(serviceId);
        client.setDefaultUri(serviceUrl);
        client.setMarshaller(marshaller);
        client.setUnmarshaller(marshaller);
        if (client.getMessageSenders() != null) {

            for (WebServiceMessageSender messageSender : client.getMessageSenders()) {
                ((HttpUrlConnectionMessageSender) messageSender).setConnectionTimeout(Duration.ofMillis(connectionTimeout));
                ((HttpUrlConnectionMessageSender) messageSender).setReadTimeout(Duration.ofMillis(readTimeout));
            }
        }
        return client;
    }



}
