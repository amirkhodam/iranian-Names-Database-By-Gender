import fs from "fs";
import csv, { writeToPath } from "fast-csv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resultsFormat(results) {
  return results.map((r) => {
    const name = r.Names;

    if (name[1] === " ") {
      return [name[0] + name.slice(2)];
    }

    return [name];
  });
}

async function processResults(results) {
  // {Names: string, Gender: M | F}
  const males = results.filter((r) => r.Gender === "M");
  const females = results.filter((r) => r.Gender === "F");

  await Promise.all([
    writeResult(resultsFormat(males), "Males"),
    writeResult(resultsFormat(females), "Females"),
  ]);

  console.log(`Parsed ${results.length} rows`);
}

async function writeResult(list, gender) {
  const pathString = path.resolve(
    __dirname,
    `iranianNamesDataset_${gender}.csv`
  );
  writeToPath(pathString, list, { headers: ["Names"] });
}

function main() {
  const results = [];

  const pushRow = (row) => {
    results.push(row);
  };

  const pathString = path.resolve(__dirname, "iranianNamesDataset.csv");
  fs.createReadStream(pathString)
    .pipe(csv.parse({ headers: true }))
    .on("error", (error) => console.error(error))
    .on("data", pushRow)
    .on("end", () => processResults(results));
}

main();
