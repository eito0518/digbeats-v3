import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import { createApp } from "./app";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = createApp();

const key = fs.readFileSync("../cert/localhost-key.pem");
const cert = fs.readFileSync("../cert/localhost.pem");

https.createServer({ key, cert }, app).listen(process.env.PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${process.env.PORT}`);
});
