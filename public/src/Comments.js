import React from 'react';
import axios from 'axios';




class Comments extends React.Component {

constructor(props)
{
  super(props);
  this.state =
  {
    feedback:[],
    studentId:'',
    name: '',
    comment:'',
    id:0,
  }
}

componentDidMount(){
  axios.get('http://localhost:5000/comments/')
  .then((res)=>
  this.setState({
    feedback:res.data,
    studentId: '',
    name:'',
    comment:'',
    id:0
  })
  )
}
studentIdchange = event =>{
  this.setState({
    studentId:event.target.value
  })
}
namechange = event =>{
    this.setState({
      name:event.target.value
    })
  }
  commentchange = event =>{
    this.setState({
      comment:event.target.value
    })
  }

submit(event, id){
  event.preventDefault();
  if(id===0){
  axios.post('http://localhost:5000/comments/',{"studentId": this.state.studentId, "name":this.state.name, "comment":this.state.comment})
  .then(()=>{
    this.componentDidMount();
  })
  }else{
    axios.put(`http://localhost:5000/comments/${id}`,{"studentId":this.state.studentId, "name":this.state.name, "comment":this.state.comment})
  .then(()=>{
    this.componentDidMount();
  })
  }
}

delete(id){
  axios.delete(`http://localhost:5000/comments/${id}`)
  .then(()=>{
    this.componentDidMount();
  })
}

getone(id){
  axios.get(`http://localhost:5000/comments/getone/${id}`)
  .then((res)=>{
    this.setState({
      studentId: res.data.studentId,
      name: res.data.name,
      comment: res.data.comment,
      id:res.data._ID
    })
  })
}

createNew(event){
  event.preventDefault();
    this.setState({
      studentId: '',
      name:'',
      comment:'',
      id:0
    })
}

 

render() {
  return(
      <div className="container mt-5">
        <div className="row mt-5 mb-5"><h1>various students comments are</h1></div>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={(e)=>{this.createNew(e)}}>
          Create new comment
        </button>

        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabelcreate">Create New comment</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div class="modal-body">
                <form className="mt-5" onSubmit={(e)=>{this.submit(e, this.state.id)}}>
                    <div className="form-group">
                        <input type="number"   min="1" className="form-control" placeholder="Student Id" value={this.state.studentId} onChange={(e)=>{this.studentIdchange(e)}} />
                    </div>
                    <div className="form-group"><p class="text-danger">* Student Id should be number</p></div>
                    <div className="form-group">
                        <input type="text"  className="form-control" placeholder="Name" value={this.state.name} onChange={(e)=>{this.namechange(e)}} />
                    </div>
                    <div className="form-group">
                        <input type="text"  className="form-control" placeholder="Comments" value={this.state.comment}  onChange={(e)=>{this.commentchange(e)}}/>
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
              <th>Student Id</th>
              <th>Name</th>
              <th>Comments</th>
              <th>Edit</th>
              <th>Delete</th>
            </thead>
            <tbody>

              {this.state.feedback.map(person=>
                
                
              <tr>
                <td>{person.studentId}</td>
                <td>{person.name}</td>
                <td>{person.comment}</td>
                <td>
                  <button onClick={(e)=>this.getone(person._ID)} className="btn btn-sm btn-primary" data-toggle="modal" data-target="#exampleModal">
                    <i className="fa fa-pencil"></i>
                  </button>
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

export default Comments;
