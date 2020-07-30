import React from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap'




class Faculty extends React.Component {

constructor(props)
{
  super(props);
  this.handleShow = this.handleShow.bind(this);
  this.handleClose = this.handleClose.bind(this);
  this.state =
  {
    facultymembers:[],
    lastname:'',
    firstname: '',
    email:'',
    id:0,
    show: false,
    showEdit: false,
    deleteClicked: false,
    message: ''
  }
}

componentDidMount(){
  axios.get('http://localhost:5000/faculty/')
  .then((res)=>
  this.setState({
    facultymembers:res.data,
    lastname:'',
    firstname: '',
    email:'',
    id:0,
    show: false,
    deleteClicked: false,
    showEdit: false,
    emptyEmail: false
  })
  )
}

lastNamechange = event =>{
    this.setState({
      lastname:event.target.value
    })
  }

  firstNamechange = event =>{
      this.setState({
        firstname:event.target.value
      })
    }
  
  emailchange = event =>{
    this.setState({
      email:event.target.value
    })
  }
  validateEmail(event, id){
    if(this.state.email === ''){
      this.setState({
        show: true,
        emptyEmail: true
      })
    }
    
    else if ((!this.state.email.includes('@')) || (!this.state.email.includes('.'))){
      this.setState({
        show: true,
        emptyEmail: true
      })
    }
  else if(this.state.email.includes('@') || this.state.email.includes('.')){
      let lastAtPos = this.state.email.lastIndexOf('@');
      let lastDotPos = this.state.email.lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.email.indexOf('@@') == -1 && lastDotPos > 2 && (this.state.email.length - lastDotPos) > 2)) {
        this.setState({
          show: true,
          emptyEmail: true
        })
       }
       else{
        this.setState({
          show: false,
          errorEmail: false,
          emptyUserId: false
        })
        this.submit(event, id)
       }
}
  }

submit(event, id){
  event.preventDefault();
  if(id===0){
  axios.post('http://localhost:5000/faculty/',{"lastname":this.state.lastname,"firstname":this.state.firstname, "email":this.state.email})
  .then(()=>{
    this.componentDidMount();
  })
  .catch(err =>{

    if(err.response.data.message === 'email'){
      this.setState({
        show: true,
        showEmailError: true
      })
      
    }
  })
  }else{
    axios.put(`http://localhost:5000/faculty/${id}`,{"lastname":this.state.lastname,"firstname":this.state.firstname, "email":this.state.email})
  .then(()=>{
    this.componentDidMount();
  })
  }
}
triggerDelete(id){
  axios.get(`http://localhost:5000/faculty/getone/${id}`)
  .then((res)=>{
    this.setState({
      lastname: res.data.lastname,
      firstname: res.data.firstname,
      email: res.data.email,
      id:res.data._ID,
      show: false,
      message: 'Delete Faculty',
      deleteClicked: true
    })
  })
}

delete(id){
  axios.delete(`http://localhost:5000/faculty/${id}`)
  .then(()=>{
    this.componentDidMount();
  })
}

getone(id){
  axios.get(`http://localhost:5000/faculty/getone/${id}`)
  .then((res)=>{
    this.setState({
      lastname: res.data.lastname,
      firstname: res.data.firstname,
      email: res.data.email,
      id:res.data._ID,
      show: true,
      message: 'Edit Faculty',
      emptyEmail: false
    })
  })
}

createNew(event){
  event.preventDefault();
    this.setState({
      lastname: '',
      firstname: '',
      email:'',
      id:0,
      show: true,
      message: 'Create New Faculty',
      emptyEmail: false,
      deleteClicked: false
    })
}

handleClose() {
  this.setState({ show: false,
                  deleteClicked: false });
}

handleShow() {
  this.setState({ show: true });
}
 

render() {
  return(
      <div className="container mt-5">
        <div className="row mt-5 mb-5"><h1>The Faculty details overview</h1></div>
        <Button type="button" class="btn btn-primary" onClick={(e)=>{this.createNew(e)}}>
          Create New Faculty
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{this.state.message}</Modal.Title>
              </Modal.Header>
                  <Modal.Body>
                    <div className="form-group">
                          <input type="text"  className="form-control" placeholder="Last Name" value={this.state.lastname} onChange={(e)=>{this.lastNamechange(e)}} />
                      </div>
                      <div className="form-group">
                          <input type="text"  className="form-control" placeholder="First Name" value={this.state.firstname}  onChange={(e)=>{this.firstNamechange(e)}}/>
                      </div>
                    <div className="form-group">
                      <input type="email" onChange={(e)=>{this.emailchange(e)}} className="form-control" placeholder="Email" value={this.state.email} />
                    </div>
                    {this.state.emptyEmail ? <div><p className="text-danger">Error! The email id cannot be empty or syntax is wrong.</p></div> : this.state.showEmailError ? <div><p className="text-danger">Error! This email id already exists in faculty database please use a different one.</p></div> : null}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={(e)=>{this.validateEmail(e, this.state.id)}}>
                      Submit
                    </Button>
                  </Modal.Footer>
              </Modal>
              <Modal show={this.state.deleteClicked} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Delete</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                          <p>Are you sure you want to delete this Faculty with First Name <b>{this.state.firstname}</b>?</p>
                        </Modal.Body>

                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleClose}>No</Button>
                          <Button variant="btn btn-danger" onClick={(e)=>this.delete(this.state.id)}>Yes</Button>
                        </Modal.Footer>
              </Modal>
        <div className="container  mt-5">
          <table className="table">
            <thead>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Email</th>
              <th>Edit</th>
              <th>Delete</th>
            </thead>
            <tbody>

              {this.state.facultymembers.map(person=>
                
                
              <tr>
                <td>{person.lastname}</td>
                <td>{person.firstname}</td>
                <td>{person.email}</td>
                <td>
                  <button onClick={(e)=>this.getone(person._ID)} className="btn btn-sm btn-primary">
                    <i className="fa fa-pencil"></i>
                  </button>
                </td>
                <td>
                  <button onClick={(e)=>this.triggerDelete(person._ID)} className="btn btn-sm btn-danger" >
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

export default Faculty;
