import React from 'react';
import axios from 'axios';
// import FlightLogSummary from './FlightLogSummary'




class Home extends React.Component {

constructor(props)
{
  super(props);
  this.state =
  {
    people:[],
    name:'',
    email:'',
    password:'',
    id:0,
    showDashboard: false
  }
}

toggleShowDashboard = () => {
  this.setState(prevState => ({
    showDashboard: !prevState.showDashboard
  }))
}

componentDidMount(){
  axios.get('http://localhost:5000/')
  .then((res)=>
  this.setState({
    people:res.data,
    name:'',
    email:'',
    password:'',
    id:0
  })
  )
}

namechange = event =>{
  this.setState({
    name:event.target.value
  })
}

emailchange = event =>{
  this.setState({
    email:event.target.value
  })
}

passwordchange = event =>{
  this.setState({
    password:event.target.value
  })
}

submit(event, id){
  event.preventDefault();
  if(id===0){
  axios.post('http://localhost:5000',{"name":this.state.name,"email":this.state.email,"password":this.state.password})
  .then(()=>{
    this.componentDidMount();
  })
  }else{
    axios.put(`http://localhost:5000/${id}`,{"name":this.state.name,"email":this.state.email,"password":this.state.password})
  .then(()=>{
    this.componentDidMount();
  })
  }
}

delete(id){
  axios.delete(`http://localhost:5000/${id}`)
  .then(()=>{
    this.componentDidMount();
  })
}

getone(id){
  axios.get(`http://localhost:5000/getone/${id}`)
  .then((res)=>{
    this.setState({
      name: res.data.name,
      email: res.data.email,
      password: res.data.password,
      id:res.data._ID,
      showModal: true
    })
  })
}

createNew(event){
  event.preventDefault();
    this.setState({
      name:'',
      email:'',
      password:'',
      id:0
    })
}

 

render() {
  return(
      <div className="row mt-5">
        {/* <FlightLogSummary /> */}
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={(e)=>{this.createNew(e)}}>
          Create New
        </button>

        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabelcreate">Create New</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div class="modal-body">
                <form className="mt-5" onSubmit={(e)=>{this.submit(e, this.state.id)}}>
                  <div className="form-group">
                    <input type="text" onChange={(e)=>{this.namechange(e)}} className="form-control" placeholder="Username" value={this.state.name} />
                  </div>
                  <div className="form-group">
                    <input type="email" onChange={(e)=>{this.emailchange(e)}} className="form-control" placeholder="Email" value={this.state.email} />
                  </div>
                  <div className="form-group">
                    <input type="password" onChange={(e)=>{this.passwordchange(e)}} className="form-control" placeholder="Password" value={this.state.password} />
                  </div>
                  <button className="btn btn-block btn-primary">Submit</button>
                  <button type="button" class="btn btn-block btn-secondary" data-dismiss="modal">Close</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="container  mt-5">
          <table className="table">
            <thead>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Edit</th>
              <th>Delete</th>
            </thead>
            <tbody>

              {this.state.people.map(person=>
                
                
              <tr>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{person.password}</td>
                <td>
                  <button onClick={(e)=>this.getone(person._ID)} className="btn btn-sm btn-primary" data-toggle="modal" data-target="#exampleModal">
                    <i className="fa fa-pencil"></i>
                  </button>

                  {/* <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Edit Mode</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body" >
                          <form className="mt-5" onSubmit={(e)=>{this.submit(e, this.state.id)}}>
                            <div className="form-group">
                              <input type="text" onChange={(e)=>{this.namechange(e)}} className="form-control" placeholder="Username" value={this.state.name} />
                            </div>
                            <div className="form-group">
                              <input type="email" onChange={(e)=>{this.emailchange(e)}} className="form-control" placeholder="Email" value={this.state.email} />
                            </div>
                            <div className="form-group">
                              <input type="password" onChange={(e)=>{this.passwordchange(e)}} className="form-control" placeholder="Password" value={this.state.password} />
                            </div>
                              <button className="btn btn-block btn-primary">Submit</button>
                              <button type="button" className="btn btn-secondary btn-block" data-dismiss="modal">Close</button>
          
                          </form>
                        </div>
                      </div>
                    </div>
                  </div> */}

                </td>
                <td>
                  <button onClick={(e)=>this.delete(person._ID)} className="btn btn-sm btn-danger" >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    // </div>
  )}
}

export default Home;
