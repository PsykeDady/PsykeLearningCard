function SubjectListComponent({ subjects = [], onSelect = () => {} }) {
    const icontype = (subjectType) => {
        if (subjectType === "file") return "file";
        if (subjectType === "dir") return "folder";
        return "question";
    };

    const subjectsIcons = subjects?.map(subject => {
        const label = subject.label ?? subject.name ?? subject.subject ?? "Unknown subject";
        const key = subject.id ?? subject.slug ?? subject.name ?? subject.subject;
        const description = subject.description ?? "";

        return <div className="col-6 col-lg-4" key={key}>
        <button className="btn col-12 border rounded text-overflow-btn" onClick={() => onSelect(subject)}>
            <span className={`m-1 fa fa-${icontype(subject.type)}`}></span> 
            <span className="d-block fw-semibold">{label}</span>
            {description !== "" && <small className="d-block text-muted">{description}</small>}
        </button>
    </div>
    })

    return <div className="p-1 m-1 container-fluid border-1 border-secondary-subtle rounded">
        <div className="row g-2">
            {subjectsIcons}
        </div>
    </div>
}

export default SubjectListComponent