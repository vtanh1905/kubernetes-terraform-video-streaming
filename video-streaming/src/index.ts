import express, { Express, Request, Response } from "express";
import fs, { Stats } from "fs";
import http from "http";

const app: Express = express();

if (!process.env.PORT) {
  throw new Error("[Video-Streaming]: Please define enviroment variable");
}

const port: number = +process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Video Streaming MicroService");
});

app.get("/video", (req: Request, res: Response) => {
  // const pathVideo: string = "./assets/sample-video.mp4";
  // fs.stat(pathVideo, (err: any, stats: Stats) => {
  //   if (err) {
  //     console.error("API /video: Error", err);
  //     res.sendStatus(500);
  //     return;
  //   }
  //   res.writeHead(200, {
  //     "Content-Length": stats.size,
  //     "Content-Type": "video/mp4",
  //   });
  //   fs.createReadStream(pathVideo).pipe(res);
  // });
  const forwardRequest = http.request(
    {
      host: "localhost",
      port: 3010,
      path: "/video?path=sample-video.mp4",
      method: "GET",
      headers: req.headers,
    },
    (forwardResponse: http.IncomingMessage) => {
      res.writeHead(200, forwardResponse.headers);
      forwardResponse.pipe(res)
    }
  );
  req.pipe(forwardRequest);
});

app.listen(port, () => {
  console.log(
    `⚡️[Video-Streaming]: Server is running at http://localhost:${port}`
  );
});
