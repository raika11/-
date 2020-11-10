package jmnet.moka.web.wms.mvc.jpod;

import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.JpodMemberTypeCode;
import jmnet.moka.core.tps.common.code.JpodTypeCode;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodChannel;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeRelArt;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeRelArtPK;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodKeyword;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodMember;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodChannelRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodEpisodeRelArtRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodEpisodeRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodKeywordRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodMemberRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class JpodTest {

    @Autowired
    private JpodChannelRepository jpodChannelRepository;

    @Autowired
    private JpodEpisodeRepository jpodEpisodeRepository;

    @Autowired
    private JpodKeywordRepository jpodKeywordRepository;

    @Autowired
    private JpodEpisodeRelArtRepository jpodEpisodeRelArtRepository;

    @Autowired
    private JpodMemberRepository jpodMemberRepository;



    @Test
    public void insertJpodChannel() {
        JpodChannel channel = JpodChannel
                .builder()
                .chnlNm("윤석만의 인간혁명")
                .chnlMemo(
                        "미래가 궁금하다고요? 우리 삶은 어떻게 변하냐고요? 이 모든 호기심을 담았습니다. 역사·철학, 문학·영화, 과학·예술을 넘나드는 지식과 교양의 버라이어티 쇼. 미래인문 전문가 윤석만 기자와 명품 성우 박영재가 함께 만드는 중품격 미래전망 인문학쇼 ‘인간혁명’이 매주 수요일 여러분을 찾아갑니다.")
                .chnlImg("https://pds.joins.com/news/component/htmlphoto_mmdata/201806/27/htm_2018062719533754917.jpg")
                .chnlDy("3")
                .chnlSdt("2018-06-27")
                .chnlEdt("2019-02-10")
                .podtyUrl("https://m.podty.me/cast/183426")
                .chnlImgMob("https://pds.joins.com/news/component/htmlphoto_mmdata/201806/27/htm_2018062719541413251.jpg")
                .podtyChnlSrl(183426)
                .build();

        jpodChannelRepository.save(channel);

        channel = JpodChannel
                .builder()
                .chnlNm("백성호의 리궁수다")
                .chnlMemo(
                        "마음이 더부룩할 때, 몸이 더부룩할 때, 사람 관계가 더부룩할 때 문제를 놓고 이치를 궁리하는 리궁수다! ‘리궁수다’는 크고 작은 일상의 문제를 5명의 집단 통찰로 뚫어갑니다. 백성호 종교담당 기자, 국민주치의 오한진 박사, WHY브랜드 양은경 대표, 글쓰는 사업가 조봉균 작가가 함께 합니다. 나머지 한 명이 누구냐고요? 오늘 ‘리궁수다’를 찾아온 바로 당신입니다. 멘탈헬스 수다방 ‘리궁수다’는 매주 금요일 업데이트 됩니다. \n")
                .chnlSdt("2018-06-27")
                .chnlImg("https://pds.joins.com/news/component/htmlphoto_mmdata/201806/27/htm_2018062719959437148.jpg")
                .podtyUrl("https://m.podty.me/cast/183425")
                .chnlEdt("2019-02-24")
                .chnlDy("5")
                .chnlImgMob("https://pds.joins.com/news/component/htmlphoto_mmdata/201806/27/htm_2018062719106104446.jpg")
                .podtyChnlSrl(183425)
                .build();

        jpodChannelRepository.save(channel);

        channel = JpodChannel
                .builder()
                .chnlNm("오늘도 사러 갑니다")
                .chnlMemo(
                        "잘 사고 싶고, 잘 살고 싶은 언니들의 속 시원한 쇼핑 탐구 보고서. ‘쇼핑’을 테마로 요즘 사람들이 사고 싶어 하는 물건과 이와 관련한 소비 트렌드를 분석해본다. 요즘 어떤 제품이 인기인지, 시장 현황과 트렌드, 적나라한 제품 리뷰와 제품에 얽힌 비하인드 스토리, 쇼핑 꿀팁등 물건과 쇼핑에 관한 모든 것.  \n"
                                + "\n")
                .chnlSdt("2018-08-30")
                .chnlImg("https://pds.joins.com/news/component/htmlphoto_mmdata/201808/27/htm_2018082713163087472.jpg")
                .podtyUrl("http://m.podty.me/cast/185897")
                .chnlDy("4")
                .chnlImgMob("https://pds.joins.com/news/component/htmlphoto_mmdata/201808/27/htm_20180827131639662755.jpg")
                .podtyChnlSrl(185897)
                .build();

        jpodChannelRepository.save(channel);

        channel = JpodChannel
                .builder()
                .chnlNm("번역기도 모르는 진짜 영어")
                .chnlMemo("\"지금 쓰는 영어, 맞게 쓰고 있니?\" \n" + "번역기를 쓰면 편리하지만, 어딘가 모르게 어색했던 경험 있으시죠? 그래서 시작합니다. \n" + "영국 남자가 알려주는 진짜 영어")
                .chnlSdt("2018-11-02")
                .chnlImg("https://pds.joins.com/news/editimg/2018-10-31_5af8523e-1ba1-4ecd-8e3c-9a7a066b1238.jpg")
                .podtyUrl("https://news.joins.com/issue/11123")
                .chnlEdt("2019-12-31")
                .chnlDy("5")
                .chnlImgMob("https://pds.joins.com/news/editimg/2018-10-29_f7c26247-4d9c-451c-adf8-2391144bcb90.jpg")
                .podtyChnlSrl(0)
                .build();

        jpodChannelRepository.save(channel);

        channel = JpodChannel
                .builder()
                .chnlNm("뉴요커가 읽어주는 3분뉴스")
                .chnlMemo("코리아중앙데일리 원어민 에디터가 직접 읽어주는 영어 뉴스. 하루 3분으로 고급 영어를 만나보세요.(영어/한글 동시 제공)")
                .chnlSdt("2019-01-30")
                .chnlImg("https://pds.joins.com/news/component/htmlphoto_mmdata/201902/01/htm_2019020110432834877.jpg")
                .podtyUrl("https://audioclip.naver.com/channels/259")
                .chnlDy("12345")
                .chnlImgMob("https://pds.joins.com/news/component/htmlphoto_mmdata/201901/28/htm_2019012885237408984.png")
                .podtyChnlSrl(0)
                .build();

        jpodChannelRepository.save(channel);

    }

    @Test
    public void insertJpodEpisode() {
        JpodEpisode episode = JpodEpisode
                .builder()
                .chnlSeq(4L)
                .epsdNo("E.01-1")
                .usedYn(MokaConstants.YES)
                .epsdNm("인공지능도 사랑할 수 있을까")
                .epsdMemo("1. ‘이거 재밌네’ 영화 'Her'\n" + "- 시어도어가 사랑에 빠진 인공지능 사만다는 OS로 목소리만 존재.\n" + "- 이혼남 시어도어는 사만다와 데이트, 다른 여성 불러 3자 간 ‘대리 sex’까지.\n"
                        + "- 어느 날 시어도어는 사만다 8316명과 대화 중이며, 641명과 사랑에 빠져 있단 걸 깨달아.\n" + "- 사만다는 시어도어를 사랑한 걸까, 인공지능도 감정을 가질 수 있을까\n" + "\n"
                        + "2. ‘너 이거 알아?’ 인공지능이란\n" + "- 1950년 앨런 튜링의 ‘계산기계와 지능’ 연구 시초.\n" + "- 70년대까지 활발히 연구, 그러나 인간에 기초적인 일도 기계는 못한다는 ‘모라벡의 역설’.\n"
                        + "- 2000년대 이후 다시 불붙은 인공지능 연구, 구글의 알파고까지.\n" + "- 인공지능의 원리 지도학습, 강화학습, 딥러닝.\n" + "\n" + "3. ‘뭐가 문제야’ AI도 사랑할 수 있나\n"
                        + "- AI가 인간의 모든 것을 따라할 수 있는 시대, 감정도 재현 가능할까.\n" + "- 영화 ‘AI'는 꼬마 로봇이 모성을 얻기 위해 노력, 인간과 똑같은 사랑 보여줘.\n"
                        + "- 반면 ‘엑스마키나’는 여성 로봇이 연구자가 자신을 사랑하게 만들어 연구시설 게획 탈출.\n" + "- 감정이란 뭘까, 신경물질의 화학작용일까, 그 이상의 형이상학적 무언가 있을까.\n" + "\n"
                        + "4. ‘더 알고 싶어’\n" + "- 인공지능과 인간의 감정에 대한 내용을 더 알고 싶을 때 도움 되는 책과 영화.")
                .epsdFile("https://podty.gslb.toastoven.net/meta/episode_audio/206871/183426_1530536843478.mp3")
                .playTime("27:39")
                .epsdDate("2018-07-04")
                .podtyEpsdSrl(10214409)
                .jpodType(JpodTypeCode.A)
                .build();
        episode.setRegId("ssc");
        jpodEpisodeRepository.save(episode);
    }

    @Test
    public void insertKeyword() {

        Long chnlSeq = 4L;
        Long episodeSeq = 4L;
        int ordNo = 0;
        String[] keywords = {"윤석만", "이지성", "박영재", "J팟", "팟캐스트", "인공지능", "AI", "지도학습", "강화학습", "딥러닝"};

        for (String keyword : keywords) {
            JpodKeyword jpodKeyword = JpodKeyword
                    .builder()
                    .chnlSeq(chnlSeq)
                    .epsdSeq(episodeSeq)
                    .ordNo(++ordNo)
                    .keyword(keyword)
                    .build();
            jpodKeywordRepository.save(jpodKeyword);
        }

    }

    @Test
    public void insertMember() {
        Long chnlSeq = 4L;
        Long episodeSeq = 4L;

        JpodMember jpodMember = JpodMember
                .builder()
                .chnlSeq(chnlSeq)
                .epsdSeq(episodeSeq)
                .memDiv(JpodMemberTypeCode.EG)
                .memNm("이지성")
                .nickNm("이작가 (이지성 작가)")
                .memMemo("작가")
                .desc("2013년부터 인공지능 공부, 꿈꾸는 다락방 등 450만부 베스트셀러 저자, 차유람의 남편, 두 아이의 아빠.")
                .build();



        jpodMemberRepository.save(jpodMember);
    }

    @Test
    public void insertArticle() {
        Long chnlSeq = 4L;
        Long episodeSeq = 4L;

        int ordNo = 0;

        JpodEpisodeRelArt relArt = JpodEpisodeRelArt
                .builder()
                .id(JpodEpisodeRelArtPK
                        .builder()
                        .chnlSeq(chnlSeq)
                        .epsdSeq(episodeSeq)
                        .totalId(1l)
                        .build())
                .ordNo(++ordNo)
                .relLink("http://news.joins.com/article/22342112")
                .relLinkTarget(MokaConstants.NO)
                .relTitle("[윤석만의 인간혁명]인공지능도 사랑할 수 있을까")
                .build();

        jpodEpisodeRelArtRepository.save(relArt);

        relArt = JpodEpisodeRelArt
                .builder()
                .id(JpodEpisodeRelArtPK
                        .builder()
                        .chnlSeq(chnlSeq)
                        .epsdSeq(episodeSeq)
                        .totalId(21696802L)
                        .build())
                .ordNo(++ordNo)
                .relLink("http://news.joins.com/article/22105061")
                .relLinkTarget("S")
                .relTitle("[윤석만의 인간혁명]4차 혁명시대, 인성이 최고 실력이다")
                .build();
        jpodEpisodeRelArtRepository.save(relArt);

    }


}
