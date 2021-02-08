package jmnet.moka.web.bulk.task.bulkdump.process;

import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulkdump.process.joinsland.BulkJoinsLandProcess;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangProcess;
import jmnet.moka.web.bulk.task.bulkdump.process.joongang.BulkJoongangProcessEx;
import jmnet.moka.web.bulk.task.bulkdump.process.sunday.BulkSundayProcess;
import jmnet.moka.web.bulk.task.bulkdump.service.BulkDumpService;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobTotalVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.process
 * ClassName : BulkDumpClientProcess
 * Created : 2020-12-23 023 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-23 023 오후 4:50
 */

@Slf4j
public class BulkDumpClientProcess {
    public static void doProcess(TotalVo<BulkDumpTotalVo> totalVo, BulkDumpTask bulkDumpTask) {
        final BulkDumpTotalVo bulkDumpTotal = totalVo.getMainData();
        final BulkDumpService bulkDumpService = bulkDumpTask.getTaskManager().getBulkDumpService();
        final BulkDumpEnv bulkDumpEnv = bulkDumpTask.getBulkDumpEnv();

        final BulkDumpJobTotalVo dumpJobTotal = BulkDumpJobTotalVo.makeBulkDumpJobTotal(bulkDumpTotal.getSeqNo(), bulkDumpTotal.getContentId().toString(), bulkDumpEnv.getBulkDumpEnvGlobal().getDirDump());

        final String targetCode = bulkDumpTotal.getTargetCode();
        switch (targetCode) {
            case "SOA":
            case "SOE":
            case "SOF":
            case "SOG":
            case "SOI":
            case "SOC":
            case "SOT":
            case "SOY":
                dumpJobTotal.setNotFinalDump(true);
                (new BulkJoongangProcess(bulkDumpEnv)).doProcess( totalVo, bulkDumpTask, bulkDumpService, dumpJobTotal);

                dumpJobTotal.setNotFinalDump(true);
                // 타겟코드 규칙 : SOM? (?=A,E,F,G,I,C)
                bulkDumpTotal.setTargetCode(targetCode.substring(0, 2).concat("M").concat(targetCode.substring(2)));
                log.info(" BulkJoongangProcess Change Target Code = {}", bulkDumpTotal.getTargetCode());
                (new BulkJoongangProcess(bulkDumpEnv)).doProcess( totalVo, bulkDumpTask, bulkDumpService, dumpJobTotal);

                dumpJobTotal.setNotFinalDump(false);
                // 타겟코드 규칙 : SOX? (?=A,E,F,G,I,C)
                bulkDumpTotal.setTargetCode(targetCode.substring(0, 2).concat("X").concat(targetCode.substring(2)));
                log.info(" BulkJoongangProcess Change Target Code = {}", bulkDumpTotal.getTargetCode());
                (new BulkJoongangProcessEx(bulkDumpEnv)).doProcess( totalVo, bulkDumpTask, bulkDumpService, dumpJobTotal);
                break;
            case "VSD": //	중앙선데이
                (new BulkSundayProcess(bulkDumpEnv)).doProcess( totalVo, bulkDumpTask, bulkDumpService, dumpJobTotal);
            case "JJL":  //	조인스랜드(중앙일보 조인스랜드) - 중앙일보와 같이 전송해야 하는 경우가 있어서 끝 부분을 L로 맞췄다
                (new BulkJoinsLandProcess(bulkDumpEnv)).doProcess( totalVo, bulkDumpTask, bulkDumpService, dumpJobTotal);
            default:
                log.error("Not Defined DumpClientProcess TargetCode {}", bulkDumpTotal.getTargetCode());
                break;
        }
    }
}
