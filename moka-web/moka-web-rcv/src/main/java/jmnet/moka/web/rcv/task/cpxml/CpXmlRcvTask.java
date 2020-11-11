package jmnet.moka.web.rcv.task.cpxml;

import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.task.Task;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.task.base.TaskGroup;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleListVo;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleTotalVo;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpComponentVo;
import jmnet.moka.web.rcv.taskinput.FileTaskInput;
import jmnet.moka.web.rcv.taskinput.FileTaskInputData;
import jmnet.moka.web.rcv.util.RcvUtil;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cpxml
 * ClassName : CpXmlRcvTask
 * Created : 2020-11-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-10 010 오후 4:59
 */
@Slf4j
public class CpXmlRcvTask extends Task<FileTaskInputData<CpArticleTotalVo, CpArticleListVo>> {
    private int idx;
    private String sourceCode;

    public CpXmlRcvTask(TaskGroup parent, Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super(parent, node, xu);
    }

    @Override
    protected TaskInput initTaskInput() {
        return new FileTaskInput<>(CpArticleTotalVo.class, CpArticleListVo.class);
    }

    @Override
    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        super.load(node, xu);

        this.idx = RcvUtil.ParseInt(xu.getString(node, "./@idx", ""));
        if (this.idx == 0) {
            throw new RcvException("idx 환경 값 설정이 잘못되었습니다.");
        }

