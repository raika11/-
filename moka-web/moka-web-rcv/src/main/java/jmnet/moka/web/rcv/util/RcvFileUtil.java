package jmnet.moka.web.rcv.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.exception.RcvException;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.util
 * ClassName : RcvFileUtil
 * Created : 2020-11-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-05 005 오전 10:49
 */
public class RcvFileUtil {
    public static boolean createDirectories(String dir) {
        try {
            if (!McpString.isNullOrEmpty(dir)) {
                Path path = Paths.get(dir);
                if (Files.exists(path)) {
                    return true;
                }
                Files.createDirectories(path);

                return Files.exists(path);
            }
        } catch (IOException e) {
            return false;
        }
        return false;
    }

    @SuppressWarnings("ResultOfMethodCallIgnored")
    public static void moveFileToDateDir(File file, String targetDir, String dateStr)
            throws RcvException {
        if (McpString.isNullOrEmpty(targetDir)) {
            if (!file.delete()) {
                throw new RcvException(String.format("파일을 삭제할 수 없습니다.[%s]", file));
            }
            return;
        }

        final Path targetPath = Paths.get(targetDir, dateStr);
        createDirectories(targetPath.toString());

        final Path sourcePath = file.toPath();
        Path targetFile = Paths.get(targetPath.toString(), sourcePath
                .getFileName()
                .toString());
        if (Files.exists(targetFile)) {
            targetFile = Paths.get(renameFileWithDateTime(targetFile.toString(), McpFile.getExtension(file)));
        }
        try {
            Files.move(sourcePath, targetFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            file.delete();
            throw new RcvException(String.format("파일 이동 중에 에러가 발생하였습니다. [%s]->[%s]", sourcePath, targetFile));
        }
    }

    public static String renameFileWithDateTime(String sourceName, String ext)
            throws RcvException {
        StringBuilder sb = new StringBuilder();
        try {
            String newExt = "";
            if (!McpString.isNullOrEmpty(ext)) {
                newExt = ".".concat(ext);
                int extIndex = sourceName.indexOf(newExt);
                if (extIndex != -1) {
                    sb.append(sourceName, 0, extIndex);
                } else {
                    sb.append(sourceName);
                }
            } else {
                sb.append(sourceName);
            }
            return sb
                    .append("_")
                    .append(McpDate.dateStr(new Date(), "yyyyMMdd_HHmmss_SSS"))
                    .append(newExt)
                    .toString();
        } catch (Exception e) {
            throw new RcvException(String.format("파일 Rename 중에 에러가 발생하였습니다. [%s]", sourceName));
        }
    }

    @SuppressWarnings("ResultOfMethodCallIgnored")
    public static String getTempFileName(String tempDir) {
        if (!createDirectories(tempDir)) {
            return null;
        }

        try {
            File f = File.createTempFile("rcv",null, new File(tempDir));
            String filename = f.getAbsolutePath();
            f.delete();
            return filename;
        } catch (IOException e) {
            return null;
        }
    }
}

