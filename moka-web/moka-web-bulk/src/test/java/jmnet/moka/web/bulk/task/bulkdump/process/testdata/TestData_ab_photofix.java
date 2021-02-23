package jmnet.moka.web.bulk.task.bulkdump.process.testdata;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.testdata
 * ClassName : TestData_ab_photofix
 * Created : 2021-02-15 015 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-15 015 오후 1:39
 */
public class TestData_ab_photofix extends TestData{
    @Override
    public String getTestString() {
        return "<div class=\"ab_photofix\">          <div class=\"image\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202009/23/f3c1da6c-30ac-4aad-8099-f5ad626c6093.jpg');\"></div>                      <p class=\"caption\">한라산 구상나무</p>                  </div>";
    }

    @Override
    public String getSuccessString() {
        return "<img alt=\"한라산 구상나무\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202009/23/f3c1da6c-30ac-4aad-8099-f5ad626c6093.jpg\"/>";
    }
}
