import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import SubjectListComponent from "../components/subject-list-component/subject-list-component";
import { getRemoteSubjects } from "../utils/github.utils";

function ChooseApp() {
    const navigate = useNavigate();
    const { subject: activeSubjectSlug = "" } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInstitute, setSelectedInstitute] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadSubjects = async () => {
            setLoading(true)
            setError(null)

            try {
                const remoteSubjects = await getRemoteSubjects()

                if (!cancelled) {
                    setSubjects(remoteSubjects)
                }
            } catch (fetchError) {
                if (!cancelled) {
                    console.error(fetchError)
                    setError(fetchError)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        };

        loadSubjects();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (subjects.length === 0 || activeSubjectSlug === "") {
            return;
        }

        const activeSubject = subjects.find(({ slug }) => slug === activeSubjectSlug);

        if (!activeSubject) {
            return;
        }

        setSelectedInstitute(activeSubject.institute)
        setSelectedCategory(activeSubject.category)
    }, [activeSubjectSlug, subjects]);

    const openSubject = ({ slug }) => {
        navigate(`/learning/${slug}`)
    }

    const instituteItems = useMemo(() => {
        const institutes = [...new Set(subjects.map(({ institute }) => institute))];

        return institutes.map(institute => ({
            id: `institute-${institute}`,
            label: institute,
            description: "Universita",
            type: "dir",
            institute
        }));
    }, [subjects]);

    const categoryItems = useMemo(() => {
        if (selectedInstitute === "") return [];

        const categories = [...new Set(
            subjects
                .filter(({ institute }) => institute === selectedInstitute)
                .map(({ category }) => category)
        )];

        return categories.map(category => ({
            id: `category-${selectedInstitute}-${category}`,
            label: category,
            description: selectedInstitute,
            type: "dir",
            category
        }));
    }, [selectedInstitute, subjects]);

    const subjectItems = useMemo(() => {
        if (selectedInstitute === "" || selectedCategory === "") return [];

        return subjects
            .filter(({ institute, category }) => institute === selectedInstitute && category === selectedCategory)
            .map(subject => ({
                ...subject,
                id: subject.slug,
                label: subject.subject,
                description: `${subject.institute} / ${subject.category}`,
                type: "file"
            }));
    }, [selectedCategory, selectedInstitute, subjects]);

    let visibleItems = instituteItems;

    if (selectedInstitute !== "") {
        visibleItems = selectedCategory === "" ? categoryItems : subjectItems;
    }

    const openItem = (item) => {
        if (selectedInstitute === "") {
            setSelectedInstitute(item.institute)
            return;
        }

        if (selectedCategory === "") {
            setSelectedCategory(item.category)
            return;
        }

        openSubject(item)
    };

    const resetToInstitutes = () => {
        navigate("/")
        setSelectedInstitute("")
        setSelectedCategory("")
    };

    const resetToCategories = () => {
        if (activeSubjectSlug !== "") {
            navigate("/")
        }
        setSelectedCategory("")
    };

    const showHierarchyBrowser = activeSubjectSlug === "";

    const breadcrumbItems = [{
        id: "breadcrumb-universities",
        label: "Universita",
        onClick: resetToInstitutes,
        active: selectedInstitute === ""
    }];

    if (selectedInstitute !== "") {
        breadcrumbItems.push({
            id: `breadcrumb-${selectedInstitute}`,
            label: selectedInstitute,
            onClick: resetToCategories,
            active: selectedCategory === ""
        });
    }

    if (selectedCategory !== "") {
        breadcrumbItems.push({
            id: `breadcrumb-${selectedInstitute}-${selectedCategory}`,
            label: selectedCategory,
            onClick: () => {},
            active: true
        });
    }

    let title = "Choose the university";

    if (selectedInstitute !== "") {
        title = selectedCategory === ""
            ? `Choose the faculty for ${selectedInstitute}`
            : `Choose the subject for ${selectedCategory}`;
    }

    return <div className="container-fluid">
        <div className="row">
            {showHierarchyBrowser && <div className="col-12">
                <div className="col-10 offset-1 text-center">
                    {title}
                    <br />
                    <hr />
                </div>
            </div>}
            <div className="col-12">
                <nav aria-label="Subject hierarchy" className="mb-3">
                    <ol className="breadcrumb justify-content-center bg-white rounded px-3 py-2 small">
                        {breadcrumbItems.map(item => <li
                            className={`breadcrumb-item${item.active ? " active" : ""}`}
                            key={item.id}
                            aria-current={item.active ? "page" : undefined}
                        >
                            {item.active
                                ? <span>{item.label}</span>
                                : <button
                                    className="btn btn-link btn-sm p-0 text-decoration-none align-baseline"
                                    onClick={item.onClick}
                                    type="button"
                                >
                                    {item.label}
                                </button>}
                        </li>)}
                    </ol>
                </nav>
                {showHierarchyBrowser && loading && <div className="text-center text-white">Loading subjects...</div>}
                {showHierarchyBrowser && error && <div className="text-center text-danger">Unable to load subjects from GitHub.</div>}
                {showHierarchyBrowser && !loading && !error && <SubjectListComponent subjects={visibleItems} onSelect={openItem} />}
            </div>
            <div className={`col-12${showHierarchyBrowser ? " mt-3" : ""}`}>
                <Outlet />
            </div>
        </div>
    </div>    
}

export default ChooseApp; 