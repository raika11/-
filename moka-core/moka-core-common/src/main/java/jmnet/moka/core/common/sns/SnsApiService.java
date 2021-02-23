package jmnet.moka.core.common.sns;

import java.util.Map;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.service
 * ClassName : ArticleSnsShareService
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 11:15
 */
public interface SnsApiService {

    Map<String, Object> publish(SnsPublishDTO snsPublish)
            throws Exception;

    Map<String, Object> delete(SnsDeleteDTO snsDelete)
            throws Exception;
}
