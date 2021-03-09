package jmnet.moka.web.bulk.task.bulkdump.process.joongang;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkDumpEnvCopyright;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_ab_box_article;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_ab_ds_timeline;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_ab_photo_center;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_ab_photo_left;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_ab_photo_right;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_ab_photofix;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_ab_sub_heading;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_eGul;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_emphasis;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_jhot_click;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_tag_interview;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_tag_photobundle;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_tag_photoslide;
import jmnet.moka.web.bulk.task.bulkdump.process.testdata.TestData_tag_quotation;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkTagUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.joongang
 * ClassName : BulkJoongangArticleTest
 * Created : 2021-01-11 011 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-11 011 오후 5:58
 */
@SuppressWarnings("ALL")
@Slf4j
public class BulkJoongangArticleTest {
    BulkJoongangArticle bulkJoongangArticle;

    public BulkJoongangArticleTest() {
        this.bulkJoongangArticle = new BulkJoongangArticle(new TotalVo<BulkDumpTotalVo>(new BulkDumpTotalVo()));
        this.bulkJoongangArticle.getTotalId().setData("기사토탈Id");
    }

    @Test
    public void processContentTag_ab_dynamic_chart() {
        final String testString = "before Text" +
                "<div class=\"ab_dynamic_chart\" data-chartImgUrl = \"https://pds.joins.com/news/component/htmlphoto_mmdata/202004/26/1c200b46-6c6d-4872-a50c-333858eaafb6.jpg\" data-datadchart='{\"chart\":{\"type\":\"line\",\"plotBorderWidth\":0,\"dataForLoading\":{\"theme\":\"softDark\",\"yGridLine\":true,\"xAxis_title_text\":\"\",\"yAxis_title_text\":\"\",\"yAxis_min\":\"\",\"yAxis_max\":\"\",\"xAxis_labels_format\":\"\",\"yAxis_labels_format\":\"%\",\"legend\":{\"legend_enabled\":false,\"legend_layout\":\"horizontal\",\"legend_align\":\"center\",\"legend_verticalAlign\":\"bottom\"},\"credits_enabled\":false,\"credits_url\":\"https://joongang.joins.com\",\"credits_text\":\"joongang.joins.com\",\"zoomData\":{\"curMaxZoomMap\":null,\"curMinZoomMap\":null,\"curMaxZoomMapY\":null,\"curMinZoomMapY\":null}},\"backgroundColor\":{\"linearGradient\":{\"x1\":0,\"y1\":0,\"x2\":1,\"y2\":1},\"stops\":[[0,\"#2a2a2b\"],[1,\"#3e3e40\"]]},\"style\":{\"fontFamily\":\"&apos;Malgun Gothic&apos;, &apos;맑은고딕&apos;, dotum, Arial, AppleSDGothic\"},\"plotBorderColor\":\"#606063\"},\"title\":{\"text\":\"자동차보험 손해율 추이\",\"align\":\"center\",\"style\":{\"fontWeight\":\"bold\",\"color\":\"#E0E0E3\",\"textTransform\":\"uppercase\",\"fontSize\":\"20px\"}},\"subtitle\":{\"text\":\"자료 : 보험개발원, 보험통계포털\",\"align\":\"right\",\"style\":{\"fontWeight\":null,\"color\":\"#E0E0E3\",\"textTransform\":\"uppercase\"}},\"credits\":{\"enabled\":false,\"style\":{\"color\":\"#666\"}},\"xAxis\":{\"categories\":[\"2010년\",\"2011년\",\"2012년\",\"2013년\",\"2014년\",\"2015년\",\"2016년\",\"2017년\",\"2018년\",\"2019년\"],\"title\":{\"text\":\"Sample [x]Aixs title\",\"style\":{\"color\":\"#A0A0A3\"}},\"labels\":{\"format\":\"{value} \",\"style\":{\"color\":\"#E0E0E3\"}},\"gridLineColor\":\"#707073\",\"lineColor\":\"#707073\",\"minorGridLineColor\":\"#505053\",\"tickColor\":\"#707073\"},\"yAxis\":{\"title\":{\"text\":\"Sample [y]Axis Title\",\"style\":{\"color\":\"#A0A0A3\"}},\"gridLineWidth\":1,\"labels\":{\"format\":\"{value} %\",\"style\":{\"color\":\"#E0E0E3\"}},\"min\":null,\"max\":null,\"gridLineColor\":\"#707073\",\"lineColor\":\"#707073\",\"minorGridLineColor\":\"#505053\",\"tickColor\":\"#707073\",\"tickWidth\":1},\"legend\":{\"enabled\":false,\"layout\":\"horizontal\",\"align\":\"center\",\"verticalAlign\":\"bottom\",\"itemStyle\":{\"color\":\"#E0E0E3\"},\"itemHoverStyle\":{\"color\":\"#FFF\"},\"itemHiddenStyle\":{\"color\":\"#606063\"}},\"plotOptions\":{\"series\":{\"label\":{\"connectorAllowed\":false},\"dataLabels\":{\"color\":\"#B0B0B3\"},\"marker\":{\"lineColor\":\"#333\"}},\"boxplot\":{\"fillColor\":\"#505053\"},\"candlestick\":{\"lineColor\":\"white\"},\"errorbar\":{\"color\":\"white\"}},\"series\":[{\"name\":[\"손해율\"],\"data\":[80.4,82.3,83.9,87.7,88.4,87.8,83,80.8,85.9,91.4]}],\"responsive\":{\"rules\":[{\"condition\":{\"maxWidth\":500},\"chartOptions\":{\"legend\":{\"layout\":\"horizontal\",\"align\":\"center\",\"verticalAlign\":\"bottom\"}},\"_id\":\"highcharts-4pc2wbb-1532\"}]},\"colors\":[\"#2b908f\",\"#90ee7e\",\"#f45b5b\",\"#7798BF\",\"#aaeeee\",\"#ff0066\",\"#eeaaee\",\"#55BF3B\",\"#DF908D\",\"#9F64B5\",\"#aaeeee\"],\"tooltip\":{\"backgroundColor\":\"rgba(0, 0, 0, 0.85)\",\"style\":{\"color\":\"#F0F0F0\"}},\"labels\":{\"style\":{\"color\":\"#707073\"}},\"drilldown\":{\"activeAxisLabelStyle\":{\"color\":\"#F0F0F3\"},\"activeDataLabelStyle\":{\"color\":\"#F0F0F3\"}},\"navigation\":{\"buttonOptions\":{\"symbolStroke\":\"#DDDDDD\",\"theme\":{\"fill\":\"#505053\"}}},\"rangeSelector\":{\"buttonTheme\":{\"fill\":\"#505053\",\"stroke\":\"#000000\",\"style\":{\"color\":\"#CCC\"},\"states\":{\"hover\":{\"fill\":\"#707073\",\"stroke\":\"#000000\",\"style\":{\"color\":\"white\"}},\"select\":{\"fill\":\"#000003\",\"stroke\":\"#000000\",\"style\":{\"color\":\"white\"}}}},\"inputBoxBorderColor\":\"#505053\",\"inputStyle\":{\"backgroundColor\":\"#333\",\"color\":\"silver\"},\"labelStyle\":{\"color\":\"silver\"}},\"navigator\":{\"handles\":{\"backgroundColor\":\"#666\",\"borderColor\":\"#AAA\"},\"outlineColor\":\"#CCC\",\"maskFill\":\"rgba(255,255,255,0.1)\",\"series\":{\"color\":\"#7798BF\",\"lineColor\":\"#A6C7ED\"},\"xAxis\":{\"gridLineColor\":\"#505053\"}},\"scrollbar\":{\"barBackgroundColor\":\"#808083\",\"barBorderColor\":\"#808083\",\"buttonArrowColor\":\"#CCC\",\"buttonBackgroundColor\":\"#606063\",\"buttonBorderColor\":\"#606063\",\"rifleColor\":\"#FFF\",\"trackBackgroundColor\":\"#404043\",\"trackBorderColor\":\"#404043\"},\"legendBackgroundColor\":\"rgba(0, 0, 0, 0.5)\",\"background2\":\"#505053\",\"dataLabelsColor\":\"#B0B0B3\",\"textColor\":\"#C0C0C0\",\"contrastTextColor\":\"#F0F0F3\",\"maskColor\":\"rgba(255,255,255,0.3)\"}' >  <figure id=\"chart_container_5\">  </figure></div>" +
                "middle Text" +
                "<div class=\"ab_dynamic_chart\" data-chartImgUrl = \"https://pds.joins.com/news/component/htmlphoto_mmdata/202004/26/Second.jpg\" data-datadchart='{\"chart\":{\"type\":\"line\",\"plotBorderWidth\":0,\"dataForLoading\":{\"theme\":\"softDark\",\"yGridLine\":true,\"xAxis_title_text\":\"\",\"yAxis_title_text\":\"\",\"yAxis_min\":\"\",\"yAxis_max\":\"\",\"xAxis_labels_format\":\"\",\"yAxis_labels_format\":\"%\",\"legend\":{\"legend_enabled\":false,\"legend_layout\":\"horizontal\",\"legend_align\":\"center\",\"legend_verticalAlign\":\"bottom\"},\"credits_enabled\":false,\"credits_url\":\"https://joongang.joins.com\",\"credits_text\":\"joongang.joins.com\",\"zoomData\":{\"curMaxZoomMap\":null,\"curMinZoomMap\":null,\"curMaxZoomMapY\":null,\"curMinZoomMapY\":null}},\"backgroundColor\":{\"linearGradient\":{\"x1\":0,\"y1\":0,\"x2\":1,\"y2\":1},\"stops\":[[0,\"#2a2a2b\"],[1,\"#3e3e40\"]]},\"style\":{\"fontFamily\":\"&apos;Malgun Gothic&apos;, &apos;맑은고딕&apos;, dotum, Arial, AppleSDGothic\"},\"plotBorderColor\":\"#606063\"},\"title\":{\"text\":\"자동차보험 손해율 추이\",\"align\":\"center\",\"style\":{\"fontWeight\":\"bold\",\"color\":\"#E0E0E3\",\"textTransform\":\"uppercase\",\"fontSize\":\"20px\"}},\"subtitle\":{\"text\":\"자료 : 보험개발원, 보험통계포털\",\"align\":\"right\",\"style\":{\"fontWeight\":null,\"color\":\"#E0E0E3\",\"textTransform\":\"uppercase\"}},\"credits\":{\"enabled\":false,\"style\":{\"color\":\"#666\"}},\"xAxis\":{\"categories\":[\"2010년\",\"2011년\",\"2012년\",\"2013년\",\"2014년\",\"2015년\",\"2016년\",\"2017년\",\"2018년\",\"2019년\"],\"title\":{\"text\":\"Sample [x]Aixs title\",\"style\":{\"color\":\"#A0A0A3\"}},\"labels\":{\"format\":\"{value} \",\"style\":{\"color\":\"#E0E0E3\"}},\"gridLineColor\":\"#707073\",\"lineColor\":\"#707073\",\"minorGridLineColor\":\"#505053\",\"tickColor\":\"#707073\"},\"yAxis\":{\"title\":{\"text\":\"Sample [y]Axis Title\",\"style\":{\"color\":\"#A0A0A3\"}},\"gridLineWidth\":1,\"labels\":{\"format\":\"{value} %\",\"style\":{\"color\":\"#E0E0E3\"}},\"min\":null,\"max\":null,\"gridLineColor\":\"#707073\",\"lineColor\":\"#707073\",\"minorGridLineColor\":\"#505053\",\"tickColor\":\"#707073\",\"tickWidth\":1},\"legend\":{\"enabled\":false,\"layout\":\"horizontal\",\"align\":\"center\",\"verticalAlign\":\"bottom\",\"itemStyle\":{\"color\":\"#E0E0E3\"},\"itemHoverStyle\":{\"color\":\"#FFF\"},\"itemHiddenStyle\":{\"color\":\"#606063\"}},\"plotOptions\":{\"series\":{\"label\":{\"connectorAllowed\":false},\"dataLabels\":{\"color\":\"#B0B0B3\"},\"marker\":{\"lineColor\":\"#333\"}},\"boxplot\":{\"fillColor\":\"#505053\"},\"candlestick\":{\"lineColor\":\"white\"},\"errorbar\":{\"color\":\"white\"}},\"series\":[{\"name\":[\"손해율\"],\"data\":[80.4,82.3,83.9,87.7,88.4,87.8,83,80.8,85.9,91.4]}],\"responsive\":{\"rules\":[{\"condition\":{\"maxWidth\":500},\"chartOptions\":{\"legend\":{\"layout\":\"horizontal\",\"align\":\"center\",\"verticalAlign\":\"bottom\"}},\"_id\":\"highcharts-4pc2wbb-1532\"}]},\"colors\":[\"#2b908f\",\"#90ee7e\",\"#f45b5b\",\"#7798BF\",\"#aaeeee\",\"#ff0066\",\"#eeaaee\",\"#55BF3B\",\"#DF908D\",\"#9F64B5\",\"#aaeeee\"],\"tooltip\":{\"backgroundColor\":\"rgba(0, 0, 0, 0.85)\",\"style\":{\"color\":\"#F0F0F0\"}},\"labels\":{\"style\":{\"color\":\"#707073\"}},\"drilldown\":{\"activeAxisLabelStyle\":{\"color\":\"#F0F0F3\"},\"activeDataLabelStyle\":{\"color\":\"#F0F0F3\"}},\"navigation\":{\"buttonOptions\":{\"symbolStroke\":\"#DDDDDD\",\"theme\":{\"fill\":\"#505053\"}}},\"rangeSelector\":{\"buttonTheme\":{\"fill\":\"#505053\",\"stroke\":\"#000000\",\"style\":{\"color\":\"#CCC\"},\"states\":{\"hover\":{\"fill\":\"#707073\",\"stroke\":\"#000000\",\"style\":{\"color\":\"white\"}},\"select\":{\"fill\":\"#000003\",\"stroke\":\"#000000\",\"style\":{\"color\":\"white\"}}}},\"inputBoxBorderColor\":\"#505053\",\"inputStyle\":{\"backgroundColor\":\"#333\",\"color\":\"silver\"},\"labelStyle\":{\"color\":\"silver\"}},\"navigator\":{\"handles\":{\"backgroundColor\":\"#666\",\"borderColor\":\"#AAA\"},\"outlineColor\":\"#CCC\",\"maskFill\":\"rgba(255,255,255,0.1)\",\"series\":{\"color\":\"#7798BF\",\"lineColor\":\"#A6C7ED\"},\"xAxis\":{\"gridLineColor\":\"#505053\"}},\"scrollbar\":{\"barBackgroundColor\":\"#808083\",\"barBorderColor\":\"#808083\",\"buttonArrowColor\":\"#CCC\",\"buttonBackgroundColor\":\"#606063\",\"buttonBorderColor\":\"#606063\",\"rifleColor\":\"#FFF\",\"trackBackgroundColor\":\"#404043\",\"trackBorderColor\":\"#404043\"},\"legendBackgroundColor\":\"rgba(0, 0, 0, 0.5)\",\"background2\":\"#505053\",\"dataLabelsColor\":\"#B0B0B3\",\"textColor\":\"#C0C0C0\",\"contrastTextColor\":\"#F0F0F3\",\"maskColor\":\"rgba(255,255,255,0.3)\"}' >  <figure id=\"chart_container_5\">  </figure></div>" +
                "after Test";

        BulkJoongangArticle bulkJoongangArticle = new BulkJoongangArticle(new TotalVo<BulkDumpTotalVo>(new BulkDumpTotalVo()));
        bulkJoongangArticle.getContentHtml().setData(testString);

        bulkJoongangArticle.processContentTag_ab_dynamic_chart();

        final String successString = "before Text" +
                "<img alt=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202004/26/1c200b46-6c6d-4872-a50c-333858eaafb6.jpg\"/>" +
                "middle Text" +
                "<img alt=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202004/26/Second.jpg\"/>after Test";

        log.info(bulkJoongangArticle.getContentHtml().toString());
        assertEquals(bulkJoongangArticle.getContentHtml().toString(), successString);
    }

