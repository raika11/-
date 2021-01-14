package jmnet.moka.web.rcv.task.jamxml;

import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.jamxml.process.JamXmlProcess;
import jmnet.moka.web.rcv.task.jamxml.process.XmlGenProcess;
import jmnet.moka.web.rcv.task.jamxml.service.JamXmlService;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.CategoryVo;
import jmnet.moka.web.rcv.taskinput.FileTaskInput;
import jmnet.moka.web.rcv.taskinput.FileTaskInputData;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task
 * ClassName : JamXMLRcvTask
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 4:15
 */
@Slf4j
public class JamXmlTask extends Task<FileTaskInputData<JamArticleTotalVo, JamArticleVo>> {
    private String sourceCode;
    private boolean previousCanLoad = true;

    public JamXmlTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        return new FileTaskInput<>(JamArticleTotalVo.class, JamArticleVo.class);
    }

    @Override
    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super.load(node, xu);
        this.sourceCode = xu.getString(node, "./@sourceCode", "");
        if ( McpString.isNullOrEmpty(this.sourceCode ) ) {
            throw new RcvException("sourceCode 환경 값 설정이 잘못되었습니다.");
        }
    }

    @Override
    protected boolean canLoadTask() {
        final JamXmlService jamXmlService = getTaskManager().getJamXmlService();
        final boolean canLoad = jamXmlService.canLoadJamXmlRcvTask( this.sourceCode );
        if( !canLoad ) {
            if(this.previousCanLoad) {
                log.info("sourceCode {}는 Loading 이 되지 않는 sourceCode 입니다.", this.sourceCode);
                this.previousCanLoad = false;
            }
        }
        else{
            if(!this.previousCanLoad) {
                log.info("sourceCode {} Loading 시작 !!", this.sourceCode);
                this.previousCanLoad = true;
            }
        }
        return canLoad;
    }

    @Override
    protected boolean doVerifyData(FileTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData) {
        final JamArticleTotalVo articleTotal = taskInputData.getTotalData();
        if (articleTotal == null) {
            log.error("{} {} : XML 파싱 에러, JamArticleTotalVo를 생성할 수 없습니다.", getTaskName(), taskInputData.getFile());
            return false;
        }
        articleTotal.setArtHistoryStep(0);

        final JamArticleVo article = articleTotal.getMainData();
        if (article == null) {
            articleTotal.logError("{} {} : 정상적인 XML 파일이 아닙니다.", getTaskName(), taskInputData.getFile());
            return false;
        }

        if (McpString.isNullOrEmpty(article .getIud())) {
            articleTotal.logError("{} {} : 정상적인 XML 파일이 아닙니다. : iud flag 없음", getTaskName(), taskInputData.getFile());
            return false;
        }

        if (McpString.isNullOrEmpty(article .getTitle())) {
            articleTotal.logError("{} {} : 정상적인 XML 파일이 아닙니다. : title 없음", getTaskName(), taskInputData.getFile());
            return false;
        }

        if (article.getCategoies().size() == 0) {
            articleTotal.logError("{} {} : 정상적인 XML 파일이 아닙니다. : 분류 코드 없음 없음", getTaskName(), taskInputData.getFile());
            return false;
        }
        return true;
    }

    @Override
    protected void doProcess(FileTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData)
            throws RcvDataAccessException {

        final JamXmlService jamXmlService = getTaskManager().getJamXmlService();
        final JamArticleTotalVo articleTotal = taskInputData.getTotalData();
        final JamArticleVo article = articleTotal.getMainData();

        articleTotal.logInfo( "{} 파일 [{}] {} [{}]-{} 시작", getTaskName(), taskInputData.getFile().getName(), article.getIud(), article.getTitle() );

        /*
        //        int sourceCode = this.sourceCode;
        //        switch (this.sourceCode){
        //            case 6: sourceCode = 4;break;
        //            case 31: sourceCode = 40;break;
        //            case 32: sourceCode = 54;break;
        //            case 74: sourceCode = 79;break;
        //        }
         */
        articleTotal.setSourceCode(this.sourceCode);
        articleTotal.setXmlFileNM(taskInputData.getFile().toPath().getFileName().toString());


        if(!doProcessSelectMasterCode(articleTotal, articleTotal.getMainData(), jamXmlService)) {
            articleTotal.logError(" {} 중앙일보 분류코드에 없는 코드가 넘어옴,  doProcessSelectMasterCode Error", getTaskName());
            return;
        }

        articleTotal.setArtHistoryStep(1);
        jamXmlService.insertReceiveJobStep(articleTotal, "");
        articleTotal.setArtHistoryStep(2);

        // 기존 NewNewsDB..article Database 등록 모듈.. 현재는 이미지 처리 작업 만 한다.
        JamXmlProcess.doProcess(taskInputData, articleTotal, getTaskManager() );

        // 기존 XmlGenProcess
        XmlGenProcess.doProcess( taskInputData, articleTotal, getTaskManager());

        taskInputData.setSuccess( true );

        articleTotal.logInfo( "{} 파일 [{}] {} [{}]-{} 완료", getTaskName(), taskInputData.getFile().getName(), article.getIud(), article.getTitle() );
    }

    private boolean doProcessSelectMasterCode(JamArticleTotalVo articleTotal, JamArticleVo article, JamXmlService jamXmlService)
    {
        //noinspection LoopStatementThatDoesntLoop,ConstantConditions
        do {
            articleTotal.getMasterCodeList().clear();
            if( article.getCategoies().size() == 0 )
                break;
            for(CategoryVo category : article.getCategoies() ) {
                articleTotal.setCurContCode(category.getCode());
                articleTotal.setCurMasterCode(null);
                jamXmlService.selectMasterCodeByContCode(articleTotal);
                if (McpString.isNullOrEmpty(articleTotal.getCurMasterCode()))
                    continue;
                articleTotal.getMasterCodeList().add(articleTotal.getCurMasterCode());
            }
            if( article.getCategoies().size() == 0 )
                break;
            return true;
        }while( false );

        return false;
    }

    @Override
    protected void doAfterProcess(FileTaskInputData<JamArticleTotalVo, JamArticleVo> taskInputData)
            throws RcvDataAccessException, InterruptedException {
        super.doAfterProcess(taskInputData);

        taskInputData.doAfterProcess();

        final JamXmlService jamXmlService = getTaskManager().getJamXmlService();
        final JamArticleTotalVo articleTotal = taskInputData.getTotalData();
        if( articleTotal != null ) {
            if (taskInputData.isSuccess())
                jamXmlService.insertReceiveJobStep(articleTotal, "");
            else {
                final JamArticleVo article = articleTotal.getMainData();
                if(article != null && !McpString.isNullOrEmpty(article.getIud())) {
                    jamXmlService.insertReceiveJobStep(articleTotal, articleTotal.getErrorMessageList());
                    getTaskManager().sendErrorSMS(String.format("[JamRecv] XML 처리 오류 [%s]", taskInputData.getFile()));
                }
            }
        }
    }
}

