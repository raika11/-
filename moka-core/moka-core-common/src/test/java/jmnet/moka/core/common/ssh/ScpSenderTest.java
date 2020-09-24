package jmnet.moka.core.common.ssh;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

public class ScpSenderTest {
    private static final Logger logger = LoggerFactory.getLogger(ScpSenderTest.class);
    private final static boolean LOW_LEVEL_LOG = false;
    private final static String USER_ID = "msp";
    /* 암호는 테스트시에만 입력 */
    private final static String USER_PASSWD = "";
    private final static String HOST = "101.55.50.49";
    private final static File KEY_FILE = new File("C:\\Users\\kspark\\.ssh\\id_rsa_org");
    private final static int PORT = 22;
    private final static Path SOURCE_PATH = new File("C:\\msp\\domains.json").toPath();
    private final static String REMOTE_PATH = "/home/msp";

    @Test
    public void sendByUserHomePrivateKey() throws IOException {
        ScpSender scpSender = new ScpSender(USER_ID,HOST);
        scpSender.setPort(PORT);
        scpSender.enableLowLevelLog(LOW_LEVEL_LOG);
        int result = scpSender.send(SOURCE_PATH, REMOTE_PATH);
        scpSender.close();
        logger.info(ScpSender.getMessage(result));
    }

    @Test
    public void sendByPasswd() throws IOException {
        ScpSender scpSender = new ScpSender(USER_ID,HOST,USER_PASSWD);
        scpSender.enableLowLevelLog(LOW_LEVEL_LOG);
        int result = scpSender.send(SOURCE_PATH, REMOTE_PATH);
        scpSender.close();
        logger.info(ScpSender.getMessage(result));
    }

    @Test
    public void sendByPrivateKeyFile() throws IOException {
        ScpSender scpSender = new ScpSender(USER_ID,HOST,KEY_FILE);
        scpSender.enableLowLevelLog(LOW_LEVEL_LOG);
        int result = scpSender.send(SOURCE_PATH, REMOTE_PATH);
        scpSender.close();
        logger.info(ScpSender.getMessage(result));
    }
}
