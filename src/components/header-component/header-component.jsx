import { useSelector } from "react-redux"

function HeaderComponent() {

    const appStore= useSelector(store => store.appinfo)

    return <nav className="navbar">
      <div className="container-fluid app-header-nav">
        <span className="navbar-brand mb-0 h1">{appStore.title}</span>
        <a className="btn btn-outline-dark btn-sm app-home-button" href="/">
          Home
        </a>
      </div>
    </nav>
}

export default HeaderComponent