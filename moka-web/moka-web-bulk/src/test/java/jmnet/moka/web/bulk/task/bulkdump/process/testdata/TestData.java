package jmnet.moka.web.bulk.task.bulkdump.process.testdata;

import static org.junit.Assert.assertEquals;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.testdata
 * ClassName : TestData
 * Created : 2021-02-08 008 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-08 008 오후 2:49
 */
@Slf4j
@SuppressWarnings("SpellCheckingInspection")
public abstract class TestData {
    public abstract String getTestString();
    public abstract String getSuccessString();
    public String testPreProcess( String targetText) {
        return targetText;
    }

    public void test(String targetText) {
        targetText = testPreProcess(targetText);
        log.info("\n" + targetText);
        assertEquals(targetText, getSuccessString());
    }
}
