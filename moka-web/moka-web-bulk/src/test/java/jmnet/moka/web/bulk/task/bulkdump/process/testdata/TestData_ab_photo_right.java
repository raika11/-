package jmnet.moka.web.bulk.task.bulkdump.process.testdata;

import jmnet.moka.web.bulk.util.BulkTagUtil;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.testdata
 * ClassName : TestData_ab_photo_right
 * Created : 2021-02-15 015 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-15 015 오후 3:14
 */
public class TestData_ab_photo_right extends TestData {
    @Override
    public String getTestString() {
        return "<div class=\"ab_photo photo_right \" style=\"width: 336px;\">      <div class=\"image\">                <img alt=\"곽수근 서울대 명예교수. 사진 포스코\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202012/09/01f50ebf-52a2-4097-b647-ea9d6bad3666.jpg\"/>        <span class=\"mask\"></span>              </div>              <p class=\"caption\">곽수근 서울대 명예교수. 사진 포스코</p>          </div>";
    }

    @Override
    public String getSuccessString() {
        return "<div class=\"ab_photo photo_right \" >      <div class=\"image\">                <img alt=\"곽수근 서울대 명예교수. 사진 포스코\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202012/09/01f50ebf-52a2-4097-b647-ea9d6bad3666.jpg\"/>        <span class=\"mask\"></span>              </div>                        </div>";
    }

    @Override
    public String testPreProcess(String targetText) {
        return BulkTagUtil.restoreSpecialHtmlTag(targetText.replace("<br/>", "\n")
                                                           .replace("<br>", "\n")
                                                           .replace("&amp;", "&"));
    }
}