    @Test
    public void processContent_getImages() {
        final String testString = "before Text" +
                "<img alt=\"차이나랩 카드뉴스\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202012/11/image01.jpg\"/>" +
                "middle Text" +
                "<img alt=\"차이나랩 카드뉴스2\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202012/11/image02.jpg\"/>" +
                "end Text ";

        BulkJoongangArticle bulkJoongangArticle = new BulkJoongangArticle(new TotalVo<BulkDumpTotalVo>(new BulkDumpTotalVo()));
        bulkJoongangArticle.getContentHtml().setData(testString);
        List<Map<String,String>> images = bulkJoongangArticle.processContent_getImages();

        assertEquals(images.size(), 2);

        Map<String,String> image1 = images.get(0);
        assertEquals(image1.get("src"), "https://pds.joins.com/news/component/htmlphoto_mmdata/202012/11/image01.jpg");
        assertEquals(image1.get("alt"), "차이나랩 카드뉴스");

        Map<String,String> image2 = images.get(1);
        assertEquals(image2.get("src"), "https://pds.joins.com/news/component/htmlphoto_mmdata/202012/11/image02.jpg");
        assertEquals(image2.get("alt"), "차이나랩 카드뉴스2");
    }

    @Test
    public void processContentTag_ab_people() {
        final String testString = "before Text " +
                "<div class=\"ab_people\"> <div class=\"ab_people_hd\"><a href=\"http://people.joins.com/search/profile.aspx?pn=6531\"><em>인물사전</em> <strong>송병락1 (宋丙洛)</strong></a></div> <div class=\"ab_people_bd\"> <span class=\"thumb\"><img src=\"https://people-images.joins.com/PIIPhoto/5/3/1/6531l.jpg\" alt=\"\"><span class=\"mask\"></span></span> <ul>  <li><em>출생년도</em>1939</li>  <li><em>직업</em>[現]대학교수</li>  <li><em>소속기관</em> [現] 서울대학교 명예교수,[現] 자유와창의교육원 원장</li> </ul> </div></div>" +
                "middle Text " +
                "<div class=\"ab_people\"> <div class=\"ab_people_hd\"><a href=\"http://people.joins.com/search/profile.aspx?pn=6531\"><em>인물사전</em> <strong>송병락2 (宋丙洛)</strong></a></div> <div class=\"ab_people_bd\"> <span class=\"thumb\"><img src=\"https://people-images.joins.com/PIIPhoto/5/3/1/6531l.jpg\" alt=\"\"><span class=\"mask\"></span></span> <ul>  <li><em>출생년도</em>1939</li>  <li><em>직업</em>[現]대학교수</li>  <li><em>소속기관</em> [現] 서울대학교 명예교수,[現] 자유와창의교육원 원장</li> </ul> </div></div>" +
                "end Text ";

        BulkJoongangArticle bulkJoongangArticle = new BulkJoongangArticle(new TotalVo<BulkDumpTotalVo>(new BulkDumpTotalVo()));
        bulkJoongangArticle.getContentHtml().setData(testString);
        bulkJoongangArticle.processContentTag_ab_people();

        final String successString = "before Text middle Text end Text ";
        log.info(bulkJoongangArticle.getContentHtml().toString());
        assertEquals(bulkJoongangArticle.getContentHtml().toString(), successString);
    }

