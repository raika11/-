package jmnet.moka.web.rcv.util;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.exception.RcvException;
import lombok.extern.slf4j.Slf4j;

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
@Slf4j
public class RcvFileUtil {
    public static String readFile( Path path, Charset encoding)
            throws IOException {
        byte [] encoded = Files.readAllBytes(path);
        return new String( encoded, encoding);
    }

    @SuppressFBWarnings("REC_CATCH_EXCEPTION")
    public static Charset getFromXml( File file ) {
        XMLStreamReader xmlStreamReader = null;
        FileReader fr = null;
        try {
            fr = new FileReader(file, StandardCharsets.UTF_8);
            xmlStreamReader = XMLInputFactory
                    .newInstance()
                    .createXMLStreamReader(fr);

            return Charset.forName(xmlStreamReader.getCharacterEncodingScheme());
        } catch (Exception ignore) {
            log.trace("RcvFileUtil :: getFromXml Exception" );
        }
        finally {
            if( xmlStreamReader != null ) {
                try {
                    xmlStreamReader.close();
                } catch (XMLStreamException e) {
                    e.printStackTrace();
                }
            }
            if( fr != null ) {
                try {
                    fr.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return StandardCharsets.UTF_8;
    }

    public static String readFromXml( File file )
            throws IOException {
        return RcvFileUtil.readFile(file.toPath(), getFromXml( file) );
    }

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
        final Path sourceFilename = sourcePath.getFileName();
        if( McpString.isNullOrEmpty(sourceFilename)) {
            throw new RcvException(String.format("파일 원본 경로를 확인할 수 없습니다.[%s]", sourcePath.toString()));
        }

        Path targetFile = Paths.get(targetPath.toString(), sourceFilename.toString());
        if (Files.exists(targetFile)) {
            targetFile = Paths.get(renameFileWithDateTime(targetFile.toString(), McpFile.getExtension(file)));
        }
        try {
            Files.move(sourcePath, targetFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            if( !file.delete() ){
                throw new RcvException(String.format("파일 이동 중에 에러가 발생하였습니다., 파일을 삭제할 수 없습니다. [%s]->[%s] %s", sourcePath, targetFile, e.getMessage()));
            }

            e.printStackTrace();
            throw new RcvException(String.format("파일 이동 중에 에러가 발생하였습니다. [%s]->[%s] %s", sourcePath, targetFile, e.getMessage()));
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

    public static String getTempFileName(String tempDir) {
        if (!createDirectories(tempDir)) {
            return null;
        }

        try {
            File f = File.createTempFile("rcv",null, new File(tempDir));
            String filename = f.getAbsolutePath();
            if( !f.delete())
                log.trace("RcvFileUtil::getTempFileName file delete Error");
            return filename;
        } catch (IOException e) {
            return null;
        }
    }
}

