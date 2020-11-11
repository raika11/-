package jmnet.moka.web.rcv.task.jamxml;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.exception.RcvDataAccessException;
import jmnet.moka.web.rcv.task.jamxml.mapper.JamXmlRcvMapper;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ReporterVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.TotalBasicInfo;
import jmnet.moka.web.rcv.util.RcvUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml.vo
 * ClassName : JamXmlRcvServiceImpl
 * Created : 2020-11-02 002 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-02 002 오후 2:28
 */
@Service
@Slf4j
public class JamXmlRcvServiceImpl implements JamXmlRcvService {
    private final JamXmlRcvMapper jamXmlRcvMapper;

    public JamXmlRcvServiceImpl(JamXmlRcvMapper jamXmlRcvMapper) {
        this.jamXmlRcvMapper = jamXmlRcvMapper;
    }

    @Override
    public Map<String, String> selectSectCodeByContCode(JamArticleTotalVo jamArticle)
            throws RcvDataAccessException {
        try {
            return jamXmlRcvMapper.selectSectCodeByContCode(jamArticle);
        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }

    @Override
    public List<Map<String, String>> selectIssueSeriesReporter(String tmpRepList, String tmpKwdList)
            throws RcvDataAccessException {
        try {
            Map<String, String> map = new HashMap<>();
            map.put("tmpRepList", tmpRepList);
            map.put("tmpKwdList", tmpKwdList);
            return jamXmlRcvMapper.selectIssueSeriesReporter(map);
        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }

    @Override
    public void insertReceiveJobStep(JamArticleTotalVo jamArticle)
            throws RcvDataAccessException {
        try {
            jamArticle.setArtHistoryStep(0);
            this.jamXmlRcvMapper.insertReceiveJobStep(jamArticle);
        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }

    @Override
    public void updateReceiveJobStep(JamArticleTotalVo jamArticle, int jobSeq, int jobStep)
            throws RcvDataAccessException {
        try {
            jamArticle.setArtHistoryId(jobSeq);
            jamArticle.setArtHistoryStep(jobStep);
            this.jamXmlRcvMapper.updateReceiveJobStep(jamArticle);
        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }

    @Override
    public void doInsertUpdateArticleData(JamArticleTotalVo jamArticleTotalVo)
            throws RcvDataAccessException {

        if (jamArticleTotalVo
                .getMainData()
                .getMediaCode()
                .getValue()
                .compareTo(Integer.toString(jamArticleTotalVo.getSourceCode())) != 0) {
            jamArticleTotalVo
                    .getMainData()
                    .getMediaCode()
                    .setValue(Integer.toString(jamArticleTotalVo.getSourceCode()));
        }

        final String operation = jamArticleTotalVo
                .getMainData()
                .getIud()
                .trim();
        try {
            switch (operation) {
                case "I":
                case "U":
                    //***************************************************************************************************
                    // 히스토리 정보 입력
                    jamArticleTotalVo.setArtHistoryStep(1);
                    jamXmlRcvMapper.insertReceiveJobStep(jamArticleTotalVo);

                    doInsertArticleData(jamArticleTotalVo);
                    break;
                case "D":
                    doDeleteArticleData(jamArticleTotalVo);
                    break;
            }
        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }
    }

    @Transactional
    void doInsertArticleData(JamArticleTotalVo jamArticleTotalVo)
            throws RcvDataAccessException {
        try {
            final JamArticleVo article = jamArticleTotalVo.getMainData();

            //***************************************************************************************************
            // ART_BASIC_INS
            jamArticleTotalVo.setTotalBasicInfo(new TotalBasicInfo(jamArticleTotalVo));


        } catch (DataAccessException e) {
            throw new RcvDataAccessException(e.getCause());
        }




        /*
            //수신정보 입력   jobStep = { 수신:0, NewsDB:1, PortalDB:2, ResultSend:3 }
            object returnObj = null;
            Database dbConn = null;
            DbCommand dbCmd = null;
            dbConn = GetDbConnInfo(SQLDBType.NewsDB_W.ToString());
            string strRcvJobSeq = string.Empty;     //히스토리 아이디
            string strArticleID = string.Empty;     //아티클 아이디
            string strHpCompID = string.Empty;      //컴포넌트 아이디 (포토)
            string strRaCompID = string.Empty;      //컴포넌트 아이디 (관련기사)
            string strRlCompID = string.Empty;      //컴포넌트 아이디 (관련링크)


            using (DbConnection connection = dbConn.CreateConnection())
            {
                connection.Open();
                DbTransaction transaction = connection.BeginTransaction();
                DbPack dbPack = null;
                try
                {


                    dbPack = new DbPack()
                    {
                        connetString = SQLDBType.NewsDB_W.ToString(),
                        commandType = CommandType.StoredProcedure,
                        commandText = "dbo.UPA_16RE_RECV_ART_BASIC_INS"
                    };
                    dbPack.AddParameter("@IUD", artData.IUD, ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code, ParameterDirection.Input, SqlDbType.VarChar, 2);
                    dbPack.AddParameter("@RECEIVE_AID", Converts.ToInt32(artData.ArticleID.RecvArtID, 0), ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@RECEIVE_ORG_AID", Converts.ToInt32(artData.ArticleID.RecvOrgArtID, 0), ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@TITLE", CommonMethods.RemvConvSpecialChar(artData.PcTitle), ParameterDirection.Input, SqlDbType.NVarChar, 510);       //타입변경
                    dbPack.AddParameter("@MOB_TITLE", CommonMethods.RemvConvSpecialChar(artData.MoTitle), ParameterDirection.Input, SqlDbType.NVarChar, 510);   //타입변경
                    dbPack.AddParameter("@JI_TITLE", CommonMethods.RemvConvSpecialChar(artData.Title), ParameterDirection.Input, SqlDbType.NVarChar, 510);      //타입변경
                    dbPack.AddParameter("@LIST_TITLE", CommonMethods.RemvConvSpecialChar(artData.ListTitle), ParameterDirection.Input, SqlDbType.NVarChar, 510);//타입변경
                    dbPack.AddParameter("@SUB_TITLE", CommonMethods.RemvConvSpecialChar(artData.SubTitle), ParameterDirection.Input, SqlDbType.NVarChar, 500);  //타입변경
                    dbPack.AddParameter("@CONTENT", CommonMethods.RemvConvSpecialChar(artData.Content.Body), ParameterDirection.Input, SqlDbType.NText);        //타입변경
                    dbPack.AddParameter("@LIST_STATUS", "Y", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@ATYPE", "H", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@ART_TYPE", artData.TemplateType, ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@CONTENT_TYPE", artData.ArticleType, ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@SERVICE_STATUS", "Y", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@APPROVAL_STATUS", "Y", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@RESERVE_STATUS", "N", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@RESERVE_TIME", "", ParameterDirection.Input, SqlDbType.VarChar, 50);
                    dbPack.AddParameter("@SERVICE_DATETIME", artData.ArticleProp.ServiceDate, ParameterDirection.Input, SqlDbType.VarChar, 14);
                    dbPack.AddParameter("@EMBARGO_FLAG", artData.ArticleProp.Embargo, ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@LOGIN_FLAG", artData.ArticleProp.LoginFlag, ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@ADULT_FLAG", artData.ArticleProp.AdultFlag, ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@BLOG_FLAG", artData.ArticleProp.BlogFlag, ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@BULK_FLAG", artData.ArticleProp.Bulk.BulkFlag, ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@BULKIMG_FLAG", artData.ArticleProp.BulkImgFlag, ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@BULK_SITE", artData.ArticleProp.Bulk.BulkSite, ParameterDirection.Input, SqlDbType.VarChar, 30);
                    dbPack.AddParameter("@BULK_DEL_SITE", artData.ArticleProp.Bulk.BulkDelSite, ParameterDirection.Input, SqlDbType.VarChar, 30);
                    dbPack.AddParameter("@JONLY_FLAG", "N", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@ANALYSIS_FLAG", "N", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@AD_FLAG", "N", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@RECOM_FLAG", "N", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@JOONGANGRECOM_FLAG", "N", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@FBINSTANTARTICLE", "N", ParameterDirection.Input, SqlDbType.VarChar, 1);
                    dbPack.AddParameter("@NDARTICLE", "N", ParameterDirection.Input, SqlDbType.VarChar, 2);
                    dbPack.AddParameter("@PRESS_DATE", artData.PaperProp.PressDate, ParameterDirection.Input, SqlDbType.Char, 10);
                    dbPack.AddParameter("@PRESS_HO", Converts.ToInt16(artData.PaperProp.PressHo, 0), ParameterDirection.Input, SqlDbType.SmallInt);
                    dbPack.AddParameter("@PRESS_PAN", artData.PaperProp.PressPan, ParameterDirection.Input, SqlDbType.VarChar, 2);
                    dbPack.AddParameter("@PRESS_MYUN", artData.PaperProp.PressMyun, ParameterDirection.Input, SqlDbType.VarChar, 2);
                    dbPack.AddParameter("@PRESS_POSITION", (artData.PaperProp.PressPosition == "" || artData.PaperProp.PressPosition == null) ? null : artData.PaperProp.PressPosition, ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@PRESS_SECTION", ConvertSectionCode(artData.MediaInfo.Code, artData.PaperProp.Section), ParameterDirection.Input, SqlDbType.VarChar, 2);
                    dbPack.AddParameter("@ITEM_ADDR", artData.GeoLoc.AddressKr, ParameterDirection.Input, SqlDbType.VarChar, 30);
                    dbPack.AddParameter("@ITEM_LAT", artData.GeoLoc.GeoLat, ParameterDirection.Input, SqlDbType.VarChar, 20);
                    dbPack.AddParameter("@ITEM_LNG", artData.GeoLoc.GeoLang, ParameterDirection.Input, SqlDbType.VarChar, 20);
                    dbPack.AddParameter("@COPYRIGHT", artData.EtcInfo.CopyRight, ParameterDirection.Input, SqlDbType.VarChar, 100);
                    dbPack.AddParameter("@SERVICE_URL", artData.EtcInfo.ServiceUrl, ParameterDirection.Input, SqlDbType.VarChar, 100);
                    dbPack.AddParameter("@REPORTER", strReporters, ParameterDirection.Input, SqlDbType.NVarChar, 100);
                    dbPack.AddParameter("@CONTCODE1", strCategory1, ParameterDirection.Input, SqlDbType.Char, 4);
                    dbPack.AddParameter("@CONTCODE2", strCategory2, ParameterDirection.Input, SqlDbType.Char, 4);
                    dbPack.AddParameter("@CONTCODE3", strCategory3, ParameterDirection.Input, SqlDbType.Char, 4);
                    dbPack.AddParameter("@CONTCODE4", strCategory4, ParameterDirection.Input, SqlDbType.Char, 4);
                    dbPack.AddParameter("@WORKER_INPUT", artData.WorkerInfo.WorkerID, ParameterDirection.Input, SqlDbType.VarChar, 30);
                    dbPack.AddParameter("@WORKER_EDIT", artData.WorkerInfo.WorkerID, ParameterDirection.Input, SqlDbType.VarChar, 30);
                    dbPack.AddParameter("@WORKER_DESK", artData.WorkerInfo.WorkerID, ParameterDirection.Input, SqlDbType.VarChar, 30);
                    dbPack.AddParameter("@BREAKING_NEWS", oBreakingNews, ParameterDirection.Input, SqlDbType.TinyInt);
                    dbPack.AddParameter("@BREAKING_NEWS_CNT", oBreakingNewsCnt, ParameterDirection.Input, SqlDbType.TinyInt);
                    dbPack.AddParameter("@ON_THE_SCENE_REPORTING", (string.IsNullOrEmpty(artData.ArticleProp.OnTheSceneReporting) ? null : artData.ArticleProp.OnTheSceneReporting), ParameterDirection.Input, SqlDbType.Char, 1);
                    dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
                    dbCmd.CommandType = dbPack.commandType;
                    dbCmd.CommandTimeout = dbPack.commandTimeout;
                    PreCondition(ref dbCmd, ref dbPack, false);
                    returnObj = dbConn.ExecuteScalar(dbCmd, transaction);
                    if ((returnObj != null) && !(returnObj is DBNull))
                        strArticleID = Convert.ToString(returnObj.ToString());
                    dbPack.paramList.Clear();
                    #endregion

                    //==========================================
                    #region + 기자정보 입력
                    //일단 먼저 삭제
                    dbPack = new DbPack()
                    {
                        connetString = SQLDBType.NewsDB_W.ToString(),
                        commandType = CommandType.StoredProcedure,
                        commandText = "dbo.UPA_16RE_RECV_ART_REPORTER_DEL"
                    };
                    dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
                    dbPack.AddParameter("@RECEIVE_AID", Converts.ToInt32(artData.ArticleID.RecvArtID, 0), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
                    dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
                    dbCmd.CommandType = dbPack.commandType;
                    dbCmd.CommandTimeout = dbPack.commandTimeout;
                    PreCondition(ref dbCmd, ref dbPack, false);
                    dbConn.ExecuteNonQuery(dbCmd, transaction);
                    dbPack.paramList.Clear();

                    int nReporterOrdNum = 0;
                    foreach (Reporter rpt in artData.Reporter)
                    {
                        nReporterOrdNum++;
                        dbPack = new DbPack()
                        {
                            connetString = SQLDBType.NewsDB_W.ToString(),
                            commandType = CommandType.StoredProcedure,
                            commandText = "dbo.UPA_16RE_RECV_ART_REPORTER_INS"
                        };
                        dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
                        dbPack.AddParameter("@RECEIVE_AID", Converts.ToInt32(artData.ArticleID.RecvArtID, 0), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
                        dbPack.AddParameter("@REPORTER_NAME", rpt.Name.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 30);                //기자이름
                        dbPack.AddParameter("@REPORTER_EMAIL", rpt.Email.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 50);              //기자이메일
                        dbPack.AddParameter("@ORDER_NUM", nReporterOrdNum, ParameterDirection.Input, SqlDbType.Int);                                //순번
                        dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
                        dbCmd.CommandType = dbPack.commandType;
                        dbCmd.CommandTimeout = dbPack.commandTimeout;
                        PreCondition(ref dbCmd, ref dbPack, false);
                        dbConn.ExecuteNonQuery(dbCmd, transaction);
                        dbPack.paramList.Clear();
                    }
                    #endregion

                    //==========================================
                    #region + 키워드 입력
                    int nKeywordOrdNum = 0;
                    foreach (Keywords kwd in artData.Keyword)
                    {
                        nKeywordOrdNum++;
                        dbPack = new DbPack()
                        {
                            connetString = SQLDBType.NewsDB_W.ToString(),
                            commandType = CommandType.StoredProcedure,
                            commandText = "dbo.UPA_16RE_RECV_ART_KWD_INS"
                        };
                        dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
                        dbPack.AddParameter("@ARTICLE_ID", Converts.ToInt32(strArticleID, 0), ParameterDirection.Input, SqlDbType.Int);                       //기사 아이디
                        dbPack.AddParameter("@RECEIVE_AID", Converts.ToInt32(artData.ArticleID.RecvArtID, 0), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
                        dbPack.AddParameter("@ART_KEYWORD", kwd.Tag.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 256);                  //키워드
                        dbPack.AddParameter("@ORDER_NUM", nKeywordOrdNum, ParameterDirection.Input, SqlDbType.Int);                                //순번
                        dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
                        dbCmd.CommandType = dbPack.commandType;
                        dbCmd.CommandTimeout = dbPack.commandTimeout;
                        PreCondition(ref dbCmd, ref dbPack, false);
                        dbConn.ExecuteNonQuery(dbCmd, transaction);
                        dbPack.paramList.Clear();
                    }
                    #endregion

                    //==========================================
                    #region + 컴포넌트 입력
                    int nCompOrdNum = 0;
                    int nCompItmOrdNum = 0;
                    List<MultiItem> oHpItem = new List<MultiItem>();
                    List<MultiItem> oRaItem = new List<MultiItem>();
                    List<MultiItem> oRlItem = new List<MultiItem>();
                    List<MultiItem> oMultItem = new List<MultiItem>();
                    foreach (MultiItem mtItm in artData.Content.MultiItem)
                    {
                        if (mtItm.Type.ToUpper() == "HP")
                            oHpItem.Add(mtItm);
                        else if (mtItm.Type.ToUpper() == "RA")
                            oRaItem.Add(mtItm);
                        else if (mtItm.Type.ToUpper() == "RL")
                            oRlItem.Add(mtItm);
                        else
                            oMultItem.Add(mtItm);
                    }

                    //대표 이미지가 있는경우 대표 이미지를 상단으로 오도록 thumbnail로 전체 정렬
                    MultiItem hpItm = oHpItem.Find(x => !string.IsNullOrEmpty(x.ThumbnailYn) && x.ThumbnailYn.ToString() == "Y");
                    if (hpItm != null)
                    {
                        ThumbnailYnSort hpItmSort = new ThumbnailYnSort();
                        oHpItem.Sort(hpItmSort);
                    }

                    //동영상 대표 이미지를 htmlphoto에 넣어주기
                    foreach (MultiItem mtItmoya in oMultItem)
                    {
                        if(mtItmoya.Type =="MF" || mtItmoya.Type == "MH")
                        {
                            if (!string.IsNullOrEmpty(mtItmoya.Poster))
                            {
                                MultiItem tmpHp = new MultiItem();
                                tmpHp.Type = "HP";
                                tmpHp.Url = mtItmoya.Poster;
                                tmpHp.Width = "0";
                                tmpHp.Height = "0";
                                tmpHp.FileSize = "0";
                                tmpHp.Desc = mtItmoya.Desc;
                                tmpHp.Desc.DescYn = "Y";
                                tmpHp.BulkYn = "Y";
                                oHpItem.Add(tmpHp);
                                tmpHp = null;
                            }
                        }
                    }

                    #region HP
        if (oHpItem != null && oHpItem.Count > 0)
        {
            nCompOrdNum++;
            dbPack = new DbPack()
            {
                connetString = SQLDBType.NewsDB_W.ToString(),
                commandType = CommandType.StoredProcedure,
                commandText = "dbo.UPA_16RE_RECV_ART_COMP_INS"
            };
            dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
            dbPack.AddParameter("@ARTICLE_ID", Converts.ToInt32(strArticleID, 0), ParameterDirection.Input, SqlDbType.Int);                       //기사 아이디
            dbPack.AddParameter("@RECEIVE_AID", Converts.ToInt32(artData.ArticleID.RecvArtID, 0), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
            dbPack.AddParameter("@TYPE_ID", "13", ParameterDirection.Input, SqlDbType.VarChar, 2);                                      //컴포넌트 타입
            dbPack.AddParameter("@SERV_CODE", artData.AddData.ServCode.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 4);     //대분류
            dbPack.AddParameter("@SECT_CODE", artData.AddData.SectCode.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 4);     //중분류
            dbPack.AddParameter("@SERVICE_DATETIME", artData.ArticleProp.ServiceDate.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 14); //서비스날짜
            dbPack.AddParameter("@TITLE", artData.PcTitle, ParameterDirection.Input, SqlDbType.VarChar, 100);                           //제목
            dbPack.AddParameter("@KEYWORD", "", ParameterDirection.Input, SqlDbType.VarChar, 50);                                       //키워드
            dbPack.AddParameter("@ORDER_NUM", nCompOrdNum, ParameterDirection.Input, SqlDbType.Int);                                    //순번
            dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
            dbCmd.CommandType = dbPack.commandType;
            dbCmd.CommandTimeout = dbPack.commandTimeout;
            PreCondition(ref dbCmd, ref dbPack, false);
            returnObj = dbConn.ExecuteScalar(dbCmd, transaction);
            if ((returnObj != null) && !(returnObj is DBNull))
            strHpCompID = Convert.ToString(returnObj.ToString());
            dbPack.paramList.Clear();

            nCompItmOrdNum = 0;
            foreach (MultiItem mti in oHpItem)
            {
                nCompItmOrdNum++;
                string strFileUrl = string.Empty;
                string strFileName = string.Empty;
                int nPhotoWidth = 0;
                int nPhotoHeight = 0;
                int nPhotoFileSize = 0;
                strFileUrl = mti.Url.ToString();
                strFileName = strFileUrl.Substring(strFileUrl.LastIndexOf("/") + 1);    //파일명
                strFileUrl = (strFileUrl.ToLower().IndexOf("http://") > -1) ? strFileUrl.Substring("http://".Length) : strFileUrl;   //http제거
                strFileUrl = (strFileUrl.ToLower().IndexOf("https://") > -1) ? strFileUrl.Substring("https://".Length) : strFileUrl;   //https제거
                strFileUrl = strFileUrl.Substring(strFileUrl.IndexOf("/")); //도메인제거
                strFileUrl = strFileUrl.Substring(0, strFileUrl.LastIndexOf("/") + 1);  //경로
                int.TryParse(mti.Width, out nPhotoWidth);
                int.TryParse(mti.Height, out nPhotoHeight);
                int.TryParse(mti.FileSize, out nPhotoFileSize);
                dbPack = new DbPack()
                {
                    connetString = SQLDBType.NewsDB_W.ToString(),
                    commandType = CommandType.StoredProcedure,
                    commandText = "dbo.UPA_16RE_RECV_ART_COMP_ITM_INS"
                };
                dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);
                dbPack.AddParameter("@COMP_ID", int.Parse(strHpCompID), ParameterDirection.Input, SqlDbType.Int);
                dbPack.AddParameter("@TYPE_ID", "13", ParameterDirection.Input, SqlDbType.VarChar, 2);
                dbPack.AddParameter("@FILE_URL", strFileUrl, ParameterDirection.Input, SqlDbType.VarChar, 100);
                dbPack.AddParameter("@FILE_PATH", "", ParameterDirection.Input, SqlDbType.VarChar, 100);
                dbPack.AddParameter("@FILE_NAME", strFileName, ParameterDirection.Input, SqlDbType.VarChar, 255);
                dbPack.AddParameter("@PHOTO_DESC", CommonMethods.RemvConvSpecialChar((mti.Desc.Desc.Length > 500 ? mti.Desc.Desc.Substring(0, 500) : mti.Desc.Desc)), ParameterDirection.Input, SqlDbType.NVarChar, 1000);
                dbPack.AddParameter("@TNFILE_NAME", strFileName, ParameterDirection.Input, SqlDbType.VarChar, 100);
                dbPack.AddParameter("@PHOTO_WIDTH", nPhotoWidth, ParameterDirection.Input, SqlDbType.Int);
                dbPack.AddParameter("@PHOTO_HEIGHT", nPhotoHeight, ParameterDirection.Input, SqlDbType.Int);
                dbPack.AddParameter("@FILE_SIZE", nPhotoFileSize, ParameterDirection.Input, SqlDbType.Int);
                dbPack.AddParameter("@BULK_FLAG", mti.BulkYn, ParameterDirection.Input, SqlDbType.Char, 1);
                dbPack.AddParameter("@SRC_FLAG", 0, ParameterDirection.Input, SqlDbType.Int);
                dbPack.AddParameter("@DESC_FLAG", mti.Desc.DescYn.ToString(), ParameterDirection.Input, SqlDbType.Char, 1);
                dbPack.AddParameter("@ORDER_NUM", nCompItmOrdNum, ParameterDirection.Input, SqlDbType.Int);
                dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
                dbCmd.CommandType = dbPack.commandType;
                dbCmd.CommandTimeout = dbPack.commandTimeout;
                PreCondition(ref dbCmd, ref dbPack, false);
                dbConn.ExecuteNonQuery(dbCmd, transaction);
                dbPack.paramList.Clear();
            }
            MultiItem oMultiHp = new MultiItem();
            oMultiHp.Type = "HP";
            oMultiHp.Url = strHpCompID;
            oMultiHp.Title = artData.PcTitle;
            oMultItem.Add(oMultiHp);
        }
        else
        {
            dbPack = new DbPack()
            {
                connetString = SQLDBType.NewsDB_W.ToString(),
                commandType = CommandType.StoredProcedure,
                commandText = "dbo.UPA_16RE_RECV_ART_COMP_LINK_DEL"
            };
            dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
            dbPack.AddParameter("@ARTICLE_ID", int.Parse(strArticleID), ParameterDirection.Input, SqlDbType.Int);                       //기사 아이디
            dbPack.AddParameter("@RECEIVE_AID", int.Parse(artData.ArticleID.RecvArtID), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
            dbPack.AddParameter("@TYPE_ID", "13", ParameterDirection.Input, SqlDbType.VarChar, 2);                                      //컴포넌트 타입
            dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
            dbCmd.CommandType = dbPack.commandType;
            dbCmd.CommandTimeout = dbPack.commandTimeout;
            PreCondition(ref dbCmd, ref dbPack, false);
            dbConn.ExecuteNonQuery(dbCmd, transaction);
            dbPack.paramList.Clear();
        }
                    #endregion

                    #region RA
        if (oRaItem != null && oRaItem.Count > 0)
        {
            nCompOrdNum++;
            dbPack = new DbPack()
            {
                connetString = SQLDBType.NewsDB_W.ToString(),
                commandType = CommandType.StoredProcedure,
                commandText = "dbo.UPA_16RE_RECV_ART_COMP_INS"
            };
            dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
            dbPack.AddParameter("@ARTICLE_ID", int.Parse(strArticleID), ParameterDirection.Input, SqlDbType.Int);                       //기사 아이디
            dbPack.AddParameter("@RECEIVE_AID", int.Parse(artData.ArticleID.RecvArtID), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
            dbPack.AddParameter("@TYPE_ID", "3", ParameterDirection.Input, SqlDbType.VarChar, 2);                                       //컴포넌트 타입
            dbPack.AddParameter("@SERV_CODE", artData.AddData.ServCode.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 4);     //대분류
            dbPack.AddParameter("@SECT_CODE", artData.AddData.SectCode.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 4);     //중분류
            dbPack.AddParameter("@SERVICE_DATETIME", artData.ArticleProp.ServiceDate.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 14); //서비스날짜
            dbPack.AddParameter("@TITLE", artData.PcTitle, ParameterDirection.Input, SqlDbType.VarChar, 100);                           //제목
            dbPack.AddParameter("@KEYWORD", "", ParameterDirection.Input, SqlDbType.VarChar, 50);                                       //키워드
            dbPack.AddParameter("@ORDER_NUM", nCompOrdNum, ParameterDirection.Input, SqlDbType.Int);                                    //순번
            dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
            dbCmd.CommandType = dbPack.commandType;
            dbCmd.CommandTimeout = dbPack.commandTimeout;
            PreCondition(ref dbCmd, ref dbPack, false);
            returnObj = dbConn.ExecuteScalar(dbCmd, transaction);
            if ((returnObj != null) && !(returnObj is DBNull))
            strRaCompID = Convert.ToString(returnObj.ToString());
            dbPack.paramList.Clear();

            nCompItmOrdNum = 0;
            foreach (MultiItem mti in oRaItem)
            {
                foreach (MultiRel mtira in mti.RelArt)
                {
                    nCompItmOrdNum++;
                    dbPack = new DbPack()
                    {
                        connetString = SQLDBType.NewsDB_W.ToString(),
                        commandType = CommandType.StoredProcedure,
                        commandText = "dbo.UPA_16RE_RECV_ART_COMP_ITM_INS"
                    };
                    string strRelArtTitle = mtira.Title.ToString();
                    int nRelArticleId = 0;
                    int.TryParse(mtira.Url, out nRelArticleId);
                    dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);
                    dbPack.AddParameter("@COMP_ID", int.Parse(strRaCompID), ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@TYPE_ID", "3", ParameterDirection.Input, SqlDbType.VarChar, 2);
                    dbPack.AddParameter("@FILE_URL", "", ParameterDirection.Input, SqlDbType.VarChar, 100);
                    dbPack.AddParameter("@FILE_PATH", "", ParameterDirection.Input, SqlDbType.VarChar, 100);
                    dbPack.AddParameter("@FILE_NAME", strRelArtTitle, ParameterDirection.Input, SqlDbType.VarChar, 255);    //제목
                    dbPack.AddParameter("@PHOTO_DESC", "", ParameterDirection.Input, SqlDbType.NVarChar, 1000);
                    dbPack.AddParameter("@TNFILE_NAME", "", ParameterDirection.Input, SqlDbType.VarChar, 100);
                    dbPack.AddParameter("@PHOTO_WIDTH", nRelArticleId, ParameterDirection.Input, SqlDbType.Int);            //기사아이디
                    dbPack.AddParameter("@PHOTO_HEIGHT", 0, ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@FILE_SIZE", 0, ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@BULK_FLAG", "N", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@SRC_FLAG", 0, ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@DESC_FLAG", "N", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@ORDER_NUM", nCompItmOrdNum, ParameterDirection.Input, SqlDbType.Int);
                    dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
                    dbCmd.CommandType = dbPack.commandType;
                    dbCmd.CommandTimeout = dbPack.commandTimeout;
                    PreCondition(ref dbCmd, ref dbPack, false);
                    dbConn.ExecuteNonQuery(dbCmd, transaction);
                    dbPack.paramList.Clear();
                }
            }
            MultiItem oMultiRa = new MultiItem();
            oMultiRa.Type = "RA";
            oMultiRa.Url = strRaCompID;
            oMultiRa.Title = artData.PcTitle;
            oMultItem.Add(oMultiRa);
        }
        else
        {
            dbPack = new DbPack()
            {
                connetString = SQLDBType.NewsDB_W.ToString(),
                commandType = CommandType.StoredProcedure,
                commandText = "dbo.UPA_16RE_RECV_ART_COMP_LINK_DEL"
            };
            dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
            dbPack.AddParameter("@ARTICLE_ID", int.Parse(strArticleID), ParameterDirection.Input, SqlDbType.Int);                       //기사 아이디
            dbPack.AddParameter("@RECEIVE_AID", int.Parse(artData.ArticleID.RecvArtID), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
            dbPack.AddParameter("@TYPE_ID", "3", ParameterDirection.Input, SqlDbType.VarChar, 2);                                      //컴포넌트 타입
            dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
            dbCmd.CommandType = dbPack.commandType;
            dbCmd.CommandTimeout = dbPack.commandTimeout;
            PreCondition(ref dbCmd, ref dbPack, false);
            dbConn.ExecuteNonQuery(dbCmd, transaction);
            dbPack.paramList.Clear();
        }
                    #endregion

                    #region RL
        if (oRlItem != null && oRlItem.Count > 0)
        {
            nCompOrdNum++;
            dbPack = new DbPack()
            {
                connetString = SQLDBType.NewsDB_W.ToString(),
                commandType = CommandType.StoredProcedure,
                commandText = "dbo.UPA_16RE_RECV_ART_COMP_INS"
            };
            dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
            dbPack.AddParameter("@ARTICLE_ID", int.Parse(strArticleID), ParameterDirection.Input, SqlDbType.Int);                       //기사 아이디
            dbPack.AddParameter("@RECEIVE_AID", int.Parse(artData.ArticleID.RecvArtID), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
            dbPack.AddParameter("@TYPE_ID", "9", ParameterDirection.Input, SqlDbType.VarChar, 2);                                       //컴포넌트 타입
            dbPack.AddParameter("@SERV_CODE", artData.AddData.ServCode.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 4);     //대분류
            dbPack.AddParameter("@SECT_CODE", artData.AddData.SectCode.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 4);     //중분류
            dbPack.AddParameter("@SERVICE_DATETIME", artData.ArticleProp.ServiceDate.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 14); //서비스날짜
            dbPack.AddParameter("@TITLE", artData.PcTitle, ParameterDirection.Input, SqlDbType.VarChar, 100);                           //제목
            dbPack.AddParameter("@KEYWORD", "", ParameterDirection.Input, SqlDbType.VarChar, 50);                                       //키워드
            dbPack.AddParameter("@ORDER_NUM", nCompOrdNum, ParameterDirection.Input, SqlDbType.Int);                                    //순번
            dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
            dbCmd.CommandType = dbPack.commandType;
            dbCmd.CommandTimeout = dbPack.commandTimeout;
            PreCondition(ref dbCmd, ref dbPack, false);
            returnObj = dbConn.ExecuteScalar(dbCmd, transaction);
            if ((returnObj != null) && !(returnObj is DBNull))
            strRlCompID = Convert.ToString(returnObj.ToString());
            dbPack.paramList.Clear();

            nCompItmOrdNum = 0;
            foreach (MultiItem mti in oRlItem)
            {
                foreach (MultiRel mtira in mti.RelArt)
                {
                    nCompItmOrdNum++;
                    dbPack = new DbPack()
                    {
                        connetString = SQLDBType.NewsDB_W.ToString(),
                        commandType = CommandType.StoredProcedure,
                        commandText = "dbo.UPA_16RE_RECV_ART_COMP_ITM_INS"
                    };
                    string strRelLinkTitle = mtira.Title.ToString();
                    string strRelLinkUrl = mtira.Url.ToString();
                    dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);
                    dbPack.AddParameter("@COMP_ID", int.Parse(strRaCompID), ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@TYPE_ID", "9", ParameterDirection.Input, SqlDbType.VarChar, 2);
                    dbPack.AddParameter("@FILE_URL", strRelLinkUrl, ParameterDirection.Input, SqlDbType.VarChar, 100);
                    dbPack.AddParameter("@FILE_PATH", "", ParameterDirection.Input, SqlDbType.VarChar, 100);
                    dbPack.AddParameter("@FILE_NAME", strRelLinkTitle, ParameterDirection.Input, SqlDbType.VarChar, 255);    //제목
                    dbPack.AddParameter("@PHOTO_DESC", "N", ParameterDirection.Input, SqlDbType.NVarChar, 1000);
                    dbPack.AddParameter("@TNFILE_NAME", "", ParameterDirection.Input, SqlDbType.VarChar, 100);
                    dbPack.AddParameter("@PHOTO_WIDTH", 0, ParameterDirection.Input, SqlDbType.Int);            //기사아이디
                    dbPack.AddParameter("@PHOTO_HEIGHT", 0, ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@FILE_SIZE", 0, ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@BULK_FLAG", "N", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@SRC_FLAG", 0, ParameterDirection.Input, SqlDbType.Int);
                    dbPack.AddParameter("@DESC_FLAG", "N", ParameterDirection.Input, SqlDbType.Char, 1);
                    dbPack.AddParameter("@ORDER_NUM", nCompItmOrdNum, ParameterDirection.Input, SqlDbType.Int);
                    dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
                    dbCmd.CommandType = dbPack.commandType;
                    dbCmd.CommandTimeout = dbPack.commandTimeout;
                    PreCondition(ref dbCmd, ref dbPack, false);
                    dbConn.ExecuteNonQuery(dbCmd, transaction);
                    dbPack.paramList.Clear();
                }
            }
            MultiItem oMultiRl = new MultiItem();
            oMultiRl.Type = "RL";
            oMultiRl.Url = strRlCompID;
            oMultiRl.Title = artData.PcTitle;
            oMultItem.Add(oMultiRl);
        }
        else
        {
            dbPack = new DbPack()
            {
                connetString = SQLDBType.NewsDB_W.ToString(),
                commandType = CommandType.StoredProcedure,
                commandText = "dbo.UPA_16RE_RECV_ART_COMP_LINK_DEL"
            };
            dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
            dbPack.AddParameter("@ARTICLE_ID", int.Parse(strArticleID), ParameterDirection.Input, SqlDbType.Int);                       //기사 아이디
            dbPack.AddParameter("@RECEIVE_AID", int.Parse(artData.ArticleID.RecvArtID), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
            dbPack.AddParameter("@TYPE_ID", "9", ParameterDirection.Input, SqlDbType.VarChar, 2);                                      //컴포넌트 타입
            dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
            dbCmd.CommandType = dbPack.commandType;
            dbCmd.CommandTimeout = dbPack.commandTimeout;
            PreCondition(ref dbCmd, ref dbPack, false);
            dbConn.ExecuteNonQuery(dbCmd, transaction);
            dbPack.paramList.Clear();
        }
                    #endregion

                    #region CoverImage
        if (artData.TemplateType == "C" || artData.TemplateType == "Z" || artData.TemplateType == "Y" ||  artData.TemplateType == "X" || artData.TemplateType == "D" || artData.TemplateType == "S")
        {
            if (!string.IsNullOrEmpty(artData.CoverImage.PcUrl))
            {
                MultiItem oMultiCV_Pc = new MultiItem();
                oMultiCV_Pc.Type = "MC";
                oMultiCV_Pc.Url = artData.CoverImage.PcUrl;
                oMultiCV_Pc.JoinKey = artData.CoverImage.BgColor;
                oMultiCV_Pc.Title = "";
                oMultItem.Add(oMultiCV_Pc);
            }
            if (!string.IsNullOrEmpty(artData.CoverImage.MoUrl))
            {
                MultiItem oMultiCV_Mo = new MultiItem();
                oMultiCV_Mo.Type = "ME";
                oMultiCV_Mo.Url = artData.CoverImage.MoUrl;
                oMultiCV_Mo.JoinKey = artData.CoverImage.BgColor;
                oMultiCV_Mo.Title = "";
                oMultItem.Add(oMultiCV_Mo);
            }
        }
                    #endregion

                    #region 멀티
        nCompOrdNum = 0;
        //삭제
        dbPack = new DbPack()
        {
            connetString = SQLDBType.NewsDB_W.ToString(),
            commandType = CommandType.StoredProcedure,
            commandText = "dbo.UPA_16RE_RECV_ART_MULTI_INS"
        };
        dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
        dbPack.AddParameter("@ARTICLE_ID", int.Parse(strArticleID), ParameterDirection.Input, SqlDbType.Int);                       //기사 아이디
        dbPack.AddParameter("@RECEIVE_AID", int.Parse(artData.ArticleID.RecvArtID), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
        dbPack.AddParameter("@SUB_SEQ", 0, ParameterDirection.Input, SqlDbType.Int);
        dbPack.AddParameter("@USED_YN", "", ParameterDirection.Input, SqlDbType.Char, 1);
        dbPack.AddParameter("@ORD_NO", nCompOrdNum, ParameterDirection.Input, SqlDbType.TinyInt);
        dbPack.AddParameter("@MULTI_TYPE", "", ParameterDirection.Input, SqlDbType.VarChar, 2);
        dbPack.AddParameter("@JOIN_KEY", 0, ParameterDirection.Input, SqlDbType.Int);
        dbPack.AddParameter("@VARCHAR_KEY", "", ParameterDirection.Input, SqlDbType.VarChar, 50);
        dbPack.AddParameter("@MULTI_TITLE", "", ParameterDirection.Input, SqlDbType.VarChar, 200);
        dbPack.AddParameter("@MULTI_LINK", "", ParameterDirection.Input, SqlDbType.VarChar, 1000);
        dbPack.AddParameter("@THUMB_IMG", "", ParameterDirection.Input, SqlDbType.VarChar, 200);
        dbPack.AddParameter("@MULTI_KWD", "", ParameterDirection.Input, SqlDbType.VarChar, 500);
        dbPack.AddParameter("@PLAY_TIME", "", ParameterDirection.Input, SqlDbType.VarChar, 10);
        dbPack.AddParameter("@REG_ID", artData.WorkerInfo.WorkerID, ParameterDirection.Input, SqlDbType.VarChar, 30);
        dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
        dbCmd.CommandType = dbPack.commandType;
        dbCmd.CommandTimeout = dbPack.commandTimeout;
        PreCondition(ref dbCmd, ref dbPack, false);
        dbConn.ExecuteNonQuery(dbCmd, transaction);
        dbPack.paramList.Clear();

        if (oMultItem != null && oMultItem.Count > 0)
        {
            foreach (MultiItem mtItm in oMultItem)
            {
                nCompOrdNum++;
                dbPack = new DbPack()
                {
                    connetString = SQLDBType.NewsDB_W.ToString(),
                    commandType = CommandType.StoredProcedure,
                    commandText = "dbo.UPA_16RE_RECV_ART_MULTI_INS"
                };
                dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);     //매체코드
                dbPack.AddParameter("@ARTICLE_ID", int.Parse(strArticleID), ParameterDirection.Input, SqlDbType.Int);                       //기사 아이디
                dbPack.AddParameter("@RECEIVE_AID", int.Parse(artData.ArticleID.RecvArtID), ParameterDirection.Input, SqlDbType.Int);       //통합CMS 기사 아이디
                dbPack.AddParameter("@SUB_SEQ", 0, ParameterDirection.Input, SqlDbType.Int);
                dbPack.AddParameter("@USED_YN", "Y", ParameterDirection.Input, SqlDbType.Char, 1);
                dbPack.AddParameter("@ORD_NO", nCompOrdNum, ParameterDirection.Input, SqlDbType.TinyInt);
                dbPack.AddParameter("@MULTI_TYPE", mtItm.Type.ToUpper(), ParameterDirection.Input, SqlDbType.VarChar, 2);
                dbPack.AddParameter("@JOIN_KEY", (("HP,RA,RL,GA").IndexOf(mtItm.Type.ToUpper()) > -1 ? int.Parse(mtItm.Url.ToString()) : (("MB,MD,MU").IndexOf(mtItm.Type.ToUpper()) > -1) ? int.Parse(mtItm.JoinKey.ToString()) : 0), ParameterDirection.Input, SqlDbType.Int);
                dbPack.AddParameter("@VARCHAR_KEY", (("MV").IndexOf(mtItm.Type.ToUpper()) > -1 ? mtItm.Url.ToString() : (("MC,ME").IndexOf(mtItm.Type.ToUpper()) > -1 ? mtItm.JoinKey.ToString() : "")), ParameterDirection.Input, SqlDbType.VarChar, 50);
                dbPack.AddParameter("@MULTI_TITLE", (("HP,RA,RL,MC,ME").IndexOf(mtItm.Type.ToUpper()) > -1 ? mtItm.Title.ToString() : (mtItm.Desc == null ? "" : mtItm.Desc.Desc)), ParameterDirection.Input, SqlDbType.VarChar, 200);
                dbPack.AddParameter("@MULTI_LINK", (("ML,MJ,MW,MY,MC,ME,MF,MH,NY,NF,NN,NK").IndexOf(mtItm.Type.ToUpper()) > -1 ? mtItm.Url.ToString() : ""), ParameterDirection.Input, SqlDbType.VarChar, 1000);
                dbPack.AddParameter("@THUMB_IMG", (("MF,MH").IndexOf(mtItm.Type.ToUpper()) > -1 ? mtItm.Poster.ToString() : ""), ParameterDirection.Input, SqlDbType.VarChar, 200);
                dbPack.AddParameter("@MULTI_KWD", "", ParameterDirection.Input, SqlDbType.VarChar, 500);
                dbPack.AddParameter("@PLAY_TIME", "", ParameterDirection.Input, SqlDbType.VarChar, 10);
                dbPack.AddParameter("@REG_ID", artData.WorkerInfo.WorkerID, ParameterDirection.Input, SqlDbType.VarChar, 30);
                dbCmd = dbPack.commandType.Equals(CommandType.Text) ? dbConn.GetSqlStringCommand(dbPack.commandText) : dbConn.GetStoredProcCommand(dbPack.commandText);
                dbCmd.CommandType = dbPack.commandType;
                dbCmd.CommandTimeout = dbPack.commandTimeout;
                PreCondition(ref dbCmd, ref dbPack, false);
                dbConn.ExecuteNonQuery(dbCmd, transaction);
                dbPack.paramList.Clear();
            }
                        #endregion
        }
                    #endregion

        transaction.Commit();

        //==========================================
                    #region + 수신기사 정보 상태값 변경
        //성공 플래그 저장
        UpdateReceiveJobStep(artData.IUD, strRcvJobSeq, "2", artData.MediaInfo.Code.ToString(), artData.ArticleID.RecvArtID.ToString(), artData.AddData.RcvFileName.ToString(), "");
                    #endregion
    }
                catch (Exception ex)
    {
        transaction.Rollback();

        //오류 메시지 저장
        UpdateReceiveJobStep(artData.IUD, strRcvJobSeq, "2", artData.MediaInfo.Code.ToString(), artData.ArticleID.RecvArtID.ToString(), artData.AddData.RcvFileName.ToString(), ex.Message);

        //throw;
        throw new Exception("Y", ex);
    }
                finally
    {
        dbPack.paramList.Clear();
        connection.Close();
        connection.Dispose();
        dbCmd = null;
        dbConn = null;
    }
}
            return strRcvJobSeq;
         */
    }

    private void doDeleteArticleData(JamArticleTotalVo jamArticleTotalVo)
            throws RcvDataAccessException {
        /*


            string strRcvJobSeq = string.Empty;
            bool bArtDelResult = false;
            try
            {
                strRcvJobSeq = InsertReceiveJobStep(artData.IUD, "1", artData.MediaInfo.Code, artData.ArticleID.RecvArtID, artData.AddData.RcvFileName);
            }
            catch
            {
                throw;
            }

            DbPack dbPack = new DbPack()
            {
                connetString = SQLDBType.NewsDB_W.ToString(),
                commandType = CommandType.StoredProcedure,
                commandText = "dbo.UPA_16RE_RECV_ART_BASIC_DEL"
            };
            dbPack.AddParameter("@SOURCE_CODE", artData.MediaInfo.Code.ToString(), ParameterDirection.Input, SqlDbType.VarChar, 2);         //매체코드
            dbPack.AddParameter("@RECEIVE_AID", Converts.ToInt32(artData.ArticleID.RecvArtID, 0), ParameterDirection.Input, SqlDbType.Int); //통합CMS 기사 아이디
            dbPack.AddParameter("@WORKER_INPUT", artData.WorkerInfo.WorkerID, ParameterDirection.Input, SqlDbType.VarChar, 30);             //작업자
            try
            {
                bArtDelResult = ExecuteCommandTransaction(dbPack);

                if (bArtDelResult)
                {
                    UpdateReceiveJobStep(artData.IUD, strRcvJobSeq, "2", artData.MediaInfo.Code.ToString(), artData.ArticleID.RecvArtID.ToString(), artData.AddData.RcvFileName.ToString(), "");
                }

                return strRcvJobSeq;
            }
            catch(Exception ex)
            {
                //오류 메시지 저장
                UpdateReceiveJobStep(artData.IUD, strRcvJobSeq, "2", artData.MediaInfo.Code.ToString(), artData.ArticleID.RecvArtID.ToString(), artData.AddData.RcvFileName.ToString(), ex.Message);

                //throw;
                throw new Exception("Y", ex);
            }
            finally
            {
                dbPack = null;
            }
        }
         */
    }
}
