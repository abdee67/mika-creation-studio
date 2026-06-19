import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure fluent-ffmpeg uses the static binary
ffmpeg.setFfmpegPath(ffmpegStatic);

const inputDir = path.join(__dirname, '../public/videos');
const outputDir = path.join(__dirname, '../public/videos_compressed');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.mp4'));

async function processVideo(file) {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  return new Promise((resolve, reject) => {
    console.log(`Starting compression for ${file}...`);
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264',    // Video codec
        '-crf 28',         // Constant Rate Factor (0-51, lower is better quality, 28 is good for web)
        '-preset fast',    // Encoding speed/compression ratio tradeoff
        '-c:a aac',        // Audio codec
        '-b:a 128k',       // Audio bitrate
        '-vf scale=-2:720',// Scale to 720p (keep aspect ratio)
        '-movflags +faststart' // Optimize for web streaming
      ])
      .on('end', () => {
        console.log(`Finished ${file}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error processing ${file}:`, err);
        reject(err);
      })
      .save(outputPath);
  });
}

async function run() {
  for (const file of files) {
    await processVideo(file);
  }
  console.log('All videos compressed successfully!');
  console.log('You can now replace the original videos in public/videos with the ones in public/videos_compressed.');
}

run();
