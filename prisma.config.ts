import fs from "fs";
import path from "path";

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), ".env"), "utf8");
    const match = envFile.match(/^DATABASE_URL=["']?([^"\n\r']+)["']?/m);
    if (match) {
      databaseUrl = match[1];
    }
  } catch (e) {}
}

export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
};