    @Test
    public void processContentTag_quiz_question_screen_open() {
        final String testString = "before Text " +
                "<!-- quiz_open --><div data-nid=\"51\" class=\"ab_quiz\" data-quizresult=\"\" data-quizcnt=\"\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/a7449bbb-536b-4315-845c-d4da622916d7.jpg');\">  <!-- quiz_start_screen_open -->  <div class=\"quiz_start_screen\">    <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>    <p class=\"quiz_group\"></p>    <p class=\"quiz_title\">[퀴즈 뉴스]신조어 얼마나 알고계시나요?</p>    <p class=\"quiz_description\">요즘 신조어를 모르면 다들 웃고 있는데 혼자 이해를 못해 괜히 무안해할 때가 있다. 신조어를 얼마나 알고있는지 퀴즈를 통해 알아보자</p>    <div class=\"quiz_control\"><a href=\"javascript:void(0);\" class=\"quiz_start_btn\">START</a></div>    <span class=\"quiz_result_type hide\">N</span>  </div>  <!-- quiz_start_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/217ef2a1-cced-4a18-ab29-a23ec1b5b1e7.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q1 :</span> 다음 중 놀람,허무,신기,실망 등의 감정을 표현할 때 사용하는 신조어는?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> ㅎㄱ</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> ㄷㅊ</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> ㅎㄹ</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> ㅁㄹ</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 3번 ㅎㄹ</span>            <span class=\"hide\">(</span>            'ㅎㄱ'은 허걱. 당황할 때 쓰는 말이다. 'ㄷㅊ'은 닥쳐,'ㅁㄹ'은 몰라의 줄임말이다. 'ㅎㄹ'은 '헐'을 뜻한다            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/6da9092a-e3a4-4836-b827-537807b0559a.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q2 :</span> 다음 중 유행에 뒤처지는 사람을 놀릴 때 사용하는 신조어는?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 보배</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 문찐</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 비담</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> 남아공</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 2번 문찐</span>            <span class=\"hide\">(</span>            보배는 보조배터리,비담은 비주얼 담당,남아공은 남아서 공부나 해를 의미하는 신조어.문찐은 '문화 찐따'의 줄임말이다. 찐따는‘어수룩한 사람'을 뜻한다.            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/5fc2084d-ae18-4aef-831f-46050be82784.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q3 :</span> 일상생활에서 무언가에 능숙하지 않은 사람을 뜻하는 신조어는?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 발컨</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 엄근진</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 1번 발컨</span>            <span class=\"hide\">(</span>            엄근진은 엄격, 근엄, 진지의 합성어. 발컨은 ‘발로 컨트롤’의 줄임말.게임상에선 게임을 발로 한다는 의미로 사용된다            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/ac25715f-64da-4a7b-b574-c2e4a260bf12.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q4 :</span> 다음 중 부동산과 관련없는 것은?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 역세권</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 슬세권</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 청포족</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 2번 슬세권</span>            <span class=\"hide\">(</span>            슬세권은 슬리퍼로 돌아다닐만한 지역을 뜻한다. '청포족’은 청약포기족의 줄임말             <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/036d9a6b-0e62-425a-9fb2-eda4848de0e3.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q5 :</span> 다음 중 눈물과 관련된 신조어는?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 룸곡옾높</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 룸국웊높</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 롬곡옾눞</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> 롬곡옵놉</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 3번 롬곡옾눞</span>            <span class=\"hide\">(</span>            글자를 뒤집어서 읽으면 폭풍눈물            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/424aae64-5160-47ce-93b1-43aef174a1ee.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q6 :</span> 인터넷에서 일컫는 ‘천조국’은 다음 중 어느 나라일까?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 미국</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 영국</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 한국</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> 일본</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 1번 미국</span>            <span class=\"hide\">(</span>            미국의 국방비를 빗대어 ‘천조국(千兆國)’이라 한다. ‘1000조원’이라해서 유래. 실재는 2019년 기준 약 799조원.            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/3e0ab221-5287-42f3-8d80-4136b8f67fbb.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q7 :</span> 다음 보기엔 '마상'에 대해 국어사전에 나오는 뜻이 2개, 신조어가 1개 있다. 이들 3개에 해당되지않는 것은?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> ‘작은 통나무배’란 뜻의 마상이의 준말</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 말의 등 위</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 말처럼 긴 얼굴을 놀림조로 이르는 말</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> 마음의 상처</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 3번 말처럼 긴 얼굴을 놀림조로 이르는 말</span>            <span class=\"hide\">(</span>            신조어 '마상'은 '마음의상처'의 줄임말이다. 말처럼 긴 얼굴이나 그런 얼굴을 가진 사람을 놀림조로 이르는 말은 '말상'이다            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/119e6eee-48d5-44d4-89b1-f41db9cdeae1.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q8 :</span> 다음 중 커피와 관련없는 신조어는?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 아아</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 얼죽아</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 스세권</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> latte is horse</a>              <span class=\"result hide\">Y</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 4번 latte is horse</span>            <span class=\"hide\">(</span>            ‘아아’는 ‘아이스 아메리카노’,'얼죽아'는 ‘얼어 죽어도 아이스’, '스세권'은 '근처에 스타벅스 있는 곳'. 'latte is horse'는 '나때는 말이야'이란 뜻.            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->    <div class=\"quiz_result_screen\">    <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>    <p class=\"quiz_result\"></p>    <p class=\"quiz_score\"><span><em></em>문제 중 <em></em>문제 적중!</span></p>    <div class=\"quiz_control\">      <a href=\"javascript:void(0);\" class=\"quiz_restart_btn\">다시풀기</a>        </div>  </div></div><!-- quiz_close --><br /><br />" +
                "middle Text " +
                "<!-- quiz_open --><div data-nid=\"51\" class=\"ab_quiz\" data-quizresult=\"\" data-quizcnt=\"\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/a7449bbb-536b-4315-845c-d4da622916d7.jpg');\">  <!-- quiz_start_screen_open -->  <div class=\"quiz_start_screen\">    <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>    <p class=\"quiz_group\"></p>    <p class=\"quiz_title\">[두번째 퀴즈 뉴스]신조어 얼마나 알고계시나요?</p>    <p class=\"quiz_description\">요즘 신조어를 모르면 다들 웃고 있는데 혼자 이해를 못해 괜히 무안해할 때가 있다. 신조어를 얼마나 알고있는지 퀴즈를 통해 알아보자</p>    <div class=\"quiz_control\"><a href=\"javascript:void(0);\" class=\"quiz_start_btn\">START</a></div>    <span class=\"quiz_result_type hide\">N</span>  </div>  <!-- quiz_start_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/217ef2a1-cced-4a18-ab29-a23ec1b5b1e7.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q1 :</span> 다음 중 놀람,허무,신기,실망 등의 감정을 표현할 때 사용하는 신조어는?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> ㅎㄱ</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> ㄷㅊ</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> ㅎㄹ</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> ㅁㄹ</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 3번 ㅎㄹ</span>            <span class=\"hide\">(</span>            'ㅎㄱ'은 허걱. 당황할 때 쓰는 말이다. 'ㄷㅊ'은 닥쳐,'ㅁㄹ'은 몰라의 줄임말이다. 'ㅎㄹ'은 '헐'을 뜻한다            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/6da9092a-e3a4-4836-b827-537807b0559a.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q2 :</span> 다음 중 유행에 뒤처지는 사람을 놀릴 때 사용하는 신조어는?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 보배</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 문찐</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 비담</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> 남아공</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 2번 문찐</span>            <span class=\"hide\">(</span>            보배는 보조배터리,비담은 비주얼 담당,남아공은 남아서 공부나 해를 의미하는 신조어.문찐은 '문화 찐따'의 줄임말이다. 찐따는‘어수룩한 사람'을 뜻한다.            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/5fc2084d-ae18-4aef-831f-46050be82784.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q3 :</span> 일상생활에서 무언가에 능숙하지 않은 사람을 뜻하는 신조어는?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 발컨</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 엄근진</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 1번 발컨</span>            <span class=\"hide\">(</span>            엄근진은 엄격, 근엄, 진지의 합성어. 발컨은 ‘발로 컨트롤’의 줄임말.게임상에선 게임을 발로 한다는 의미로 사용된다            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/ac25715f-64da-4a7b-b574-c2e4a260bf12.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q4 :</span> 다음 중 부동산과 관련없는 것은?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 역세권</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 슬세권</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 청포족</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 2번 슬세권</span>            <span class=\"hide\">(</span>            슬세권은 슬리퍼로 돌아다닐만한 지역을 뜻한다. '청포족’은 청약포기족의 줄임말             <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/036d9a6b-0e62-425a-9fb2-eda4848de0e3.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q5 :</span> 다음 중 눈물과 관련된 신조어는?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 룸곡옾높</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 룸국웊높</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 롬곡옾눞</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> 롬곡옵놉</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 3번 롬곡옾눞</span>            <span class=\"hide\">(</span>            글자를 뒤집어서 읽으면 폭풍눈물            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/424aae64-5160-47ce-93b1-43aef174a1ee.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q6 :</span> 인터넷에서 일컫는 ‘천조국’은 다음 중 어느 나라일까?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 미국</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 영국</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 한국</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> 일본</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 1번 미국</span>            <span class=\"hide\">(</span>            미국의 국방비를 빗대어 ‘천조국(千兆國)’이라 한다. ‘1000조원’이라해서 유래. 실재는 2019년 기준 약 799조원.            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/3e0ab221-5287-42f3-8d80-4136b8f67fbb.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q7 :</span> 다음 보기엔 '마상'에 대해 국어사전에 나오는 뜻이 2개, 신조어가 1개 있다. 이들 3개에 해당되지않는 것은?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> ‘작은 통나무배’란 뜻의 마상이의 준말</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 말의 등 위</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 말처럼 긴 얼굴을 놀림조로 이르는 말</a>              <span class=\"result hide\">Y</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> 마음의 상처</a>              <span class=\"result hide\">N</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 3번 말처럼 긴 얼굴을 놀림조로 이르는 말</span>            <span class=\"hide\">(</span>            신조어 '마상'은 '마음의상처'의 줄임말이다. 말처럼 긴 얼굴이나 그런 얼굴을 가진 사람을 놀림조로 이르는 말은 '말상'이다            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->      <!-- quiz_question_screen_open -->    <div data-selected=\"N\" class=\"quiz_question_screen\" style=\"background-image:url('https://pds.joins.com/news/component/htmlphoto_mmdata/202012/29/119e6eee-48d5-44d4-89b1-f41db9cdeae1.jpg');\">      <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>      <p class=\"quiz_counter\"></p>      <div class=\"quiz_content\">        <p class=\"quiz_question\"><span class=\"hide\">Q8 :</span> 다음 중 커피와 관련없는 신조어는?</p>        <ul class=\"quiz_answer\">                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">1 : </span> 아아</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">2 : </span> 얼죽아</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">3 : </span> 스세권</a>              <span class=\"result hide\">N</span>            </li>                      <li>              <a href=\"javascript:void(0);\" ><span class=\"hide\">4 : </span> latte is horse</a>              <span class=\"result hide\">Y</span>            </li>                  </ul>        <div class=\"quiz_response_area\">          <p class=\"quiz_response\">            <span class=\"hide\">정답 : 4번 latte is horse</span>            <span class=\"hide\">(</span>            ‘아아’는 ‘아이스 아메리카노’,'얼죽아'는 ‘얼어 죽어도 아이스’, '스세권'은 '근처에 스타벅스 있는 곳'. 'latte is horse'는 '나때는 말이야'이란 뜻.            <span class=\"hide\">)</span>          </p>        </div>      </div>      <div class=\"quiz_control\">        <a href=\"javascript:void(0);\" class=\"quiz_previous_btn\">이전문제</a>        <a href=\"javascript:void(0);\" class=\"quiz_next_btn\">다음문제</a>      </div>    </div>    <!-- quiz_question_screen_close -->    <div class=\"quiz_result_screen\">    <h3 class=\"quiz_logo\"><span class=\"hide\">중앙일보 Quiz</span></h3>    <p class=\"quiz_result\"></p>    <p class=\"quiz_score\"><span><em></em>문제 중 <em></em>문제 적중!</span></p>    <div class=\"quiz_control\">      <a href=\"javascript:void(0);\" class=\"quiz_restart_btn\">다시풀기</a>        </div>  </div></div><!-- quiz_close --><br /><br />" +
                "end Text ";

        BulkJoongangArticle bulkJoongangArticle = new BulkJoongangArticle(new TotalVo<BulkDumpTotalVo>(new BulkDumpTotalVo()));
        bulkJoongangArticle.getContentHtml().setData(testString);
        bulkJoongangArticle.getServiceurl().setData("http://testtest.com/testtest");
        bulkJoongangArticle.processContentTag_quiz_question_screen_open();

        log.info(bulkJoongangArticle.getContentHtml().toString());
    }

