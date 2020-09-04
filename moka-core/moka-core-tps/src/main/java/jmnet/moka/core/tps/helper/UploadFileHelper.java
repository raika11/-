package jmnet.moka.core.tps.helper;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.imageio.ImageIO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.web.multipart.MultipartFile;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.core.tps.common.util.FileUtil;
import jmnet.moka.core.tps.common.util.ImageUtil;

public class UploadFileHelper {
    private static final Logger logger = LoggerFactory.getLogger(UploadFileHelper.class);

    private static final int CACHE_SIZE_MAX = 256;

    private static final int THUMBNAIL_MAX_WIDTH = 500;

    private LinkedHashMap<String, int[]> imgFileSizeCache;

    @Autowired
    private Environment environment;

    @Value("${tps.upload.path.real}")
    private String realPathPrefix;

    @Value("${tps.upload.rms.path.prefix}")
    private String rmsPathPrefix;

    @SuppressWarnings("serial")
    public UploadFileHelper() {
        this.imgFileSizeCache = new LinkedHashMap<String, int[]>() {
            protected boolean removeEldestEntry(Map.Entry<String, int[]> eldest) {
                return size() > CACHE_SIZE_MAX;
            }
        };
    }

    /**
     * property로 지정해놓은 업무 path 문자열 가져옴
     * 
     * @param business 업무
     * @return 업무 path 문자열
     */
    private String getBusinessProperty(String business) {
        return environment.getProperty("tps.upload.path." + business);
    }

    /**
     * 업무와 path로 실제 경로 가져옴
     * 
     * @param business 업무
     * @param paths 나머지 path
     * @return 실제 경로
     */
    public String getRealPath(String business, String... paths) {
        StringBuffer sb = new StringBuffer(128);

        sb.append(this.realPathPrefix).append("/").append(getBusinessProperty(business)).append("/")
                .append(String.join("/", paths));

        return sb.toString();
    }

    /**
     * realPathPrefix를 제외한 uri 리턴
     * 
     * @param path 파일 경로
     * @return uri
     */
    public String getUri(String path) {
        return path.replace(this.realPathPrefix + "/", "");
    }

    /**
     * RMS에 보여질 파일을 업로드할 실제 경로 가져옴
     * 
     * @param volumePath 볼륨패스
     * @return 실제 경로
     */
    public String getRealRmsPath(String volumePath, String... paths) {
        StringBuffer sb = new StringBuffer(128);

        sb.append(this.rmsPathPrefix).append("/").append(volumePath).append("/")
                .append(String.join("/", paths));

        return sb.toString();
    }

    /**
     * 파일 업로드
     * 
     * @param realPath 저장할 실제 경로
     * @param mfile 멀티파트파일
     * @return 결과
     * @throws IllegalStateException illegal state
     * @throws IOException 입출력
     */
    public boolean saveFile(String realPath, MultipartFile mfile)
            throws IllegalStateException, IOException {
        try {
            String pattern = "/[^/]*$";
            String path = realPath.split(pattern)[0];
            File directory = new File(path);

            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 파일 write
            OutputStream output = new FileOutputStream(realPath);
            output.write(mfile.getBytes());
            output.flush();
            output.close();

            return true;
        } catch (IllegalStateException e) {
            logger.error("Fail to save File {}", realPath, e);
            return false;
        } catch (IOException e) {
            logger.error("Fail to save File {}", realPath, e);
            return false;
        }
    }

    /**
     * 이미지를 저장한다
     * 
     * @param realPath 저장할 실제 경로
     * @param imageData 이미지 데이터
     * @param maxWidth 최대 넓이
     * @return 저장 결과
     * @throws Exception 예외처리
     */
    public boolean saveImage(String realPath, byte[] imageData, int maxWidth) throws Exception {
        try {
            // 이미지 리사이즈하여 저장함
            InputStream inputStream = new ByteArrayInputStream(imageData);
            BufferedImage image = ImageUtil.resize(inputStream, maxWidth);

            // 이미지 저장
            ImageIO.write(image, McpFile.getExtension(realPath), new File(realPath));
            return true;
        } catch (Exception e) {
            logger.error("Fail to save Image {}", realPath, e);
            return false;
        }
    }

