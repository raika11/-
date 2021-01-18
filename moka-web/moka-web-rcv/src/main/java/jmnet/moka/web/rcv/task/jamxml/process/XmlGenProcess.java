package jmnet.moka.web.rcv.task.jamxml.process;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.base.TaskManager;
import jmnet.moka.web.rcv.task.jamxml.service.XmlGenService;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml.util
 * ClassName : XmlGenProcess
 * Created : 2020-12-04 004 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-04 004 오후 4:13
 */
public class XmlGenProcess {
    public static void doProcess(TaskInputData taskInputData, JamArticleTotalVo articleTotal, TaskManager taskManager)
            throws RcvDataAccessException {
        final JamArticleVo article = articleTotal.getMainData();
        final XmlGenService xmlGenService = taskManager.getXmlGenService();

        if( McpString.isNullOrEmpty(articleTotal.getMainData().getWorkerInfo().getWorkerId()))
            articleTotal.getMainData().getWorkerInfo().setWorkerId("SYSTEM");

        XmlGenComponentManager componentManager = new XmlGenComponentManager(taskInputData, articleTotal, taskManager.getRcvConfiguration());
        final String operation = article.getIud().trim();
        switch (operation) {
            case "I":
            case "U": {
                if( articleTotal.getMasterCodeList().size() == 0 ){
                    throw new RcvDataAccessException( "중앙일보 분류코드에 없는 코드가 넘어옴");
                }
                componentManager.doComponentProcess();

                for( ItemVo item : componentManager.getHpItems() ) {
                    if( !McpString.isNullOrEmpty(item.getArtThumb() ) ) {
                        articleTotal.setArtThumb( item.getArtThumb() );
                        break;
                    }
                }
                xmlGenService.insertUpdateArticleData(articleTotal, componentManager);
                break;
            }
            case "D":
                xmlGenService.deleteArticleData( articleTotal );
                break;
        }
    }
}
