package jmnet.moka.core.common.logger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

/**
 * <pre>
 *
 * 액션 로그 Configuration
 *
 * 2020. 9. 28. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2020. 9. 28. 오후 1:14:45
 */
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ActionLoggerConfiguration {

    @Value("${system.id:moka}")
    private String systemId;

    /**
     * <pre>
     * ActionLogger Bean을 생성한다.
     * </pre>
     *
     * @return ActionLogger
     * @throws Exception 예외
     */
    @Bean
    public ActionLogger actionLogger()
            throws Exception {
        return ActionLogger.getInstance(systemId);
    }
}
