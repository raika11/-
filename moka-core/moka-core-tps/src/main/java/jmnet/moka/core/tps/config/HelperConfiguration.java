package jmnet.moka.core.tps.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import jmnet.moka.core.tps.helper.ApiCodeHelper;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.helper.RelationHelper;
import jmnet.moka.core.tps.helper.UploadFileHelper;

/**
 * 
 * <pre>
 * Helper를 빈으로 생성한다
 * 2020. 4. 22. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 22. 오전 11:40:45
 * @author jeon
 */
@Configuration
public class HelperConfiguration {

    /**
     * 파일업로드 관련 헬퍼
     * 
     * @return 빈
     */
    @Bean
    public UploadFileHelper uploadFileHelper() {
        return new UploadFileHelper();
    }
    
    /**
     * 관련 페이지,콘텐츠스킨,컨테이너 조회 헬퍼
     * 
     * @return 빈
     */
    @Bean
    public RelationHelper relationHelper() {
        return new RelationHelper();
    }

    /**
     * apiHost + apiPath <=> apiCode 조회 헬퍼
     * 
     * @return 빈
     */
    @Bean
    public ApiCodeHelper apiCodeHelper() {
        return new ApiCodeHelper();
    }

    /**
     * 퍼지헬퍼
     * 
     * @return 빈
     */
    @Bean
    public PurgeHelper purgeHelper() {
        return new PurgeHelper();
    }
}
