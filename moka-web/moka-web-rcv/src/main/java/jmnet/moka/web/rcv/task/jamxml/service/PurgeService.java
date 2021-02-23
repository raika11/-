package jmnet.moka.web.rcv.task.jamxml.service;

import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.jamxml.service
 * ClassName : PurgeService
 * Created : 2021-02-18 018 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-18 018 오전 11:46
 */
public interface PurgeService {
    void purgeProcess(TaskInputData taskInputData, JamArticleTotalVo articleTotal, MokaRcvConfiguration rcvConfiguration);
}
