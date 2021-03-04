package jmnet.moka.web.bulk.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.exception.BulkException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.util
 * ClassName : BulkFileUtil
 * Created : 2020-11-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-05 005 오전 10:49
 */
@Slf4j
public class BulkFileUtil {
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

    public static void moveFileToDateDir(File file, String targetDir, String dateStr)
            throws BulkException {
        if (McpString.isNullOrEmpty(targetDir)) {
            if (!file.delete()) {
                throw new BulkException(String.format("파일을 삭제할 수 없습니다.[%s]", file));
            }
            return;
        }

        final Path targetPath = Paths.get(targetDir, dateStr);
        createDirectories(targetPath.toString());

        final Path sourcePath = file.toPath();
        final Path sourceFilename = sourcePath.getFileName();
        if( McpString.isNullOrEmpty(sourceFilename)) {
            throw new BulkException(String.format("파일 원본 경로를 확인할 수 없습니다.[%s]", sourcePath.toString()));
        }

        Path targetFile = Paths.get(targetPath.toString(), sourceFilename.toString());
        if (Files.exists(targetFile)) {
            targetFile = Paths.get(renameFileWithDateTime(targetFile.toString(), McpFile.getExtension(file)));
        }
        try {
            Files.move(sourcePath, targetFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            if( !file.delete() ){
                log.trace(" BulkFileUtil :: moveFileToDateDir file Delete failed");
            }
            e.printStackTrace();
            throw new BulkException(String.format("파일 이동 중에 에러가 발생하였습니다. [%s]->[%s] %s", sourcePath, targetFile, e.getMessage()));
        }
    }

    public static String renameFileWithDateTime(String sourceName, String ext)
            throws BulkException {
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
            throw new BulkException(String.format("파일 Rename 중에 에러가 발생하였습니다. [%s]", sourceName));
        }
    }

    public static String getTempFileName(String tempDir) {
        return getTempFileName( tempDir, null);
    }

    public static String getTempFileName(String tempDir, String extension) {
        if (!createDirectories(tempDir)) {
            return null;
        }

        if( extension != null ) {
            if( !extension.contains(".") )
                extension = ".".concat(extension);
        }

        try {
            File f = File.createTempFile("bulk", extension, new File(tempDir));
            String filename = f.getAbsolutePath();
            if( !f.delete() ){
                log.trace(" BulkFileUtil :: getTempFileName file Delete failed");
            }
            return filename;
        } catch (IOException ignore) {
            return null;
        }
    }

    public static void deleteFolder(String sourceDir) {
        File folder = new File(sourceDir);
        try {
            if(folder.exists()){
                File[] folder_list = folder.listFiles();
                if( folder_list != null ) {
                    for (File file : folder_list) {
                        if (file.isFile()) {
                            if( !file.delete() ){
                                log.trace(" BulkFileUtil :: deleteFolder file Delete failed");
                            }
                        } else {
                            deleteFolder(file.getPath());
                        }
                        if( !file.delete() ){
                            log.trace(" BulkFileUtil :: deleteFolder file Delete failed");
                        }
                    }
                }
                if( !folder.delete() ){
                    log.trace(" BulkFileUtil :: deleteFolder folder Delete failed");
                }
            }
        } catch (Exception e) {
            log.trace(" BulkFileUtil :: deleteFolder Exception failed");
        }
    }

    public static List<File> getDirScanFiles(File dirScan, String fileFilter, int fileWaitTime) {
        final File[] fileList = dirScan.listFiles();
        if (fileList == null || fileList.length <= 0) {
            return null;
        }

        List<File> files = new ArrayList<>();
        for (File f : fileList) {
            if (!f.isFile()) {
                continue;
            }
            if (FilenameUtils.wildcardMatch(f.getName(), fileFilter)) {
                if (System.currentTimeMillis() - f.lastModified() < fileWaitTime) {
                    continue;
                }

                if( f.length() == 0)
                    if( !f.delete() ){
                        log.trace(" BulkFileUtil :: getDirScanFiles file Delete failed");
                    }
                else
                    files.add(f);
            }
        }
        if( files.size() <= 0 )
            return null;

        return files;
    }
}

