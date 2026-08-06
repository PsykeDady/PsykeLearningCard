import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repositoryRoot = path.resolve(__dirname, "..");
const defaultSourceRoot = "/home/psykedady/Documenti/IndiceArgomentiOrale/docs";
const sourceRoot = path.resolve(process.argv[2] ?? defaultSourceRoot);
const subjectsIndexPath = path.join(repositoryRoot, "public/assets/subjects.json");
const subjectsRootPath = path.join(repositoryRoot, "public/assets/subjects");
const unicalRootPath = path.join(subjectsRootPath, "unical");
const placeholderAnswer = "Risposta non disponibile";

const slugify = (...values) => {
  return values
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .split("-")
    .filter(Boolean)
    .join("-");
};

const titleCase = (value) => {
  return value
    .split("-")
    .filter(Boolean)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
};

const stripKnownHtmlTags = (value = "") => {
  return value
    .replaceAll("<u>", "")
    .replaceAll("</u>", "");
};

const replaceMarkdownLinks = (value = "") => {
  let normalizedValue = value;
  let linkStart = normalizedValue.indexOf("[");

  while (linkStart !== -1) {
    const linkLabelEnd = normalizedValue.indexOf("]", linkStart);
    const linkUrlStart = normalizedValue.indexOf("(", linkLabelEnd);
    const linkUrlEnd = normalizedValue.indexOf(")", linkUrlStart);

    if (linkLabelEnd === -1 || linkUrlStart === -1 || linkUrlEnd === -1) {
      break;
    }

    const label = normalizedValue.slice(linkStart + 1, linkLabelEnd);
    normalizedValue = `${normalizedValue.slice(0, linkStart)}${label}${normalizedValue.slice(linkUrlEnd + 1)}`;
    linkStart = normalizedValue.indexOf("[", linkStart + label.length);
  }

  return normalizedValue;
};

const trimTrailingColons = (value = "") => {
  let normalizedValue = value;

  while (normalizedValue.endsWith(":")) {
    normalizedValue = normalizedValue.slice(0, -1).trimEnd();
  }

  return normalizedValue;
};

