package jmnet.moka.web.rcv.task.joinsland.vo;

import java.util.Date;
import jmnet.moka.web.rcv.common.vo.TotalVo;
import jmnet.moka.web.rcv.task.joinsland.vo.sub.JoinsLandImageVo;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.joinsland.vo
 * ClassName : JoinsLandArticleTotalVo
 * Created : 2021-02-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-01 001 오전 9:37
 */
@Getter
@Setter
public class JoinsLandArticleTotalVo extends TotalVo<JoinsLandArticleVo> {
    private static final long serialVersionUID = 6737710921465972338L;

    public JoinsLandArticleTotalVo(JoinsLandArticleVo mainData) {
        super(mainData);
    }

    private Date insDt;
    private JoinsLandImageVo curImage;
}
