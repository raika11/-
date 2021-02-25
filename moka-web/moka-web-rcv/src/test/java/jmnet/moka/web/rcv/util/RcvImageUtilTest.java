package jmnet.moka.web.rcv.util;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.util
 * ClassName : RcvImageUtilTest
 * Created : 2021-02-15 015 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-15 015 오후 5:40
 */
public class RcvImageUtilTest {
    @Test
    public void resizeMaxWidthHeight() {
        final String sourceUrl = "https://pds.joins.com/news/component/htmlphoto_mmdata/202101/22/5ad1886b-677a-4512-9f87-2d519a36dabf.gif";
        final String downloadTmpFile = "C:\\work\\image.gif";
        final String targetFile = "C:\\work\\image.jpg";

        assertTrue( RcvImageUtil.downloadImage(sourceUrl, downloadTmpFile));
        assertTrue(RcvImageUtil.resizeMaxWidthHeight( targetFile, downloadTmpFile , 120, 92 ));
    }
}