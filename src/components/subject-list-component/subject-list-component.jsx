function SubjectListComponent({subjects=[] }) {
    
    const icontype = (subjectType) => 
        subjectType==="file" ? "file"
        : subjectType==="dir" ? "folder"
        : "question";
    

    const subjectsIcons = subjects?.map(subject=><div className="col-6 col-lg-4" key={subject.name}>
        <button className="btn col-12 border rounded text-overflow-btn">
            <span className={`m-1 fa fa-${icontype(subject.type)}`}></span> 
            {subject.name /** FIXME bisogna far si che testi troppo lunghi si dividano su più righe */ } 
        </button>
    </div>)

    return <div className="p-1 m-1 container-fluid border-1 border-secondary-subtle rounded">
        <div className="row g-2">
            {subjectsIcons}
        </div>
    </div>
}

export default SubjectListComponent