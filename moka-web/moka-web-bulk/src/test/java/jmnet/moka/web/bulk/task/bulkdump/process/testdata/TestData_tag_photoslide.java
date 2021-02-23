package jmnet.moka.web.bulk.task.bulkdump.process.testdata;

import jmnet.moka.web.bulk.util.BulkTagUtil;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.testdata
 * ClassName : TestData_tag_photoslide
 * Created : 2021-02-15 015 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-15 015 오후 3:00
 */
public class TestData_tag_photoslide extends TestData{
    @Override
    public String getTestString() {
        return "<div class=\"tag_photoslide\"><div class=\"ab_photo photo_center\" style=\"width: 580px;\"><div class=\"image\"><img alt=\"영화 &#39;스페니쉬 아파트먼트&#39;의 한 장면. 유럽 각국에서 모여든 청년들이 함께 살며 벌어지는 일을 담았다.\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202004/04/d63d156f-9832-4928-80a1-a7e23e5c22d0.jpg\"><span class=\"mask\"></span></div><p class=\"caption\">영화 &#39;스페니쉬 아파트먼트&#39;의 한 장면. 유럽 각국에서 모여든 청년들이 함께 살며 벌어지는 일을 담았다.</p></div><div class=\"ab_photo photo_center\" style=\"width: 580px;\"><div class=\"image\"><img alt=\"영화 &#39;스페니쉬 아파트먼트&#39;의 한 장면.\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202004/04/37101be4-80fa-4885-8d6e-d7464c46a4b2.jpg\"><span class=\"mask\"></span></div><p class=\"caption\">영화 &#39;스페니쉬 아파트먼트&#39;의 한 장면.</p></div></div>";
    }

    @Override
    public String getSuccessString() {
        return "<img alt=\"영화 '스페니쉬 아파트먼트'의 한 장면. 유럽 각국에서 모여든 청년들이 함께 살며 벌어지는 일을 담았다.\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202004/04/d63d156f-9832-4928-80a1-a7e23e5c22d0.jpg\">\r\n"
                + "<img alt=\"영화 '스페니쉬 아파트먼트'의 한 장면.\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202004/04/37101be4-80fa-4885-8d6e-d7464c46a4b2.jpg\">\r\n";
    }

    @Override
    public String testPreProcess(String targetText) {
        return BulkTagUtil.restoreSpecialHtmlTag(targetText.replace("<br/>", "\n")
                                                           .replace("<br>", "\n")
                                                           .replace("&amp;", "&"));
    }
}
