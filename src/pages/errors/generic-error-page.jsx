import { useLocation, useRouteError } from "react-router-dom"
import NoSubjectErrorPage from "./no-subject-error-page"
import PageNotFound from "./page-not-found"

/**
 * 
 * @param {{type:"NOSUBJECT"|"PAGENOTFOUND"|"INTERNALERROR"|string,payload:string}}   
 * @returns Error Page Component
 */
function GenericErrorPage({type, payload}) {

    const routerError= useRouteError()
    const location = useLocation()
    
    const page = (payload && payload.page)? payload.page : location.pathname;


    return <div className="container-fluid">
        <div className="row">
            <div className="col-9">
                <img src="/assets/italian-hand-italy.gif" alt="" className="img-fluid" />
            </div>
            <div className="col-3 text-center d-flex align-items-center">
                {(type==="NOSUBJECT")?
                    <NoSubjectErrorPage subject={payload}/>
                :(type==="PAGENOTFOUND" || routerError.status===404)?
                    <PageNotFound page={page} />
                :
                    <span>
                        Generic {type} error {payload&& payload!==null&&<span>with payload: <br></br> {payload}</span>}
                    </span>}
            </div>
        </div>
    </div>
}


export default GenericErrorPage