import { useSelector } from "react-redux"

function FooterComponent() {

    const contacts = useSelector(store => store.contacts)

    const contactsDetail = (details) => {
        return details.map(detail => <div className="row">
            <div className="col-11 offset-1">
                <a
                    className="small link-link-secondary"
                    href={detail.link}>
                        {detail.text} <span className={`fa fa-${detail.icon}`}></span>
                </a>
            </div>
        </div> )
    }

    const contactsRow = Object.keys(contacts).map(i => {
        return <div className="row">
            <div className="col-10 offset-1 text-muted">
               <span className="fw-bolder h5">{i}</span>
               {contactsDetail(contacts[i])} 
            </div>
        </div>
    })

    return <div className="container">
        {contactsRow}
    </div>
}


export default FooterComponent