    @Test
    public void processContentTag_ab_related_article() {
        final String testString = "before Text " +
                "<div class=\"ab_related_article\"><div class=\"hd\"><strong>관련기사 1</strong></div><div class=\"bd\"><ul class=\"text_type\"><li><strong class=\"headline\"><a href=\"https://news.joins.com/article/23254351\">[인사] 중앙그룹 1</a></strong></li></ul></div></div>" +
                "middle Text " +
                "<div class=\"ab_related_article\"><div class=\"hd\"><strong>관련기사 2</strong></div><div class=\"bd\"><ul class=\"text_type\"><li><strong class=\"headline\"><a href=\"https://news.joins.com/article/23254351\">[인사] 중앙그룹 2</a></strong></li></ul></div></div>" +
                "end Text ";

        BulkJoongangArticle bulkJoongangArticle = new BulkJoongangArticle(new TotalVo<BulkDumpTotalVo>(new BulkDumpTotalVo()));
        bulkJoongangArticle.getContentHtml().setData(testString);
        bulkJoongangArticle.processContentTag_ab_related_article();

        final String successString = "before Text middle Text end Text ";
        log.info(bulkJoongangArticle.getContentHtml().toString());
        assertEquals(bulkJoongangArticle.getContentHtml().toString(), successString);
    }

