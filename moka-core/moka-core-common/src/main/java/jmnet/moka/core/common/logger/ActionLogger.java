package jmnet.moka.core.common.logger;

import java.net.InetAddress;
import java.net.UnknownHostException;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionResult;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.HttpHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


/**
 * <pre>
 *
 * 액션 로거
 *
 * 2020. 9. 28. ince 최초생성
 * </pre>
 *
 * @since 2020. 9. 28. 오후 1:14:45
 * @author ince
 */
@Slf4j
public class ActionLogger {

  private String serverIp = MokaConstants.IP_UNKNOWN;
  private String systemId = MokaConstants.SYSTEM_UNKNOWN;
  private static ActionLogger actionLogger;

  public static ActionLogger getInstance(String systemId) {

    synchronized (ActionLogger.class) {
      if(actionLogger == null) {
        actionLogger = new ActionLogger(systemId);
      }
    }
    return actionLogger;
  }

  private ActionLogger(String systemId) {
    if(McpString.isNotEmpty(systemId)) {
      this.systemId = systemId;
    }
    init();
  }

  private void init() {
    try {
      serverIp = InetAddress.getLocalHost() == null ? "" :InetAddress.getLocalHost().getHostAddress();
    } catch (UnknownHostException ex) {
      log.error(ex.toString());
    }

  }

  /**
   * 성공 로그 생성
   * @param actor 사용자id 또는 client ip
   * @param actionType 액션 유형
   * @param executedTime 실행시간
   */
  public void success(String actor, ActionType actionType, long executedTime) {
    log(actor, actionType, ActionResult.SUCCESS, executedTime, null);
  }

  /**
   * 성공 로그 생성
   * @param actor 사용자id 또는 client ip
   * @param actionType 액션 유형
   * @param executedTime 실행시간
   * @param msg 성공 메세지
   */
  public void success(String actor, ActionType actionType, long executedTime, String msg) {
    log(actor, actionType, ActionResult.SUCCESS, executedTime, msg);
  }

  /**
   * 실패 로그 생성
   * @param actor 사용자id 또는 client ip
   * @param actionType 액션 유형
   * @param executedTime 실행시간
   * @param msg 실패 메세지
   */
  public void fail(String actor, ActionType actionType, long executedTime, String msg) {
    log(actor, actionType, ActionResult.FAIL, executedTime, msg);
  }

  /**
   * 스킵 로그 생성
   * @param actor 사용자id 또는 client ip
   * @param actionType 액션 유형
   * @param executedTime 실행시간
   * @param msg 스킵 메세지
   */
  public void skip(String actor, ActionType actionType, long executedTime, String msg) {
    log(actor, actionType, ActionResult.SKIP, executedTime, msg);
  }

  /**
   * 에러 로그 생성
   * @param actor 사용자id 또는 client ip
   * @param actionType 액션 유형
   * @param executedTime 실행시간
   * @param msg 에러 메세지
   */
  public void error(String actor, ActionType actionType, long executedTime, String msg) {
    log(actor, actionType, ActionResult.ERROR, executedTime, msg);
  }

  /**
   * 에러 로그 생성
   * @param actor 사용자id 또는 client ip
   * @param actionType 액션 유형
   * @param executedTime 실행시간
   * @param t Throwable
   */
  public void error(String actor, ActionType actionType, long executedTime, Throwable t) {
    log(actor, actionType, ActionResult.ERROR, executedTime, t.getMessage());
  }

  /**
   * 에러 로그 생성
   * @param actor 사용자id 또는 client ip
   * @param actionType 액션 유형
   * @param executedTime 실행시간
   * @param msg 에러 메세지
   * @param t Throwable
   */
  public void error(String actor, ActionType actionType, long executedTime, String msg, Throwable t) {
    log(actor, actionType, ActionResult.ERROR, executedTime, msg, t);
  }


  private void log(String actor, ActionType actionType, ActionResult actionResult, long executedTime, String msg) {
    log(actor, actionType, actionResult, executedTime, msg, null);
  }

  private void log(String actor, ActionType actionType, ActionResult actionResult, long executedTime, String msg, Throwable t) {
    HttpServletRequest req = RequestContextHolder.getRequestAttributes() != null ? ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest() : null;
    String clientIp = req != null ? HttpHelper.getRemoteAddr(req) : MokaConstants.IP_UNKNOWN;
    String actionMsg = McpString.defaultValue(msg)+(t != null ? t.getMessage():"");
    log.info(LogMarker.ACTION, "{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t", this.systemId, this.serverIp, clientIp, actor, actionType.code(), actionResult.code(), executedTime, actionMsg);
  }

}