        this.sourceCode = xu.getString(node, "./@sourceCode", "");
        if (McpString.isNullOrEmpty(this.sourceCode)) {
            throw new RcvException("sourceCode 환경 값 설정이 잘못되었습니다.");
        }
    }

    @Override
    protected boolean doVerifyData(FileTaskInputData<CpArticleTotalVo, CpArticleListVo> taskInputData) {
        final CpArticleTotalVo cpArticleTotalVo = taskInputData.getTotalData();
        if (cpArticleTotalVo == null) {
            log.error("cp ArticleTotalVo를 생성할 수 없습니다.");
            return false;
        }

        final CpArticleListVo artcleList = cpArticleTotalVo.getMainData();

        if (artcleList == null) {
            cpArticleTotalVo.logError("정상적인 XML 파일이 아닙니다. {}", taskInputData.getFile());
            return false;
        }

        if (artcleList.getArticles() == null || artcleList
                .getArticles()
                .size() == 0) {
            cpArticleTotalVo.logError("처리할 Article이 없는 XML 파일입니다. {}", taskInputData.getFile());
            return false;
        }

        return true;
    }

    @Override
    protected void doProcess(FileTaskInputData<CpArticleTotalVo, CpArticleListVo> taskInputData)
            throws RcvDataAccessException {
        final CpArticleTotalVo cpArticleTotalVo = taskInputData.getTotalData();

        cpArticleTotalVo.setSourceCode(this.sourceCode);

        final CpArticleListVo artcleList = cpArticleTotalVo.getMainData();
        for (CpArticleVo article : artcleList.getArticles()) {
            cpArticleTotalVo.setCurArticle(article);
            article.doReplaceInsertData( this.sourceCode );
            doProcessChild(taskInputData, cpArticleTotalVo);
        }
    }

    private void doProcessChild(FileTaskInputData<CpArticleTotalVo, CpArticleListVo> taskInputData, CpArticleTotalVo cpArticleTotalVo)
            throws RcvDataAccessException {

        final CpArticleVo article = cpArticleTotalVo.getCurArticle();

        for(CpComponentVo componet : article.getComponents() ) {
            if( componet.getType().compareTo("I") != 0 )
                continue;
            if( McpString.isNullOrEmpty( componet.getUrl()))
                continue;
        }


        // 외부 이미지 다운로드
        //array(sComponentType, sComponentUrl, sComponentWidth, sComponentHeight, sComponentDesc, sComponentPlayTime, sComponentObjId))

        /*
        For nTmpIdx=1 To oComponent.Count
        sTmpCompName = "Component_" & CStr(nTmpIdx)
        If UCase(oComponent.Item(sTmpCompName)(0)) = "I" And Len(Trim(oComponent.Item(sTmpCompName)(1))) > 0 Then
            bDownloadImage = False
            If sReceiveImgYN = "Y" Then '로컬이미지 다운로드(FTP에 이미지파일도 함께 올려주는 경우)
                sArticleImageTmpPath = sCpReceiveWebPath	'cp receive 폴더로 경로 설정
                sDownImageName = Replace(oComponent.Item(sTmpCompName)(1), Left(oComponent.Item(sTmpCompName)(1), InStrRev(oComponent.Item(sTmpCompName)(1), "\")), "")
                bDownloadImage = True
            Else
                sArticleImageTmpPath = sImageUploadTmpUrl & sTempVar & "/"	'다운로드해서 저장할 템프디렉토리 경로 설정
                '맥심(maxim)같은 경우
                If InStr(oComponent.Item(sTmpCompName)(1), "=") > 0 Then
                    sDownImageName = Replace(oComponent.Item(sTmpCompName)(1), Left(oComponent.Item(sTmpCompName)(1), InStrRev(oComponent.Item(sTmpCompName)(1), "=")), "")
                    If InStr(sDownImageName, ".") <= 0 Then
                        sDownImageName = sDownImageName & ".jpg"
                    End If
                Else
                    sDownImageName = Replace(oComponent.Item(sTmpCompName)(1), Left(oComponent.Item(sTmpCompName)(1), InStrRev(oComponent.Item(sTmpCompName)(1), "/")), "")
                End If
                bDownloadImage = fnDownloadImage(oComponent.Item(sTmpCompName)(1), Server.MapPath(sArticleImageTmpPath & sDownImageName))	'외부 이미지 로컬에 저장
            End If

            If bDownloadImage = True Then
                sDownImageName = Replace(Replace(replace(Trim(sDownImageName), vbcrlf, ""), vblf, ""), vbcr, "")
                'pds백업서버로 ftp전송
                bTranResult_bak = fnFtpFileUploadNew(IMAGE_BAK_SVR_IP, IMAGE_BAK_SVR_FTP_PORT, IMAGE_BAK_SVR_FTP_ACCOUNT, IMAGE_BAK_SVR_FTP_PASSWORD, true, Server.MapPath(sArticleImageTmpPath & sDownImageName), sArticleImageSavePath & sDownImageName, false)
                'pds서버로 ftp전송
                bTranResult1 = fnFtpFileUploadNew(IMAGE_SVR_IP, IMAGE_SVR_FTP_PORT, IMAGE_SVR_FTP_ACCOUNT, IMAGE_SVR_FTP_PASSWORD, true, Server.MapPath(sArticleImageTmpPath & sDownImageName), sArticleImageSavePath & sDownImageName, true)

                '업로드 오류 발생시 처리.
                '1. 이미지가 올라가기전에 "0"아닌값이 리턴되어 아래 조건에 해당되지 않아서 이미지태그 누락되며, 컴포넌트에도 데이터가 잘못 들어가는 경우
                '2. 실제 ftp업로드가 실패된경우
                bUploadComp = False

                If bTranResult1 = "0" Then
                    bUploadComp = True
                    FileAppend sLogFilePath, "이미지전송:" & nArticleImageServiceUrl & sDownImageName & " == " & bTranResult1 & vbCrLf
                ElseIf Left(bTranResult1, 1) = "2" Then
                    bExistsImage = ExistsWebFile(sImageSvrDomain & nArticleImageServiceUrl & sDownImageName)
                    If bExistsImage = True Then
                        bUploadComp = True
                        FileAppend sLogFilePath, "이미지전송:이미 업로드된 이미지" & vbCrLf
                    Else
                        FileAppend sLogFilePath, "이미지전송:" & nArticleImageServiceUrl & sDownImageName & " == " & bTranResult1 & vbCrLf
                    End If
                Else
                    FileAppend sLogFilePath, "이미지전송:" & bTranResult1 & vbCrLf
                End If

                If bUploadComp = True Then
                    '본문에 이미지태그가 안들어오는 기사들은 상단에 가운데정렬 이미지로 추가한다.
                    If sCpSourceCode = "j4" Then
                        Dim strImageTag
                        strImageTag = "<div><!--@img_tag_s@--><div class=""html_photo_center""><img src=""" & sImageSvrDomain & nArticleImageServiceUrl & sDownImageName & """ />"
                        If Len(Trim(oComponent.Item(sTmpCompName)(4))) > 0 Then
                            strImageTag = strImageTag & "<span class=""rt"">" & oComponent.Item(sTmpCompName)(4) & "</span>"
                        End If
                        strImageTag = strImageTag & "</div><!--@img_tag_e@--></div>"
                        sContents = strImageTag & vbCrLf & sContents
                    Else
                        '본문의 외부 이미지 pds경로로 치환
                        sContents = Replace(sContents, ReplaceInsertData(oComponent.Item(sTmpCompName)(1)), sImageSvrDomain & nArticleImageServiceUrl & sDownImageName)
                    End If
                    'pds경로로 변경
                    aImgTmp = oComponent.Item(sTmpCompName)
                    aImgTmp(1) = nArticleImageServiceUrl & sDownImageName
                    oComponent.Item(sTmpCompName) = aImgTmp
                End If 'If bUploadComp = True Then
            End If 'If bDownloadImage = true Then
        End If 'If UCase(oComponent.Item(sTmpCompName)(0)) = "I" And Len(Trim(oComponent.Item(sTmpCompName)(1))) > 0 Then
    Next
         */

    }

    @Override
    protected void doAfterProcess(FileTaskInputData<CpArticleTotalVo, CpArticleListVo> taskInputData)
            throws RcvDataAccessException {
        super.doAfterProcess(taskInputData);
    }
}