    @Test
    public void processContentCyworld() {
        final String testString = "before Text " +
                "<div class=\"image\"><img alt=\"기사 이미지\" data-src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image01.jpg\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image01.jpg\"  data-type=\"article\" ><span class=\"mask\"></span></div></div>　<br> <br>타오 [사진 웨이보 영상 캡처]" +
                "<div class=\"tag_vod\" data-id=\"https://www.youtube.com/embed/SfQNwPK5PWM\" data-service=\"youtube\" data-thumPath=\"\"        data-old-type=\"\" ></div>" +
                "middle Text " +
                "<div class=\"image\"><img alt=\"기사 이미지\" data-src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image02.jpg\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image02.jpg\"  data-type=\"article\" ><span class=\"mask\"></span></div></div>　<br>그룹 " +
                "<div class=\"tag_vod\" data-id=\"https://www.youtube.com/embed/SfQNwPK5PWM\" data-service=\"youtube\" data-thumPath=\"\"        data-old-type=\"\" ></div>" +
                "end Text ";

        BulkJoongangArticle bulkJoongangArticle = new BulkJoongangArticle(new TotalVo<BulkDumpTotalVo>(new BulkDumpTotalVo()));
        bulkJoongangArticle.getContentHtml().setData(testString);
        bulkJoongangArticle.processContentCyworld();

        log.info(bulkJoongangArticle.getContentHtmlCyworld().toString());
    }

