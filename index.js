// import React from 'react'


// class app extends React.Component {
// }

var ProjectBox = React.createClass({
  // mixins: [ReactFireMixin],
  // ...
  loadProjectsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: data => {
        data.reverse()
        this.setState({data: data})
      }.bind(this),
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  handleProjectSubmit(project) {
    console.log(project);
    var projects = this.state.data;
    project.id = Date.now();
    var newProjects = [project].concat(projects);
    this.setState({data: newProjects})
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: project,
      success: (data) => {
        data.reverse();
        this.setState({data});
      }.bind(this),
      error: (xhr, status, err) =>  {
        this.setState({data: newProjects})
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  getInitialState() {
    return {data: []};
  },
  componentDidMount() {
    this.loadProjectsFromServer();
    // setInterval(this.loadProjectsFromServer, this.props.pollInterval)
  },
  render() {
    return (
      <div className="projectPage">
        <h1>Projects</h1>
        <ProjectForm onProjectSubmit={this.handleProjectSubmit}/>
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
      return (<Project owner={project.owner} key={project.id}>
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