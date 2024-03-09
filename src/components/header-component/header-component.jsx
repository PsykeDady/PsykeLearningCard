import { useSelector } from "react-redux"

function HeaderComponent() {

    const appStore= useSelector(store => store.appinfo)

    return <nav className="navbar">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">{appStore.title}</span>
      </div>
    </nav>
}

export default HeaderComponent