    @Test
    public void processContentNate() {
        final String testString = "before Text " +
                "<div class=\"image\"><img alt=\"기사 이미지\" data-src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image01.jpg\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image01.jpg\"  data-type=\"article\" ><span class=\"mask\"></span></div></div>　<br> <br>타오 [사진 웨이보 영상 캡처]" +
                "<div class=\"tag_vod\" data-id=\"https://www.youtube.com/embed/SfQNwPK5PWM\" data-service=\"youtube\" data-thumPath=\"\"        data-old-type=\"\" ></div>" +
                "middle Text " +
                "<div class=\"image\"><img alt=\"기사 이미지\" data-src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image02.jpg\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image02.jpg\"  data-type=\"article\" ><span class=\"mask\"></span></div></div>　<br>그룹 " +
                "<div class=\"tag_vod\" data-id=\"https://www.youtube.com/embed/SfQNwPK5PWM\" data-service=\"youtube\" data-thumPath=\"\"        data-old-type=\"\" ></div>" +
                "end Text ";

        BulkJoongangArticle bulkJoongangArticle = new BulkJoongangArticle(new TotalVo<BulkDumpTotalVo>(new BulkDumpTotalVo()));
        bulkJoongangArticle.getContentHtml().setData(testString);
        bulkJoongangArticle.processContentNate();

        log.info(bulkJoongangArticle.getContentHtmlNate().toString());
    }

