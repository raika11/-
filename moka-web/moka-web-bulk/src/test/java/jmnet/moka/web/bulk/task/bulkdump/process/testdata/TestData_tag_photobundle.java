package jmnet.moka.web.bulk.task.bulkdump.process.testdata;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.testdata
 * ClassName : TestData_tag_photobundle
 * Created : 2021-02-15 015 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-15 015 오후 2:14
 */
public class TestData_tag_photobundle extends TestData{
    @Override
    public String getTestString() {
        return "<div class=\"tag_photobundle\"><img alt=\"기아차 4세대 카니발. 사진 기아차\" caption=\"기아차 4세대 카니발. 사진 기아차\" index=\"0\" iscoverimage=\"false\" link=\"\" linktarget=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202006/24/e58ab96b-a3e7-43b8-a4cc-89dd579f4d6c.jpg\" wrappercss=\"photo_center\" wrapperwidth=\"580px\"/><img alt=\"기아차 4세대 카니발. 사진 기아차\" caption=\"기아차 4세대 카니발. 사진 기아차\" index=\"1\" iscoverimage=\"false\" link=\"\" linktarget=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202006/24/9670059e-9417-4dc9-82fc-197b078d7afc.jpg\" wrappercss=\"photo_center\" wrapperwidth=\"580px\"/></div>  기아차가 6년 만에 완전변경 모델을 선보일 4세대 카니발의 외장 디자인을 24일 공개했다. 전통적인 미니밴에 '웅장한 볼륨감'을 담았다. &nbsp;  <br/>   &nbsp;  <br/>   신형 카니발은 더 커졌다. 4세대 카니발은 전장 5155㎜, 전폭 1995㎜, 전고 1740㎜다. 기존 모델보다 전장 40㎜, 전폭 10㎜가 늘었다. 축간거리(앞바퀴 중심과 뒷바퀴 중심 사이의 거리)는 3090㎜로 기존보다 30㎜ 늘었다. 축간거리는 '승객 거주공간'으로 불린다. 현대차 관계자는 \"축간 거리가 늘며 레그룸(다리 공간)을 포함해 전반적으로 편안한 승객 거주공간을 제공할 것\"이라고 말했다.&nbsp;&nbsp;&nbsp;  <br/> <div class=\"tag_photobundle\"><img alt=\"기아차 4세대 카니발. 사진 기아차\" caption=\"기아차 4세대 카니발. 사진 기아차\" index=\"0\" iscoverimage=\"false\" link=\"\" linktarget=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202006/24/d13b5ae9-a535-4686-ad74-5325d623b6de.jpg\" wrappercss=\"photo_center\" wrapperwidth=\"580px\"/><img alt=\"기아차 4세대 카니발. 사진 기아차\" caption=\"기아차 4세대 카니발. 사진 기아차\" index=\"1\" iscoverimage=\"false\" link=\"\" linktarget=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202006/24/d177ff46-3935-4ccc-8e59-f4bb6133d123.jpg\" wrappercss=\"photo_center\" wrapperwidth=\"580px\"/></div>";
    }

    @Override
    public String getSuccessString() {
        return "<div class=\"tag_photobundle\"><img alt=\"기아차 4세대 카니발. 사진 기아차\" caption=\"기아차 4세대 카니발. 사진 기아차\" index=\"0\" iscoverimage=\"false\" link=\"\" linktarget=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202006/24/e58ab96b-a3e7-43b8-a4cc-89dd579f4d6c.jpg\"/><img alt=\"기아차 4세대 카니발. 사진 기아차\" caption=\"기아차 4세대 카니발. 사진 기아차\" index=\"1\" iscoverimage=\"false\" link=\"\" linktarget=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202006/24/9670059e-9417-4dc9-82fc-197b078d7afc.jpg\"/></div>  기아차가 6년 만에 완전변경 모델을 선보일 4세대 카니발의 외장 디자인을 24일 공개했다. 전통적인 미니밴에 '웅장한 볼륨감'을 담았다.    \n"
                + "      \n"
                + "   신형 카니발은 더 커졌다. 4세대 카니발은 전장 5155㎜, 전폭 1995㎜, 전고 1740㎜다. 기존 모델보다 전장 40㎜, 전폭 10㎜가 늘었다. 축간거리(앞바퀴 중심과 뒷바퀴 중심 사이의 거리)는 3090㎜로 기존보다 30㎜ 늘었다. 축간거리는 '승객 거주공간'으로 불린다. 현대차 관계자는 \"축간 거리가 늘며 레그룸(다리 공간)을 포함해 전반적으로 편안한 승객 거주공간을 제공할 것\"이라고 말했다.     \n"
                + " <div class=\"tag_photobundle\"><img alt=\"기아차 4세대 카니발. 사진 기아차\" caption=\"기아차 4세대 카니발. 사진 기아차\" index=\"0\" iscoverimage=\"false\" link=\"\" linktarget=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202006/24/d13b5ae9-a535-4686-ad74-5325d623b6de.jpg\"/><img alt=\"기아차 4세대 카니발. 사진 기아차\" caption=\"기아차 4세대 카니발. 사진 기아차\" index=\"1\" iscoverimage=\"false\" link=\"\" linktarget=\"\" src=\"https://pds.joins.com/news/component/htmlphoto_mmdata/202006/24/d177ff46-3935-4ccc-8e59-f4bb6133d123.jpg\"/></div>";
    }

    @Override
    public String testPreProcess(String targetText) {
        return targetText.replace("<br/>", "\n")
                         .replace("<br>", "\n")
                         .replace("&amp;", "&")
                         .replace("&nbsp;", " ");
    }
}
