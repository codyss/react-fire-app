var ProjectBox = React.createClass({
  mixins: [ReactFireMixin],
  handleProjectSubmitFirebase(project) {
    this.firebaseRefs.data.push({
      owner: project.owner, detail: project.detail
    });
    this.setState({owner: "", detail: ""})
  },
  getInitialState() {
    return {data: []};
  },
  componentWillMount() {
    this.firebaseRef = new Firebase("https://reactfiresample.firebaseio.com/projects");
    this.bindAsArray(this.firebaseRef, "data");
  },
  componentWillUnmount: function() {
  this.firebaseRef.off();
  },
  render() {
    return (
      <div className="projectPage">
        <h1>Projects</h1>
        <ProjectForm onProjectSubmit={this.handleProjectSubmitFirebase}/>
          <div className="projectBox" >
            <ProjectList data={this.state.data} />
          </div>
      </div>
    )
  }
});

var ProjectList = React.createClass({
  render() {
    var projectNodes = this.props.data.map(project => {
      return (<Project owner={project.owner} key={project.$id}>
                {project.detail}
              </Project>);
      ;
    })
    return (
      <div className="projectList">
        {projectNodes}
      </div>
    )
  }
})


var ProjectForm = React.createClass({
  getInitialState() {
    return {owner: '', text: ''}
  },
  handleProjectChange(e) {
    this.setState({owner: e.target.value});
  },
  handleDetailChange(e) {
    this.setState({detail: e.target.value})
  },
  handleSubmit(e) {
    e.preventDefault();
    var owner = this.state.owner.trim();
    var detail = this.state.detail.trim();
    if (!detail || !owner) return;
    this.props.onProjectSubmit({owner, detail})
    this.setState({owner: "", detail: ""})
  },
  render() {
    return (
      <form className="projectForm form-control" onSubmit={this.handleSubmit}>
        <input 
          type="text"
          placeholder="Project name"
          value = {this.state.owner}
          onChange = {this.handleProjectChange}
        />
        <input 
          type="text"
          placeholder="Details of project..."
          value={this.state.detail}
          onChange={this.handleDetailChange}
        />
        <br />
        <button type="submit" className="btn btn-default">Submit</button>
      </form>
    )
  }
})



var Project = React.createClass({
  render() {
    return (
      <div className="project">
      <h2 className="projectOwner">
        {this.props.owner}
      </h2>
      <text>{this.props.children}</text>
      </div>
    )
  }
})


ReactDOM.render(
  <ProjectBox url="/api/comments" pollInterval={2000}/>,
  document.getElementById('app')
  )