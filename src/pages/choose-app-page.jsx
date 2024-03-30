import SubjectListComponent from "../components/subject-list-component/subject-list-component";
import GithubModelContent from "../models/github-content.model";

function ChooseApp(params) {
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
                <SubjectListComponent
                    subjects={[new GithubModelContent(
                        "Unical",
                        "PATH",
                        "SHA",
                        123,
                        "URL",
                        "HTMLURTL",
                        "GIT URL",
                        "downloadURL",
                        "dir"
                    ),new GithubModelContent(
                        "algoritmiestrutturedati.json",
                        "PATH",
                        "SHA",
                        123,
                        "URL",
                        "HTMLURTL",
                        "GIT URL",
                        "downloadURL",
                        "file"
                    ),new GithubModelContent(
                        "Altro",
                        "PATH",
                        "SHA",
                        123,
                        "URL",
                        "HTMLURTL",
                        "GIT URL",
                        "downloadURL",
                        "altro"
                    )]}
                />
            </div>
        </div>
    </div>    
}

export default ChooseApp; 