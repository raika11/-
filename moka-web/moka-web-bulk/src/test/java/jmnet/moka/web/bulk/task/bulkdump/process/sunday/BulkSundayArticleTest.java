package jmnet.moka.web.bulk.task.bulkdump.process.sunday;

import static org.junit.Assert.assertEquals;

import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import org.junit.Test;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.sunday
 * ClassName : BulkSundayArticleTest
 * Created : 2021-01-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-27 027 오후 6:08
 */
public class BulkSundayArticleTest {

    @Test
    public void getOnlyArtReporterName() {
        BulkSundayArticle bulkSundayArticle = new BulkSundayArticle(new TotalVo<> (new BulkDumpTotalVo()));
        assertEquals(bulkSundayArticle.getOnlyArtReporterName("안효성 hyoza@joongang.co.kr"), "안효성");
    }
}