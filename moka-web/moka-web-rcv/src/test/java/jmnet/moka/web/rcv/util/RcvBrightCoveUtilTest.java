package jmnet.moka.web.rcv.util;

import static org.junit.Assert.assertNotNull;

import jmnet.moka.web.rcv.config.BrightCoveConfig;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemMultiOvpVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemVo;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

/**
 * <pre>
 *
 * Project : moka-web-rcv
 * Package : jmnet.moka.web.rcv.util
 * ClassName : BulkBrightCoveUtilTest
 * Created : 2021-02-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-17 017 오후 2:18
 */
@Slf4j
public class RcvBrightCoveUtilTest {
    @Test
    public void getArticleMultiOvpInfo() {
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

        // 6183147334001
        ItemMultiOvpVo itemMultiOvpVo = RcvBrightCoveUtil.getArticleMultiOvpInfo(config, "6182850495001?ro=1&rc=2&autoPlay&mute", new ItemVo());
        assertNotNull(itemMultiOvpVo);
        log.info(itemMultiOvpVo.toString());
    }
}