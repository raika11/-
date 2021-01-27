package jmnet.moka.web.rcv.task.jamxml.process;

import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.base.TaskManager;
import jmnet.moka.web.rcv.task.jamxml.service.JamXmlService;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemVo;
import jmnet.moka.web.rcv.taskinput.FileXmlTaskInputData;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml
 * ClassName : JamXmlProcess
 * Created : 2020-12-04 004 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-04 004 오후 4:07
 */
public class JamXmlProcess {
    public static void doProcess(FileXmlTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData, JamArticleTotalVo articleTotal, TaskManager taskManager)
            throws RcvDataAccessException {

        final JamArticleVo article = articleTotal.getMainData();

        if (!article.getMediaCode().getValue().equals(articleTotal.getSourceCode())) {
            article.getMediaCode().setValue(articleTotal.getSourceCode());
        }

        final String operation = article.getIud().trim();
        switch (operation) {
            case "I":
            case "U": {
                doProcess_InsertUpdate( taskInputData, articleTotal, taskManager );
                break;
            }
        }
    }

    private static void doProcess_InsertUpdate(FileXmlTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData, JamArticleTotalVo articleTotal,
            TaskManager taskManager) {
        final JamArticleVo article = articleTotal.getMainData();
        final JamXmlService jamXmlService = taskManager.getJamXmlService();

        //스타기자 타입 (커버:Z, 와이드:Y, 인터뷰:X, 갤러리:W, 영상:V)이고, 스타기자인 경우 첫번째 이미지 썸네일을 생성하고 워터마크를 적용한다.
        if (("Z,Y,X,W,V").contains(article.getTmplType())) {
            if (!JamXmlProcessHelper.doProcess_StarImage(taskInputData, articleTotal, taskManager, jamXmlService)) {
                articleTotal.logError("  스타 기자 이미지 처리 에러  doProcess_StarImage Error");
                throw new RcvDataAccessException("스타 기자 이미지 처리 에러");
            }
        }

        for (ItemVo item : article.getContents().getItems()) {
            final String type = item.getType().toUpperCase();
            JamXmlProcessHelper.doProcess_ItemsPreprocess( taskInputData, articleTotal, taskManager, type, item );
        }

        //***************************************************************************************************
        //기사 본문에 pds, news 수정
        //네이버, 인스타그램 이전 경로일 경우 변경
        article.getContents()
               .setBody(article.getContents()
                               .getBody()
                               .replace("http://pds.joins.com", "https://pds.joins.com")
                               .replace("http://news.joins.com", "https://news.joins.com")
                               .replace("http://mnews.joins.com", "https://mnews.joins.com")
                               .replace("//tv.naver.com/v/", "//tv.naver.com/embed/")
                               .replace("//www.instagram.com/tv/", "//www.instagram.com/p/"));
        //***************************************************************************************************
    }
}
