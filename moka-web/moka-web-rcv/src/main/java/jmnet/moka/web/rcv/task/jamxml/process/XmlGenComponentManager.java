package jmnet.moka.web.rcv.task.jamxml.process;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemVo;
import jmnet.moka.web.rcv.util.FtpUtil;
import jmnet.moka.web.rcv.util.RcvImageUtil;
import jmnet.moka.web.rcv.util.RcvUtil;
import lombok.Getter;
import org.apache.commons.io.FilenameUtils;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml
 * ClassName : JamXmlRcvComponentManager
 * Created : 2020-11-23 023 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-23 023 오후 3:02
 */

@Getter
public class XmlGenComponentManager {
    private final JamArticleTotalVo articleTotal;
    private final JamArticleVo article;
    private final List<ItemVo> components;

    private final TaskInputData taskInputData;
    private final MokaRcvConfiguration rcvConfiguration;

    private final List<ItemVo> hpItems = new ArrayList<>();
    private final List<ItemVo> raItems = new ArrayList<>();
    private final List<ItemVo> rlItems = new ArrayList<>();
    private final List<ItemVo> multiItems = new ArrayList<>();

    public XmlGenComponentManager(TaskInputData taskInputData, JamArticleTotalVo articleTotal,
            MokaRcvConfiguration rcvConfiguration) {
        this.articleTotal = articleTotal;
        this.article = articleTotal.getMainData();
        this.components = this.article.getContents().getItems();
        this.taskInputData = taskInputData;
        this.rcvConfiguration = rcvConfiguration;
    }

    public void doComponentProcess() {
        for (ItemVo item : this.components) {
            final String type = item.getType().toUpperCase();
            doProcessContentsItem_PreProcess(type, item);
        }
        doProcessContentsItem_SeparateItems();
    }

    private void doProcessContentsItem_SeparateItems() {
        List<ItemVo> addItems = new ArrayList<>();

        for (ItemVo item : this.components) {
            item.setType(item.getType().toUpperCase());
            final String type = item.getType();

            switch (type) {
                case "HP":
                    if (item.getThumbnail().equals("Y")) {
                        hpItems.add(0, item);
                    } else {
                        hpItems.add(item);
                    }
                    break;
                case "RA":
                    raItems.add(item);
                    break;
                case "RL":
                    rlItems.add(item);
                    break;
                case "MF":
                case "MH":
                    if (!McpString.isNullOrEmpty(item.getPoster())) {
                        addItems.add(item);
                    }
                    multiItems.add(item);
                    break;
                default:
                    multiItems.add(item);
                    break;
            }
        }

        for (ItemVo item : addItems) {
            //noinspection serial
            hpItems.add(new ItemVo() {
                {
                    setType("HP");
                    setUrl(item.getPoster());
                    setWidth("0");
                    setHeight("0");
                    setKsize("0");
                    setDesc(item.getDesc());
                    setBulk("Y");
                }
            });
        }

        switch (article.getTmplType()) {
            case "C":
            case "Z":
            case "Y":
            case "X":
            case "D":
            case "S": {
                if (!McpString.isNullOrEmpty(article.getCoverImg().getPcUrl())) {

                    //noinspection serial
                    this.multiItems.add( new ItemVo(){
                        {
                            setType("MC");
                            setUrl(article.getCoverImg().getPcUrl() );
                            setJoinKey( article.getCoverImg().getBgColor());
                            setTitle( "");
                        }
                    });
                }

                if (!McpString.isNullOrEmpty(article.getCoverImg().getMoUrl())) {

                    //noinspection serial
                    this.multiItems.add( new ItemVo(){
                        {
                            setType("ME");
                            setUrl(article.getCoverImg().getMoUrl() );
                            setJoinKey( article.getCoverImg().getBgColor());
                            setTitle( "");
                        }
                    });
                }
                break;
            }
        }
    }

    private void doProcessContentsItem_PreProcess(String type, ItemVo item) {
        if( type.equals("HP"))
            doProcessContentsItem_PreProcess_MakePreviewThumbnail(item);
    }

    @SuppressWarnings("ConstantConditions")
    private void doProcessContentsItem_PreProcess_MakePreviewThumbnail(ItemVo item) {
        if( McpString.isNullOrEmpty(item.getUrl()) )
            return;

        if( McpString.isNullOrEmpty(rcvConfiguration.getStagePds()) ) {
            if( item.getUrl().toLowerCase().startsWith("http://"))
                return;
        }else {
            if( !item.getUrl().toLowerCase().startsWith(rcvConfiguration.getStagePds()) ){
                if( item.getUrl().toLowerCase().startsWith("http://"))
                    return;
            }
        }

        // https://pds.joins.com/news/component/htmlphoto_mmdata/202009/08/051b7abe-fe3d-43aa-823a-aec5fed86864.jpg.tn_250.jpg
        // url      -> /news/component/htmlphoto_mmdata/202009/08/
        // fileName -> 051b7abe-fe3d-43aa-823a-aec5fed86864.jpg.tn_250.jpg
        final String fileUrl = RcvUtil.getJamMiddleUrlPath(item.getUrl()); //  /news/component/htmlphoto_mmdata/202009/08/
        final String fileName = FilenameUtils.getName(item.getUrl());

        final String thumbFileName_120 = taskInputData.getTempFileName(rcvConfiguration.getTempDir());
        final String thumbFileName_250 = taskInputData.getTempFileName(rcvConfiguration.getTempDir());
        final String thumbFileName_350 = taskInputData.getTempFileName(rcvConfiguration.getTempDir());

        // 기존 소스에서는 Thumbnail 실패 시 무시..
        do {
            if (!RcvImageUtil.resizeMaxWidthHeight(thumbFileName_120, item.getUrl(), 120, 92)) {
                this.articleTotal.logError("thumbFileName_120 생성 에러 {}", item.getUrl());
                break;
            }
            if (!RcvImageUtil.resizeMaxWidthHeight(thumbFileName_250, item.getUrl(), 250, 192)) {
                this.articleTotal.logError("thumbFileName_250 생성 에러 {} ", item.getUrl());
                break;
            }
            if (!RcvImageUtil.resizeMaxWidthHeight(thumbFileName_350, item.getUrl(), 350, 269)) {
                this.articleTotal.logError("thumbFileName_350 생성 에러 {}", item.getUrl());
                break;
            }

            final String fileName_120 = fileName.concat(".tn_120.jpg");
            final String fileName_250 = fileName.concat(".tn_250.jpg");
            final String fileName_350 = fileName.concat(".tn_350.jpg");

            if (!FtpUtil.uploadFle(rcvConfiguration.getPdsFtpConfig(),
                    Arrays.asList(thumbFileName_120, thumbFileName_250, thumbFileName_350),
                    Arrays.asList(fileUrl, fileUrl, fileUrl),
                    Arrays.asList(fileName_120, fileName_250, fileName_350))) {
                this.articleTotal.logError("thumbName ftp 전송 에러");
                break;
            }

            item.setArtThumb(fileUrl + fileName_120);
        } while (false);
    }
}