    @Test
    public void processContentDaum() {
        final String testString = "before Text " +
                "<div class=\"image\"><img alt=\"기사 이미지\" data-src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image01.jpg\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image01.jpg\"  data-type=\"article\" ><span class=\"mask\"></span></div></div>　<br> <br>타오 [사진 웨이보 영상 캡처]" +
                "<div class=\"tag_vod\" data-id=\"https://www.youtube.com/embed/SfQNwPK5PWM\" data-service=\"youtube\" data-thumPath=\"\"        data-old-type=\"\" ></div>" +
                "middle Text " +
                "<table class=\"ab_table\">\t<tbody>\t\t<tr>\t\t\t<td><b>브랜드</b></td>\t\t\t<td><b>제조사</b></td>\t\t</tr>\t\t<tr>\t\t\t<td>003</td>\t\t\t<td>오카모토</td>\t\t</tr>\t</tbody></table>" +
                "<iframe frameborder=\"0\" height=\"360px\" scrolling=\"no\" src=\"http://videofarm.daum.net/controller/video/viewer/Video.html?vid=s2999EVEVEO3KsoeG0e1Em1&amp;play_loc=undefined\" title=\"쉽지 않은 동메달 그랜드 슬램, 박은철 선수 통한 &#91;우리동네 예체능&#93; 166회 20160726\" width=\"640px\"></iframe>" +
                "<div class=\"tag_photobundle\"> <img alt=\"기사 이미지\" caption=\"4월18일\" index=\"0\" iscoverimage=\"false\" link=\"\" linktarget=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201707/11/image01.jpg\" wrappercss=\"photo_center\" wrapperwidth=\"580px\"/>  </div>" +
                "<iframe class=\"ab_map\" frameborder=\"0\" height=\"480\" src=\"https://www.google.com/maps/embed/v1/place?q=미국령+군소+제도+팔미라+아톨+팔미라 아톨&key=AIzaSyCV7E_6L86jxQhEdkYL4umEfgWG8cjxTqw\" width=\"100%\"></iframe>" +
                "<div class=\"tag_vod\" data-id=\"6219382066001?ro=1&rc=2\" data-service=\"ovp\" data-thumPath=\"\"        data-old-type=\"ooyala\" ></div>" +
                "end Text ";

        String tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(testString, "class=\"ab_photo photo_center", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px;\"", 50 );
        tmpContentHtml = tmpContentHtml.replaceAll("(?i)<(\\s)*iframe(\\s)*class(\\s)*=(\\s)*\"ab_map\".*?<(\\s)*/(\\s)*iframe(\\s)*>", "");

        Map<String, String> daumVideoMap = new HashMap<>();
        Map<String, String> daumVideoKakaoTvMap = new HashMap<>();
        Map<String, String> daumPhotoBundleMap = new HashMap<>();
        Map<String, String> daumImageMap = new HashMap<>();
        bulkJoongangArticle.processContentDaumBefore(daumVideoMap, daumVideoKakaoTvMap, daumPhotoBundleMap, daumImageMap);

        log.info("before ==> {}", bulkJoongangArticle.getContentHtmlDaum().toString());

        bulkJoongangArticle.processContentDaumAfter(daumVideoMap, daumVideoKakaoTvMap, daumPhotoBundleMap, daumImageMap);

        log.info("after ==> {}", bulkJoongangArticle.getContentHtmlDaum().toString());
    }

    @Test
    public void processContentZum() {
        final String testString = "before Text " +
                "<div class=\"image\"><img alt=\"기사 이미지\" data-src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image01.jpg\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201509/21/image01.jpg\"  data-type=\"article\" ><span class=\"mask\"></span></div></div>　<br> <br>타오 [사진 웨이보 영상 캡처]" +
                "<div class=\"tag_vod\" data-id=\"https://www.youtube.com/embed/SfQNwPK5PWM\" data-service=\"youtube\" data-thumPath=\"\"        data-old-type=\"\" ></div>" +
                "middle Text " +
                "<table class=\"ab_table\">\t<tbody>\t\t<tr>\t\t\t<td><b>브랜드</b></td>\t\t\t<td><b>제조사</b></td>\t\t</tr>\t\t<tr>\t\t\t<td>003</td>\t\t\t<td>오카모토</td>\t\t</tr>\t</tbody></table>" +
                "<iframe frameborder=\"0\" height=\"360px\" scrolling=\"no\" src=\"http://videofarm.daum.net/controller/video/viewer/Video.html?vid=s2999EVEVEO3KsoeG0e1Em1&amp;play_loc=undefined\" title=\"쉽지 않은 동메달 그랜드 슬램, 박은철 선수 통한 &#91;우리동네 예체능&#93; 166회 20160726\" width=\"640px\"></iframe>" +
                "<div class=\"tag_photobundle\"> <img alt=\"기사 이미지\" caption=\"4월18일\" index=\"0\" iscoverimage=\"false\" link=\"\" linktarget=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/201707/11/image01.jpg\" wrappercss=\"photo_center\" wrapperwidth=\"580px\"/>  </div>" +
                "<iframe class=\"ab_map\" frameborder=\"0\" height=\"480\" src=\"https://www.google.com/maps/embed/v1/place?q=미국령+군소+제도+팔미라+아톨+팔미라 아톨&key=AIzaSyCV7E_6L86jxQhEdkYL4umEfgWG8cjxTqw\" width=\"100%\"></iframe>" +
                "<div class=\"tag_vod\" data-id=\"6219382066001?ro=1&rc=2\" data-service=\"ovp\" data-thumPath=\"\"        data-old-type=\"ooyala\" ></div>" +
                "end Text ";

        bulkJoongangArticle.processContentZum();

        log.info(bulkJoongangArticle.getContentHtmlZum().toString());
    }

    @Test
    public void processContentNaverXml_ad_box_article() {
        final TestData testData = new TestData_ab_box_article();
        testData.test( bulkJoongangArticle.processContentNaverXmlTag_ab_box_article(testData.getTestString()) );
    }

    @Test
    public void processContentTag_ab_ds_timeline() {
        final TestData testData = new TestData_ab_ds_timeline();       // = new TestData_ab_ds_timeline2()
        bulkJoongangArticle.getContentHtml().setData(testData.getTestString());
        bulkJoongangArticle.processContentTag_ab_ds_timeline();
        testData.test( bulkJoongangArticle.getContentHtml().getData() );
    }

    @Test
    public void processContent_JHotClick() {
        final TestData testData = new TestData_jhot_click();
        bulkJoongangArticle.setBulkDumpEnvCopyright( new BulkDumpEnvCopyright());
        bulkJoongangArticle.getBulkDumpEnvCopyright().setJhotClick(testData.getTestString());
        bulkJoongangArticle.processContent_JHotClick(10);
    }

    @Test
    public void processContentNaverXmlTag_ab_box_article_eGul() {
        final TestData testData = new TestData_eGul();
        testData.test(
                bulkJoongangArticle.processContentNaverXmlTag_etc(
                bulkJoongangArticle.processContentNaverXmlTag_ab_box_article(
                bulkJoongangArticle.processContentNaverXmlTag_ab_box_article_eGul(testData.getTestString())) ));
    }

