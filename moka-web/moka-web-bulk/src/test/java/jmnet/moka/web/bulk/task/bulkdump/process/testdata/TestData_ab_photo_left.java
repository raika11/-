package jmnet.moka.web.bulk.task.bulkdump.process.testdata;

import jmnet.moka.web.bulk.util.BulkTagUtil;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.testdata
 * ClassName : TestData_ab_photo_left
 * Created : 2021-02-15 015 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-15 015 오후 3:10
 */
public class TestData_ab_photo_left extends TestData {
    @Override
    public String getTestString() {
        return "<div class=\"ab_photo photo_left \" style=\"width: 224px;\">      <div class=\"image\">                <img alt=\"코로나19 사태로 지난해 직장인들은 52일간 재택근무를 한 것으로 나타났다. [자료 잡코리아]\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202101/25/173a7a2a-93a7-498b-9d66-8f256debfafc.jpg\"/>        <span class=\"mask\"></span>              </div>              <p class=\"caption\">코로나19 사태로 지난해 직장인들은 52일간 재택근무를 한 것으로 나타났다. [자료 잡코리아]</p>          </div>";
    }

    @Override
    public String getSuccessString() {
        return "<div class=\"ab_photo photo_left \" >      <div class=\"image\">                <img alt=\"코로나19 사태로 지난해 직장인들은 52일간 재택근무를 한 것으로 나타났다. [자료 잡코리아]\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202101/25/173a7a2a-93a7-498b-9d66-8f256debfafc.jpg\"/>        <span class=\"mask\"></span>              </div>                        </div>";
    }

    @Override
    public String testPreProcess(String targetText) {
        return BulkTagUtil.restoreSpecialHtmlTag(targetText.replace("<br/>", "\n")
                                                           .replace("<br>", "\n")
                                                           .replace("&amp;", "&"));
    }
}
