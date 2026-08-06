import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SubjectListComponent from "../components/subject-list-component/subject-list-component";
import { getRemoteSubjects } from "../utils/github.utils";

function ChooseApp() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const openSubject = ({ slug }) => {
        navigate(`/learning/${slug}`)
    }

    return <div className="container-fluid">
        <div className="row">
            <div className="col-12">
                <div className="col-10 offset-1 text-center">
                    Choose the subject
                    <br />
                    <hr />
                </div>
            </div>
            <div className="col-12">
                {loading && <div className="text-center text-white">Loading subjects...</div>}
                {error && <div className="text-center text-danger">Unable to load subjects from GitHub.</div>}
                {!loading && !error && <SubjectListComponent subjects={subjects} onSelect={openSubject} />}
            </div>
            <div className="col-12 mt-3">
                <Outlet />
            </div>
        </div>
    </div>    
}

export default ChooseApp; 