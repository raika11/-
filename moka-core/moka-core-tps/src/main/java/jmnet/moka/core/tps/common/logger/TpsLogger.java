package jmnet.moka.core.tps.common.logger;

import javax.servlet.http.HttpServletRequest;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import jmnet.moka.core.tps.mvc.editlog.service.EditLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.common.logger
 * ClassName : TpsLogger
 * Created : 2020-10-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-19 13:15
 */
@Component
@Slf4j
public class TpsLogger {

    private final ActionLogger actionLogger;

    private final EditLogService editLogService;

    public TpsLogger(ActionLogger actionLogger, EditLogService editLogService) {
        this.actionLogger = actionLogger;
        this.editLogService = editLogService;
    }

    /**
     * 성공 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     */
    public void success(ActionType actionType, long executedTime) {
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.YES, executedTime, null);
        actionLogger.success(editLog.getMemberId(), actionType, executedTime, null);
        try {
            editLogService.insertEditLog(editLog);
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * 성공 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param msg          에러 메세지
     */
    public void success(ActionType actionType, long executedTime, String msg) {
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.YES, executedTime, msg);
        actionLogger.success(editLog.getMemberId(), actionType, executedTime, msg);
        try {
            editLogService.insertEditLog(editLog);
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * 실패 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param msg          에러 메세지
     */
    public void fail(ActionType actionType, long executedTime, String msg) {
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.NO, executedTime, msg);
        actionLogger.fail(editLog.getMemberId(), actionType, executedTime, msg);
        try {
            editLogService.insertEditLog(editLog);
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * 스킵 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param msg          에러 메세지
     */
    public void skip(ActionType actionType, long executedTime, String msg) {
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.NO, executedTime, msg);
        actionLogger.skip(editLog.getMemberId(), actionType, executedTime, msg);
    }

    /**
     * 에러 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param msg          에러 메세지
     */
    public void error(ActionType actionType, long executedTime, String msg) {
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.NO, executedTime, msg);
        actionLogger.error(editLog.getMemberId(), actionType, executedTime, msg);
        try {
            editLogService.insertEditLog(editLog);
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * 에러 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param t            Throwable
     */
    public void error(ActionType actionType, long executedTime, Throwable t) {
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.NO, executedTime, t.getMessage());
        actionLogger.error(editLog.getMemberId(), actionType, executedTime, t.getMessage());
        try {
            editLogService.insertEditLog(editLog);
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * 에러 로그 생성
     *
     * @param actor        사용자id 또는 client ip
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param msg          에러 메세지
     * @param t            Throwable
     */
    public void error(String actor, ActionType actionType, long executedTime, String msg, Throwable t) {
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.NO, executedTime, t.getMessage());
        actionLogger.error(actor, actionType, executedTime, msg, t);
        try {
            editLogService.insertEditLog(editLog);
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * HttpServletRequest와 Authentication로 편집 로그 정보를 생성한다.
     *
     * @param action       행위
     * @param successYn    성공 여부
     * @param executedTime 수행시간
     * @param errorMsg     에러 메세지
     * @return EditLog
     */
    private EditLog makeEditLog(String action, String successYn, long executedTime, String errorMsg) {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        String memberId = auth != null ? (String) auth.getPrincipal() : MokaConstants.USER_UNKNOWN;

        HttpServletRequest req = RequestContextHolder.getRequestAttributes() != null
                ? ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest()
                : null;

        String url = req != null ? req.getRequestURI() : MokaConstants.IP_UNKNOWN;
        String referer = req != null ? req.getHeader("referer") : MokaConstants.IP_UNKNOWN;
        String param = req != null ? HttpHelper.getParamString(req) : MokaConstants.IP_UNKNOWN;
        String remoteAddr = req != null ? HttpHelper.getRemoteAddr(req) : MokaConstants.IP_UNKNOWN;


        return EditLog
                .builder()
                .action(action)
                .memberId(memberId)
                .menuId(url)
                .successYn(successYn)
                .param(param)
                .regIp(remoteAddr)
                //.executedTime(executedTime)
                //.errorMsg(errorMsg)
                .build();
    }


}
