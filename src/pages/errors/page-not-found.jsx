import { useParams } from "react-router-dom";

function PageNotFound(page) {
    const pathParams = useParams()

    return <div className="container-fluid">
        404: No page {page} Found!
    </div>
}


export default PageNotFound