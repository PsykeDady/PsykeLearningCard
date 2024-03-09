class GithubModelContent {
    name;
    path;
    sha;
    size;
    url;
    html_url;
    git_url;
    download_url;
    type;
    _links;

    constructor(
        name = "",
        path = "",
        sha = "",
        size = 0,
        url = "",
        html_url = "",
        git_url = "",
        download_url = "",
        type = "",
        _links = {
            "self":"",
            "git":"",
            "html":""
        }
    ) {
        this.name = name
        this.path = path
        this.sha = sha
        this.size = size
        this.url = url
        this.html_url = html_url
        this.git_url = git_url
        this.download_url = download_url
        this.type = type
        this._links = _links
    }
}


export default GithubModelContent