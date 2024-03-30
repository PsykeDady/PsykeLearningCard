const getGithubDirectory = (path="") => {
    flagLoading(true)
    const fileList = []
    fetch(`${API_GITHUB_CONTENT}${path}${ASSETS_PATH}${BRANCH}`,(file=new GithubModelContent()) => {
        fileList.push(file)
    }).then(()=> {flagLoading(false)})
}