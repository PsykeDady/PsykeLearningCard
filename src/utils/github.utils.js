import Subject from "../models/subject.model";

const REPOSITORY_ASSETS_ROOT = "https://raw.githubusercontent.com/PsykeDady/PsykeLearningCard/main/public/assets";
const SUBJECTS_INDEX_PATH = "subjects.json";
const SUBJECTS_ROOT_PATH = "subjects";

const buildAssetUrl = (relativePath = "") => {
    const sanitizedPath = relativePath.replace(/^\/+/, "");
    return `${REPOSITORY_ASSETS_ROOT}/${sanitizedPath}`;
};

const fetchJson = async (relativePath) => {
    const response = await fetch(buildAssetUrl(relativePath));

    if (!response.ok) {
        throw new Error(`Unable to fetch ${relativePath} from GitHub (${response.status})`);
    }

    return response.json();
};

export const createSubjectSlug = (label = "") => {
    const normalizedLabel = label
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

    return normalizedLabel.split("-").filter(Boolean).join("-");
};

export const getRemoteSubjects = async () => {
    const subjects = await fetchJson(SUBJECTS_INDEX_PATH);

    return subjects.map(({ institute, category, subject, qapath }) => ({
        ...new Subject(institute, category, subject, qapath),
        slug: createSubjectSlug(subject)
    }));
};

export const getRemoteQuestionsByPath = async (qaPath = "") => {
    return fetchJson(`${SUBJECTS_ROOT_PATH}/${qaPath}`);
};

export const getRemoteSubjectBySlug = async (subjectSlug = "") => {
    const subjects = await getRemoteSubjects();
    return subjects.find(({ slug }) => slug === subjectSlug) ?? null;
};

export const getRemoteQuestionsBySlug = async (subjectSlug = "") => {
    const subject = await getRemoteSubjectBySlug(subjectSlug);

    if (!subject) {
        throw new Error(`Subject not found for slug: ${subjectSlug}`);
    }

    return getRemoteQuestionsByPath(subject.qapath);
};

export { buildAssetUrl };