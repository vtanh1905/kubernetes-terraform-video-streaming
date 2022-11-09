import express, { Express, Request, Response } from "express";
import AWS, { S3 } from "aws-sdk";

const app: Express = express();

if(!process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY || !process.env.PORT) {
  throw new Error("[AWS-S3]: Please define enviroment variable");
}

const port = process.env.PORT;

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3: S3 = new S3({ apiVersion: "2006-03-01" });

app.get("/", (req: Request, res: Response) => {
  res.send("AWS S3 MicroService");
});

app.get("/video", async (req: Request, res: Response) => {
  const { path } = req.query;
  if(!path){
    res.sendStatus(400);
    return;
  }
  try {
    const param: S3.Types.GetObjectRequest = {
      Bucket: "practise-microservices",
      Key: `videos/${path}`,
    };
    const dataFile:S3.Types.HeadObjectOutput = await s3.headObject(param).promise();
    res.writeHead(200, {
      "Content-Length": dataFile.ContentLength,
      "Content-Type": "video/mp4",
    });
    s3.getObject(param).createReadStream().pipe(res);
  } catch (error) {
    console.error("[AWS-S3] Can't get the object on S3", error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`⚡️[AWS-S3]: Server is running at http://localhost:${port}`);
});
