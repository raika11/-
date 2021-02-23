package jmnet.moka.web.rcv.task.artafteriud;

import java.util.Map;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.artafteriud.service.ArtAfterIudService;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.jamxml.service.XmlGenService;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.taskinput.DBTaskInput;
import jmnet.moka.web.rcv.taskinput.DBTaskInputData;
import jmnet.moka.web.rcv.util.RcvUtil;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.artafteriud
 * ClassName : ArtAfterIudTask
 * Created : 2020-12-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-10 010 오전 9:40
 */
@Slf4j
public class ArtAfterIudTask extends Task<DBTaskInputData> {
    public ArtAfterIudTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput(){
        final ArtAfterIudService artAfterIudService = getTaskManager().getArtAfterIudService();
        return new DBTaskInput() {
            @Override
            public TaskInputData getTaskInputData() {
                return DBTaskInputData.newDBTaskInputData(artAfterIudService.getUspArticleIudList());
            }
        };
    }

    @Override
    protected boolean doVerifyData(DBTaskInputData taskInputData) {
        return taskInputData.getInputData().size() > 0;
    }

    @Override
    protected void doProcess(DBTaskInputData taskInputData)
            throws RcvDataAccessException {

        for( Map<String, Object> map : taskInputData.getInputData() ) {
            doProcessSub( map );
        }
    }

    private void doProcessSub( Map<String, Object> map) {
        final XmlGenService xmlGenService = getTaskManager().getXmlGenService();
        final ArtAfterIudService artAfterIudService = getTaskManager().getArtAfterIudService();

        final JamArticleVo article = new JamArticleVo();
        article.initMembers();
        final JamArticleTotalVo articleTotal = new JamArticleTotalVo(article);
        article.setIud(RcvUtil.getMapStringData(map,"IUD" ));
        if(McpString.isNullOrEmpty(article.getIud()))
            return;

        articleTotal.setTotalId( RcvUtil.parseInt(RcvUtil.getMapStringData(map,"IUD_TOTAL_ID" ) ));
        if( articleTotal.getTotalId() == 0 )
            return;

        article.getId().setValue(RcvUtil.getMapStringData(map,"JAM_ID" ));
        articleTotal.setRid( RcvUtil.getMapStringData(map,"RID" ) );
        articleTotal.setSourceCode( RcvUtil.getMapStringData(map,"SOURCE_CODE" ) );
        article.setPcTitle( RcvUtil.getMapStringData(map,"ART_TITLE" ) );

        switch ( article.getIud() ){
            case "U":
                articleTotal.logInfo( "{} 기사 totalId=[{}] 수동 Update 시작", getTaskName(), articleTotal.getTotalId() );
                xmlGenService.afterProcessArticleData(articleTotal);
                articleTotal.logInfo( "{} 기사 totalId=[{}] 수동 Update 완료", getTaskName(), articleTotal.getTotalId() );
                break;
            case "E":
                articleTotal.logInfo( "{} 기사 totalId=[{}] 수동 Stop 시작", getTaskName(), articleTotal.getTotalId() );
                xmlGenService.stopArticleData(articleTotal);
                articleTotal.logInfo( "{} 기사 totalId=[{}] 수동 Stop 완료", getTaskName(), articleTotal.getTotalId() );
                break;
            case "D":
                articleTotal.logInfo( "{} 기사 totalId=[{}] 수동 삭제 시작", getTaskName(), articleTotal.getTotalId() );
                xmlGenService.deleteArticleData(articleTotal);
                articleTotal.logInfo( "{} 기사 totalId=[{}] 수동 삭제 완료", getTaskName(), articleTotal.getTotalId() );
                break;
        }

        if( RcvUtil.parseInt(articleTotal.getRid()) > 0 ){
            artAfterIudService.insertUpaCpRcvArtHist(map);
        }
        else{
            artAfterIudService.insertUpaJamRcvArtHistSucc(map);
        }
        artAfterIudService.deleteUspArticleIudList(map);
    }
}
