
import axios from "axios";
import fs from "fs";
import path from "path";

const url = "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png";
const Dalle3Url = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-IavKhzV5CTzG3SYkF2yLzxWP/user-tlrmRCzWHzOeWH43ZhgW4Riq/img-13T7ki3C47KkA5vNymqMlAcf.png?st=2024-03-04T10%3A37%3A05Z&se=2024-03-04T12%3A37%3A05Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-03-03T15%3A25%3A43Z&ske=2024-03-04T15%3A25%3A43Z&sks=b&skv=2021-08-06&sig=5rIfGm2YQ8yR2TnzSOhaE96hDFzcTXSxk9gvKxYLNyY%3D';


async function getImageData(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const base64 = Buffer.from(response.data, 'binary').toString('base64');
  return `data:image/png;base64,${base64}`;
}

// write the base64 image to a png file
async function generateImage(base64Data: string) {
    const filePath = path.join(__dirname, `image_${Date.now()}.png`);
    const base64DataNew = base64Data.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(filePath, base64DataNew, 'base64');
}

// Usage: npx ts-node script/download-base64.ts
async function main() {
  const base64Image = await getImageData(Dalle3Url);
  console.log(base64Image.substring(0, 100) + '...');
  await generateImage(base64Image);
}

main();