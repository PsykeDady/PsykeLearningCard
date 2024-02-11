function Loading() {
    return <div className="container">
        <div className="row">\
            <div className="col-12">
                <div className="position-absolute top-50 start-50 translate-middle">
                    <i className="fa fa-spinner fa-pulse fa-5x fa-fw text-white text-shadow-black"></i>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    </div>
}


export default Loading