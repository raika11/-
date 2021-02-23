package jmnet.moka.web.bulk.task.bulkdump.process.testdata;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.testdata
 * ClassName : TestData_tag_interview
 * Created : 2021-02-15 015 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-15 015 오후 3:18
 */
public class TestData_tag_interview extends TestData{
    @Override
    public String getTestString() {
        return "<div class=\"tag_interview\"><div class=\"tag_question\">드라마와 현실 스타트업의 분위기, 어떻게 다른가.</div></div>   <div class=\"tag_interview\"><div class=\"tag_answer\">드라마처럼 밝고 아름다운 청춘 로맨스물이 아니다. 출연자들이 언제나 단정하게 나오는데 비현실적이다. 실제론 며칠간 집에 못 가서 머리는 떡져있고 냄새나고 몰골이 말이 아니다. 그래도 대표들 얘기 들어보면 창업 초기를 아름답게 기억하곤 한다. 같은 꿈을 가진 사람들끼리 으쌰으쌰했던 분위기를 그리워하는 것 같다.</div></div>";
    }

    @Override
    public String getSuccessString() {
        return "<div class=\"tag_interview\">\r\n" + "<strong>Q : 드라마와 현실 스타트업의 분위기, 어떻게 다른가.</strong>\r\n"
                + "</div>   <div class=\"tag_interview\"><strong>A :</strong> 드라마처럼 밝고 아름다운 청춘 로맨스물이 아니다. 출연자들이 언제나 단정하게 나오는데 비현실적이다. 실제론 며칠간 집에 못 가서 머리는 떡져있고 냄새나고 몰골이 말이 아니다. 그래도 대표들 얘기 들어보면 창업 초기를 아름답게 기억하곤 한다. 같은 꿈을 가진 사람들끼리 으쌰으쌰했던 분위기를 그리워하는 것 같다.</div>";
    }
}
