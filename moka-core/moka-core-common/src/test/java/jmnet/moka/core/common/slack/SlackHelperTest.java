package jmnet.moka.core.common.slack;

import static org.junit.Assert.*;

import jmnet.moka.core.common.encrypt.MokaEncryptConfiguration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.core.common.slack
 * ClassName : SlackHelperTest
 * Created : 2021-02-19 019 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-19 019 오후 2:56
 */
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = MokaSlackConfiguration.class)
public class SlackHelperTest {

    @Autowired
    SlackHelper slackHelper;

    @Test
    public void sendMessage() {
        assertTrue(slackHelper.sendMessage(SlackChannel.BULK_TEST, "slackHelper Message Test"));
    }
}