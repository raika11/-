package jmnet.moka.core.tps.common.util;

import java.io.File;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileUtil {
    private static final Logger logger = LoggerFactory.getLogger(FileUtil.class);

    /**
     * <pre>
     * 파일을 삭제한다
     * </pre>
     * 
     * @param filePaths 파일경로
     * @return 삭제 여부
     */
    public static boolean deleteFile(String... filePaths) {
        for (String filePath : filePaths) {
            if (!filePath.isEmpty()) {
                File file = new File(filePath);

                if (file.exists()) {
                    try {
                        boolean ret = file.delete();
                        logger.debug("File Delete: {}, Result: {}", file, ret);
                    } catch (Exception e) {
                        logger.error("File Delete Fail: {}, Error: {}", file, e);
                        return false;
                    }
                }
            } else {
                logger.error("That file doesn't exist: {}", filePath);
            }
        }
        return true;
    }
}
