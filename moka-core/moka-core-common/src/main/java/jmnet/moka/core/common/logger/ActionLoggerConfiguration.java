package jmnet.moka.core.common.logger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <pre>
 *
 * 액션 로그 Configuration
 *
 * 2020. 9. 28. ince 최초생성
 * </pre>
 *
 * @since 2020. 9. 28. 오후 1:14:45
 * @author ince
 */
@Configuration
public class ActionLoggerConfiguration {

  @Value("${system.id:moka}")
  private String systemId;

  /**
   * <pre>
   * ActionLogger Bean을 생성한다.
   * </pre>
   * @return ActionLogger
   * @throws Exception 예외
   */
  @Bean
  public ActionLogger actionLogger() throws Exception {
    return ActionLogger.getInstance(systemId);
  }
}