const normalizeText = (value = "") => {
  return replaceMarkdownLinks(stripKnownHtmlTags(value))
    .replace(/[_*`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const categoryInfoFromFile = (relativeFilePath) => {
  const degreeFolder = relativeFilePath.includes(`${path.sep}laurea-magistrale${path.sep}`) || relativeFilePath.startsWith(`laurea-magistrale${path.sep}`)
    ? "LM"
    : "LT";
  const fileName = path.basename(relativeFilePath, ".md");
  const categoryBase = titleCase(fileName);
  const category = `${degreeFolder} ${categoryBase}`;

  return {
    category,
    categorySegment: slugify(category)
  };
};

const addQuestion = (subjectMap, subjectTitle, questionText) => {
  if (!subjectMap.has(subjectTitle)) {
    subjectMap.set(subjectTitle, new Map());
  }

  const questions = subjectMap.get(subjectTitle);
  const key = normalizeText(questionText).toLowerCase();

  if (key === "") {
    return;
  }

  if (!questions.has(key)) {
    questions.set(key, {
      q: questionText,
      a: placeholderAnswer,
      t: "QA"
    });
  }
};

const parseSubjectLine = (line) => {
  if (!line.startsWith("## ") || line.startsWith("### ")) {
    return "";
  }

  return normalizeText(line.slice(3));
};

const parseProfessorLine = (line) => {
  if (!line.startsWith("### ")) {
    return "";
  }

  return normalizeText(line.slice(4));
};

const parseYearLine = (line) => {
  if (!line.startsWith("**<u>") || !line.endsWith("</u>**")) {
    return "";
  }

  return normalizeText(line.slice(5, -6));
};

const parseBulletLine = (line) => {
  const trimmedLine = line.trimStart();

  if (!trimmedLine.startsWith("- ")) {
    return null;
  }

  return {
    indent: line.length - trimmedLine.length,
    text: trimTrailingColons(normalizeText(trimmedLine.slice(2)))
  };
};

const registerQuestionBullet = (subjectMap, currentSubject, bulletStack, bullet) => {
  if (bullet.indent === 0 || bullet.text === "") {
    return [];
  }

  const updatedStack = [...bulletStack];

  while (updatedStack.length > 0 && updatedStack.at(-1).indent >= bullet.indent) {
    updatedStack.pop();
  }

  const hierarchy = updatedStack.map(item => item.text);
  const questionText = hierarchy.length === 0
    ? bullet.text
    : `${hierarchy.join(" > ")} > ${bullet.text}`;

  updatedStack.push({ indent: bullet.indent, text: bullet.text });
  addQuestion(subjectMap, currentSubject, questionText);

  return updatedStack;
};

const parseMarkdownSubjects = (content) => {
  const subjectMap = new Map();
  const lines = content.split(/\r?\n/);
  let currentSubject = "";
  let bulletStack = [];
  let parsingSubjects = false;

  for (const rawLine of lines) {
    const line = rawLine.replaceAll("\t", "    ");
    const trimmedLine = line.trim();
    const subjectLine = parseSubjectLine(trimmedLine);

    if (subjectLine !== "") {
      currentSubject = subjectLine;
      bulletStack = [];
      parsingSubjects = true;
      continue;
    }

    if (!parsingSubjects) {
      continue;
    }

    const professorLine = parseProfessorLine(trimmedLine);

    if (professorLine !== "") {
      bulletStack = [];
      continue;
    }

    const yearLine = parseYearLine(trimmedLine);

    if (yearLine !== "") {
      bulletStack = [];
      continue;
    }

    const bullet = parseBulletLine(line);

    if (!bullet || currentSubject === "") {
      continue;
    }

    bulletStack = registerQuestionBullet(subjectMap, currentSubject, bulletStack, bullet);
  }

  return subjectMap;
};

const collectMarkdownFiles = async (rootDirectory) => {
  const discoveredFiles = [];

  const walk = async (directory) => {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md") {
        discoveredFiles.push(absolutePath);
      }
    }
  };

  await walk(rootDirectory);
  return discoveredFiles.sort((left, right) => left.localeCompare(right));
};

const existingSubjects = JSON.parse(await fs.readFile(subjectsIndexPath, "utf8"));
const preservedSubjects = existingSubjects.filter(subject => subject.institute !== "Unical");
const markdownFiles = await collectMarkdownFiles(sourceRoot);
const generatedSubjects = [];

await fs.rm(unicalRootPath, { recursive: true, force: true });
await fs.mkdir(unicalRootPath, { recursive: true });

for (const markdownFile of markdownFiles) {
  const relativeFilePath = path.relative(sourceRoot, markdownFile);
  const { category, categorySegment } = categoryInfoFromFile(relativeFilePath);
  const targetCategoryDirectory = path.join(unicalRootPath, categorySegment);
  const markdownContent = await fs.readFile(markdownFile, "utf8");
  const parsedSubjects = parseMarkdownSubjects(markdownContent);

  await fs.mkdir(targetCategoryDirectory, { recursive: true });

  for (const [subjectTitle, questionMap] of parsedSubjects.entries()) {
    const subjectFileName = `${slugify(subjectTitle)}.json`;
    const questionArray = [...questionMap.values()];

    if (questionArray.length === 0) {
      continue;
    }

    await fs.writeFile(
      path.join(targetCategoryDirectory, subjectFileName),
      `${JSON.stringify(questionArray, null, 2)}\n`,
      "utf8"
    );

    generatedSubjects.push({
      institute: "Unical",
      category,
      subject: subjectTitle,
      qapath: `unical/${categorySegment}/${subjectFileName}`
    });
  }
}

generatedSubjects.sort((left, right) => {
  return left.category.localeCompare(right.category) || left.subject.localeCompare(right.subject);
});

const mergedSubjects = [...preservedSubjects, ...generatedSubjects];

await fs.writeFile(subjectsIndexPath, `${JSON.stringify(mergedSubjects, null, 2)}\n`, "utf8");

console.log(`Imported ${generatedSubjects.length} subjects from ${markdownFiles.length} markdown files.`);