    @Test
    public void processContentNaverXmlTag_ab_emphasis() {
        final TestData testData = new TestData_emphasis();

        String tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(testData.getTestString(), "class=\"ab_photo photo_center", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px;\"", 50 );
        tmpContentHtml = tmpContentHtml.replaceAll("(?i)<(\\s)*iframe(\\s)*class(\\s)*=(\\s)*\"ab_map\".*?<(\\s)*/(\\s)*iframe(\\s)*>", "");

        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule( tmpContentHtml, "<p class=\"caption\">", "</p>");
        tmpContentHtml = tmpContentHtml.replace("<h2>", "")
                .replace("</h2>", "");

        testData.test(
                bulkJoongangArticle.processContentNaverXmlTag_etc(
                bulkJoongangArticle.processContentNaverXmlTag_ab_emphasis(tmpContentHtml)));
    }

    @Test
    public void processContentTag_ab_photofix() {
        final TestData testData = new TestData_ab_photofix();

        bulkJoongangArticle.getContentHtml().setData(testData.getTestString());
        bulkJoongangArticle.processContentTag_ab_photofix();

        testData.test(bulkJoongangArticle.getContentHtml().toString());
    }

    @Test
    public void processImageBulkFlag() {
        final TestData testData = new TestData_tag_photobundle();

        String tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(testData.getTestString(), "class=\"ab_photo photo_center", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px;\"", 50 );
        tmpContentHtml = tmpContentHtml.replaceAll("(?i)<(\\s)*iframe(\\s)*class(\\s)*=(\\s)*\"ab_map\".*?<(\\s)*/(\\s)*iframe(\\s)*>", "");

        bulkJoongangArticle.setImageBulkFlag("Y");
        bulkJoongangArticle.getContentHtml().setData(tmpContentHtml);
        bulkJoongangArticle.processImageBulkFlag();

        testData.test(bulkJoongangArticle.getContentHtml().toString());
    }

    @Test
    public void process_ab_photo_center() {
        final TestData testData = new TestData_ab_photo_center();

        String tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(testData.getTestString(), "class=\"ab_photo photo_center", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px;\"", 50 );
        tmpContentHtml = tmpContentHtml.replaceAll("(?i)<(\\s)*iframe(\\s)*class(\\s)*=(\\s)*\"ab_map\".*?<(\\s)*/(\\s)*iframe(\\s)*>", "");
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule( tmpContentHtml, "<p class=\"caption\">", "</p>");

        bulkJoongangArticle.setImageBulkFlag("Y");
        bulkJoongangArticle.getContentHtml().setData(tmpContentHtml);
        bulkJoongangArticle.processImageBulkFlag();

        testData.test(bulkJoongangArticle.getContentHtml().toString());
    }

    @Test
    public void processContentNaverXmlTag_etc() {
        final TestData testData = new TestData_ab_sub_heading();

        String tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(testData.getTestString(), "class=\"ab_photo photo_center", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px;\"", 50 );
        tmpContentHtml = tmpContentHtml.replaceAll("(?i)<(\\s)*iframe(\\s)*class(\\s)*=(\\s)*\"ab_map\".*?<(\\s)*/(\\s)*iframe(\\s)*>", "");

        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule( tmpContentHtml, "<p class=\"caption\">", "</p>");
        tmpContentHtml = tmpContentHtml.replace("<h2>", "")
                                       .replace("</h2>", "");

        testData.test(bulkJoongangArticle.processContentNaverXmlTag_etc(tmpContentHtml) );
    }

    @Test
    public void processContentTag_tag_photoslide() {
        final TestData testData = new TestData_tag_photoslide();

        bulkJoongangArticle.getContentHtml().setData(testData.getTestString());
        bulkJoongangArticle.processContentTag_tag_photoslide();

        testData.test(bulkJoongangArticle.getContentHtml().toString());
    }

    @Test
    public void process_ab_photo_left() {
        final TestData testData = new TestData_ab_photo_left();

        String tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(testData.getTestString(), "class=\"ab_photo photo_center", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px;\"", 50 );
        tmpContentHtml = tmpContentHtml.replaceAll("(?i)<(\\s)*iframe(\\s)*class(\\s)*=(\\s)*\"ab_map\".*?<(\\s)*/(\\s)*iframe(\\s)*>", "");
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule( tmpContentHtml, "<p class=\"caption\">", "</p>");

        bulkJoongangArticle.setImageBulkFlag("Y");
        bulkJoongangArticle.getContentHtml().setData(tmpContentHtml);
        bulkJoongangArticle.processImageBulkFlag();

        testData.test(bulkJoongangArticle.getContentHtml().toString());
    }

    @Test
    public void process_ab_photo_right() {
        final TestData testData = new TestData_ab_photo_right();

        String tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(testData.getTestString(), "class=\"ab_photo photo_center", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px;\"", 50 );
        tmpContentHtml = tmpContentHtml.replaceAll("(?i)<(\\s)*iframe(\\s)*class(\\s)*=(\\s)*\"ab_map\".*?<(\\s)*/(\\s)*iframe(\\s)*>", "");
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule( tmpContentHtml, "<p class=\"caption\">", "</p>");

        bulkJoongangArticle.setImageBulkFlag("Y");
        bulkJoongangArticle.getContentHtml().setData(tmpContentHtml);
        bulkJoongangArticle.processImageBulkFlag();

        testData.test(bulkJoongangArticle.getContentHtml().toString());
    }

    @Test
    public void processContentTag_tag_interview() {
        final TestData testData = new TestData_tag_interview();

        bulkJoongangArticle.getContentHtml().setData(testData.getTestString());
        bulkJoongangArticle.processContentTag_tag_interview();

        testData.test(bulkJoongangArticle.getContentHtml().toString());
    }

    @Test
    public void processContentNaverXml() {
        final TestData testData = new TestData_tag_quotation();

        String tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(testData.getTestString(), "class=\"ab_photo photo_center", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, " wrappercss=\"photo_center\"", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "style=\"width:", "px;\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px\"", 50 );
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule(tmpContentHtml, "wrapperwidth=", "px;\"", 50 );
        tmpContentHtml = tmpContentHtml.replaceAll("(?i)<(\\s)*iframe(\\s)*class(\\s)*=(\\s)*\"ab_map\".*?<(\\s)*/(\\s)*iframe(\\s)*>", "");
        tmpContentHtml = BulkTagUtil.ripTagWithOrderRule( tmpContentHtml, "<p class=\"caption\">", "</p>");


        bulkJoongangArticle.getContentHtml().setData(tmpContentHtml);

        bulkJoongangArticle.processContentNaverXml(tmpContentHtml);

        testData.test(bulkJoongangArticle.getContentHtmlNaver().toString());
    }
}