    /**
     * 이미지를 저장한다
     * 
     * @param realPath 저장할 실제 경로
     * @param imageData 이미지 데이터
     * @return 저장 결과
     * @throws Exception 예외처리
     */
    public boolean saveImage(String realPath, byte[] imageData) throws Exception {
        return this.saveImage(realPath, imageData, THUMBNAIL_MAX_WIDTH);
    }

    /**
     * 이미지를 복사한다
     * 
     * @param realPath 저장할 실제 경로
     * @param targetFileRealPath 복사 대상 파일의 실제 경로
     * @return 복사 결과
     * @throws Exception 예외처리
     */
    public boolean copyFile(String realPath, String targetFileRealPath) throws Exception {
        try {
            File targetFile = new File(targetFileRealPath);
            File file = new File(realPath);
            if (targetFile.exists()) {
                FileInputStream fis = new FileInputStream(targetFile);  // 복사 대상 파일(읽을 파일)
                FileOutputStream fos = new FileOutputStream(file);  // 복사 완성본

                try {
                    int fileByte = 0;
                    // fis.read()가 -1 이면 파일을 다 읽은것
                    while ((fileByte = fis.read()) != -1) {
                        fos.write(fileByte);
                    }
                } finally {
                    try {
                        fos.flush();
                        fis.close();
                        fos.close();
                    } catch (Exception e) {
                        logger.error("Fail to close stream");
                    }
                }
            }

            return true;
        } catch (Exception e) {
            logger.error("Fail to copy file {} => {}", targetFileRealPath, realPath, e);
            return false;
        }
    }

    /**
     * 파일을 삭제한다
     * 
     * @param realPath 삭제할 파일 실제 경로
     * @return 삭제 결과
     * @throws Exception 예외처리
     */
    public boolean deleteFile(String realPath) throws Exception {
        return FileUtil.deleteFile(realPath);
    }

    /**
     * 업무 관련 폴더를 생성한다
     * 
     * @param business 업무
     * @param paths 나머지 path
     * @return 경로
     * @throws Exception 예외처리
     */
    public boolean createBusinessDir(String business, String... paths) throws Exception {
        String realPath = getRealPath(business, paths);
        File dir = new File(realPath);

        try {
            boolean result = dir.mkdir();
            if (!result) {
                logger.error("Fail to create a directory {}", realPath);
            }

            return result;
        } catch (Exception e) {
            logger.error("Fail to create a directory {}", realPath, e);
            return false;
        }
    }

    /**
     * 업무 관련 폴더를 삭제한다
     * 
     * @param business 업무
     * @param paths 나머지 path
     * @return 경로
     * @throws Exception 예외처리
     */
    public boolean deleteBusinessDir(String business, String... paths) throws Exception {
        String realPath = getRealPath(business, paths);
        File dir = new File(realPath);

        try {
            boolean result = dir.delete();
            if (!result) {
                logger.error("Fail to delete directory {}", realPath);
            }
            return result;
        } catch (Exception e) {
            logger.error("Fail to delete directory {}", realPath, e);
            return false;
        }
    }

    /**
     * <pre>
     * 이미지 사이즈(가로, 세로)를 구한다
     * </pre>
     * 
     * @param imgPath 이미지경로
     * @return [width, height]
     * @throws IOException 입출력예외
     */
    public int[] getImgFileSize(String imgPath) throws IOException {
        int[] imgSize = new int[2];

        if (this.imgFileSizeCache.containsKey(imgPath)) {
            imgSize = this.imgFileSizeCache.get(imgPath);
        } else {
            Map<String, Object> map = McpFile.getImageSize(new File(imgPath));
            imgSize[0] = (int) map.get("width");
            imgSize[0] = (int) map.get("height");
            this.imgFileSizeCache.put(imgPath, imgSize);
        }

        return imgSize;
    }

    /**
     * 이미지 사이즈(가로, 세로)를 구한다
     * 
     * @param mfile 멀티파트파일
     * @return [width, height]
     * @throws IOException 입출력
     */
    public int[] getImgFileSize(MultipartFile mfile) throws IOException {
        int[] imgSize = new int[2];

        BufferedImage image = ImageIO.read(mfile.getInputStream());
        imgSize[0] = image.getWidth();
        imgSize[1] = image.getHeight();

        return imgSize;
    }
}
