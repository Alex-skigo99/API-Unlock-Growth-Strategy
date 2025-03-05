import fs from "fs";
import path from "path";

const getQuestionnaire = async () => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  // const filePath = path.resolve(__dirname, "../../assets/25 Questions for Testing.txt");
  const filePath = path.resolve(__dirname, "../../assets/Questions - Slim edition.txt");
  const fileContent = await fs.promises.readFile(filePath, "utf-8");
  const lines = fileContent.split("\n").filter((line) => line.trim() !== "");
  const questionnaire = [];
  let id = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    if (line.startsWith("#")) continue;
    if (line.startsWith("//")) continue;
    if (/^\d+\./.test(line)) {
      id += 1;
      questionnaire.push({
        key: id,
        question: line.slice(line.indexOf(".") + 1).trim(),
        answers: []
      });
      continue;
    }
    if (/^[A-Za-z0-9]+\)/.test(line) && id >= 0) {
      questionnaire[id].answers.push(line.slice(line.indexOf(")") + 1).trim());
    }
  }
  return questionnaire;
};

export default getQuestionnaire;
