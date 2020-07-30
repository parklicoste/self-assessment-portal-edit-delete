import React from 'react'
import axios from 'axios'
import {Modal, Button} from 'react-bootstrap'


class User extends React.Component {

    constructor(props)
    {
      super(props);
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.state =
      {
        users:[],
        userId: '',
        lastname:'',
        firstname:'',
        email:'',
        id:0,
        showEdit: false,
        deleteClicked: false,
        // tempDelUser: ''
      }
    }
   
    
    componentDidMount(){
        axios.get('http://localhost:5000/user/')
        .then((res)=>
        this.setState({
          users:res.data,
          userId: '',
          lastname:'',
          firstname:'',
          email:'',
          showEdit: false,
          deleteClicked: false,
          // tempDelUser: ''
        })
        )
      }

    userIdchange = event =>{
      this.setState({
        userId:event.target.value
      })
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
    
    
    submit(event, id){
      event.preventDefault();
        axios.put(`http://localhost:5000/user/${id}` ,{"userId":this.state.userId ,"lastname":this.state.lastname,"firstname":this.state.firstname,"email":this.state.email})
        .then(()=>{
          this.componentDidMount();
        })
        .catch(err =>{
          this.setState({
            showEdit: true,
            showEmailError: true
          })
        })
      }

      triggerDelete(id){
        axios.get(`http://localhost:5000/user/edit_user/${id}`)
        .then((res)=>{
          this.setState({
            userId: res.data.userId,
            lastname: res.data.lastname,
            firstname: res.data.firstname,
            email: res.data.email,
            id:res.data._ID,
            showEdit: false,
            deleteClicked: true,
            // tempDelUser: this.state.userId
          })
        })
      }
    
    delete(id){
      axios.delete( `http://localhost:5000/user/${id}`)
      .then(()=>{
          this.componentDidMount();
      })
    }
    
    edit_user(id){
        axios.get(`http://localhost:5000/user/edit_user/${id}`)
        .then((res)=>{
          this.setState({
            userId: res.data.userId,
            lastname: res.data.lastname,
            firstname: res.data.firstname,
            email: res.data.email,
            id:res.data._ID,
            showEdit: true
          })
        })
      }
      handleClose() {
        this.setState({ showEdit: false,
                        deleteClicked: false });
      }
      
      handleShow() {
        this.setState({ showEdit: true });
      }
    
    render() {
      return(
          <div className="container mt-5">
          <div className="row mt-5 mb-5"><h1>all user and their access roles which can be updated</h1></div>
          <p>If you want to make new user please go to user access roles and create from there. Thanks</p>
    
          <Modal show={this.state.showEdit} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit User</Modal.Title>
              </Modal.Header>
                  <Modal.Body>
                      <div className="form-group">
                        <input type="number"   min="1" className="form-control" placeholder="User Id" value={this.state.userId} onChange={(e)=>{this.userIdchange(e)}} disabled={this.state.showEdit}/>
                      </div>
                      {/* <div className="form-group"><p class="text-danger">* User Id should be number</p></div> */}
                      <div className="form-group">
                        <input type="text"  className="form-control" placeholder="Last Name" value={this.state.lastname} onChange={(e)=>{this.lastNamechange(e)}} />
                      </div>
                      <div className="form-group">
                        <input type="text"  className="form-control" placeholder="First Name" value={this.state.firstname}  onChange={(e)=>{this.firstNamechange(e)}}/>
                      </div>
                      <div className="form-group">
                        <input type="email"  className="form-control" placeholder="Email" value={this.state.email} onChange={(e)=>{this.emailchange(e)}} disabled={this.state.showEdit}/>
                      </div>
                      {this.state.showEmailError ? <div><p className="text-danger">Error! The Email Id that you enetered exists in this system please use a different one or edit the Email Id tab if you dont wish to change email id then press close or cancel</p> </div> : null}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={(e)=>{this.submit(e, this.state.id)}}>
                      Submit
                    </Button>
                  </Modal.Footer>
              </Modal>
              <Modal show={this.state.deleteClicked} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Delete</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                          <p>Are you sure you want to delete this User Id <b>{this.state.userId}</b>, First Name <b>{this.state.firstname }</b>, Doing this will also delete all the projects associated with this User Id
                            in the sapportal database?
                          </p>
                        </Modal.Body>

                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleClose}>No</Button>
                          <Button variant="btn btn-danger" onClick={(e)=>this.delete(this.state.userId)}>Yes</Button>
                        </Modal.Footer>
              </Modal>
            <div className="container  mt-5">
              <table className="table">
                <thead><tr>
                  <th>User Id</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Email</th>
                  <th>Edit</th>
                  <th>Delete</th></tr>
                </thead>
                <tbody>
                  {this.state.users.map((user, index)=> 
                    
                    
                  <tr key={index}> 
                    <td>{user.userId}</td>
                    <td>{user.lastname}</td>
                    <td>{user.firstname}</td>
                    <td>{user.email}</td>
                    <td>
                      <Button className="btn btn-sm btn-primary" onClick={(e)=>this.edit_user(user._ID)} > 
                        <i className="fa fa-pencil"></i>
                      </Button>
                    </td>
                    <td>
                      <Button className="btn btn-sm btn-danger" onClick={(e)=>this.triggerDelete(user._ID)}>
                        <i className="fa fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
  )}
}
export default User;