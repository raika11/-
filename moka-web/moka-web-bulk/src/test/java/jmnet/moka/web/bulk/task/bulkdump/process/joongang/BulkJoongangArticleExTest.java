package jmnet.moka.web.bulk.task.bulkdump.process.joongang;

import static org.junit.Assert.assertEquals;

import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import org.junit.Test;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.joongang
 * ClassName : BulkJoongangArticleExTest
 * Created : 2021-01-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-27 027 오후 4:15
 */
public class BulkJoongangArticleExTest {
    @Test
    public void processContent_ImageBlock_GetMimeType() {
        BulkJoongangArticleEx bulkJoongangArticle = new BulkJoongangArticleEx(new TotalVo<>( new BulkDumpTotalVo()));
        assertEquals( bulkJoongangArticle.processContent_ImageBlock_GetMimeType("ss.jpg"), "image/jpeg");
        assertEquals( bulkJoongangArticle.processContent_ImageBlock_GetMimeType("ss.jpeg"), "image/jpeg");
        assertEquals( bulkJoongangArticle.processContent_ImageBlock_GetMimeType("ss.png"), "image/png");
    }
}