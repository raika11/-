package jmnet.moka.web.bulk.util;

import static org.junit.Assert.*;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.config.BrightCoveConfig;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.util
 * ClassName : BulkBrightCoveUtilTest
 * Created : 2021-02-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-17 017 오후 1:28
 */

@Slf4j
public class BulkBrightCoveUtilTest {
    @Test
    public void foundVideoUrl(){
        BrightCoveConfig config = new BrightCoveConfig() {
            {
                setAccount("6057955867001");
                setClientId("4473803e-2914-475b-9885-8487eb6fa3aa");
                //noinspection SpellCheckingInspection
                setClientSecret("Y7t1Vopqj832RW6b8iosikH-a50NGLD8I-NyyQ4on_GdruTaB1N9x0DZMk34wC8RLylccqTCLfsjvGCaKQOtVA");
                setAccessTokenUrl("https://oauth.brightcove.com/v4/access_token?grant_type=client_credentials");
                setApiUrl("https://cms.api.brightcove.com/v1/accounts/{account}/videos/{assetId}");
                setVideoLimitSize(209715200);
            }
        };

        final String accessToken = BulkBrightCoveUtil.getAccessToken(config);
        assertFalse(McpString.isNullOrEmpty(accessToken));

        final String videoUrl = BulkBrightCoveUtil.getVideoUrl(config, accessToken, "6183147334001");
        assertFalse(McpString.isNullOrEmpty(videoUrl));
        log.info( "videoUrl = {}", videoUrl );
    }
}