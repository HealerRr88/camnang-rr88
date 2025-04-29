const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

// ⚠️ Thay bằng đúng đường dẫn máy bạn nếu khác
const ffmpegPath = "C:/ffmpeg/bin/ffmpeg.exe";

ffmpeg.setFfmpegPath(ffmpegPath);

exports.convertToHLS = (inputPath, outputDir, name) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .addOptions([
        "-profile:v baseline",
        "-level 3.0",
        "-start_number 0",
        "-hls_time 10",
        "-hls_list_size 0",
        "-f hls",
      ])
      .output(path.join(outputDir, `${name}.m3u8`))
      .on("end", () => resolve())
      .on("error", (err) => {
        console.error("FFmpeg Error:", err.message);
        reject(err);
      })
      .run();
  });
};
