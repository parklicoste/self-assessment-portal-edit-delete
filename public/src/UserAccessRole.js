import React from 'react'
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap'

let userAccessApi = `http://localhost:5000/useraccess/`
let roleApi = `http://localhost:5000/role/`

class UserAccessRole extends React.Component {

    constructor(props)
    {
      super(props);

      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);

      this.state =
      {
        users:[],
        roles:[],
        userId: '',
        message: 'Create New User',
        lastname:'',
        firstname:'',
        email:'',
        accessrole: "",
        id_user:0,
        id_role:0,
        merged: [],
        show: false,
        showError: false,
        showEdit: false,
        showEmailError: false,
        deleteClicked: false,
        // tempDelUser: '',
        errorEmail: false,
        emptyUserId: false
      }
    }
   
    
    componentDidMount(){
      // for retrieving the accessing data
      let req_user = axios.get(userAccessApi);
      let req_role = axios.get(roleApi);

      axios.all([req_user, req_role]).then(axios.spread((...res) =>{
        this.setState({
          roles:res[1].data,
          userId: '',
          accessrole: "Student",
          id_role:0,
          users:res[0].data,
          lastname:'',
          firstname:'',
          email:'',
          id_user:0,
          deleteClicked: false,
          merged: [],
          errorEmail: false,
          emptyUserId: false
        })
      }))
      
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
    
    accessRolechange = event =>{
      this.setState({
        accessrole:event.target.value
      })
    } 
    
    validateUserAndEmail(event, id_user, id_role){
      event.preventDefault();

      if(this.state.userId === ''){
        this.setState({
          show: true,
          emptyUserId: true
        })
      }
      if(this.state.userId !== ''){
        this.setState({
          show: false,
          emptyUserId: false
        })
      }
      if(this.state.email === '' ){
          this.setState({
            show: true,
            errorEmail: true
          })
        }
      else if ((!this.state.email.includes('@')) || (!this.state.email.includes('.'))){
          this.setState({
            show: true,
            errorEmail: true
          })
        }
      else if(this.state.email.includes('@') || this.state.email.includes('.')){
          let lastAtPos = this.state.email.lastIndexOf('@');
          let lastDotPos = this.state.email.lastIndexOf('.');

          if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.email.indexOf('@@') == -1 && lastDotPos > 2 && (this.state.email.length - lastDotPos) > 2)) {
            this.setState({
              show: true,
              emptyUserId: false,
              errorEmail: true
            })
           }
           else{
            this.setState({
              show: false,
              errorEmail: false,
              emptyUserId: false
            })
            this.submit(event, id_user, id_role)
           }
    }
  }

    submit(event, id_user, id_role){
      event.preventDefault();
      if(id_user===0 && id_role===0){
        // for sending access data
        axios.post(userAccessApi,{"userId":this.state.userId ,"lastname":this.state.lastname,"firstname":this.state.firstname,"email":this.state.email})
        .then(()=>{
          // for sending role data
          axios.post(roleApi,{"userId":this.state.userId ,"accessrole":this.state.accessrole})
          .then(()=>{
            this.componentDidMount();
          })
          this.componentDidMount();
        })
        .catch(err =>{
          if(err.response){
            console.log(err.response)
          if(err.response.data.message === 'bothEmailAndUserIdExists'){
            this.setState({
              show: true,
              showError: true,
              showEmailError: true
            })
            
          }
          else if (err.response.data.message === 'email'){
            this.setState({
              show: true,
              showError: false,
              showEmailError: true
            })
          }
          else if (err.response.data.message === 'userId'){
            this.setState({
              show: true,
              showError: true,
              showEmailError: false
            })
          }
          else if(err.response.data.message === 'emptyUserIdAndEmail'){
            this.setState({
              show: true,
              emptyUserId: true,
              errorEmail: true
            })
          }
          else if(err.response.data.message === 'emptyUserId'){
            this.setState({
              show: true,
              emptyUserId: true,
              errorEmail: false
            })
          }
          else if(err.response.data.message === 'emptyEmail'){
            this.setState({
              show: true,
              emptyUserId: false,
              errorEmail: true
            })
          }
          return Promise.reject(err);
        }
        })
      }else{
        axios.put(userAccessApi + `${id_user}` ,{"userId":this.state.userId ,"lastname":this.state.lastname,"firstname":this.state.firstname,"email":this.state.email})
        .then(()=>{
          // this.componentDidMount();
          axios.put(roleApi + `${id_role}` ,{"userId":this.state.userId ,"accessrole":this.state.accessrole})
          .then(()=>{
            this.componentDidMount();
          })
        // this.componentDidMount();
        })
        .catch(err =>{
          this.setState({
            show: true,
            showEmailError: true
          })
        })
        }
      }
    
    triggerDelete(id_user, id_role){
      let req_user = axios.get( userAccessApi + `/edit_user/${id_user}`);
      let req_role = axios.get( roleApi + `/edit_user/${id_role}`);

      axios.all([req_user, req_role]).then(axios.spread((...res) =>{
        this.setState({
          userId: res[0].data.userId,
          lastname: res[0].data.lastname,
          firstname: res[0].data.firstname,
          email: res[0].data.email,
          id_user:res[0].data._ID,
          accessrole: res[1].data.accessrole,
          id_role:res[1].data._ID,
          showEdit: false,
          show: false,
          message: 'Edit User',
          showEmailError: false,
          emptyUserId: false,
          errorEmail: false,
          deleteClicked: true,
          // tempDelUser: this.state.userId
        })
      }))
    }

    delete(userId){
      axios.delete(userAccessApi + `${userId}`)
      .then(()=>{
        // axios.delete(roleApi + `${id_role}`)
        // .then(()=>{
        //   this.componentDidMount();
        // })
        this.componentDidMount();
      })
    }
    
    edit_user(id_user, id_role){
      let req_user = axios.get( userAccessApi + `/edit_user/${id_user}`);
      let req_role = axios.get( roleApi + `/edit_user/${id_role}`);

      axios.all([req_user, req_role]).then(axios.spread((...res) =>{
        this.setState({
          userId: res[0].data.userId,
          lastname: res[0].data.lastname,
          firstname: res[0].data.firstname,
          email: res[0].data.email,
          id_user:res[0].data._ID,
          accessrole: res[1].data.accessrole,
          id_role:res[1].data._ID,
          showEdit: true,
          show: true,
          message: 'Edit User',
          showEmailError: false,
          emptyUserId: false,
          errorEmail: false
        })
      }))
      
    }
 
    createNewUser(event){
      event.preventDefault();
        this.setState({
          userId: '',
          lastname:'',
          firstname:'Student',
          email:'',
          accessrole:'Student',
          message: 'Create New User',
          id_user:0,
          id_role:0,
          show: true,
          showEdit: false,
          showError: false,
          showEmailError: false,
          emptyUserId: false,
          errorEmail: false
        })
    }
    
  mergeTwoArray(users, roles){
    this.state.merged = []

    for (let i=0; i< users.length ; i++){
      if (roles.length > users.length || roles.length < users.length){
        break
      }
      else if(users.length === roles.length){
        this.state.merged.push({
          "id_user": users[i]._ID,
          "id_role": roles[i]._ID,
          "userId": users[i].userId,
          "lastname": users[i].lastname,
          "firstname": users[i].firstname,
          "email": users[i].email,
          "accessrole": roles[i].accessrole
       })
      }
    }
    return this.state.merged
    
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
          <div className="row mt-5 mb-5"><h1>all user and their access roles which can be updated</h1></div>
            <Button type="button" onClick={(e)=>{this.createNewUser(e)}}>
              Create New User
            </Button>
    
            <Modal show={this.state.show} onHide={this.handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.message}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                      <div className="form-group">
                        <input type="number"   min="1" className="form-control" placeholder="User Id" value={this.state.userId} onChange={(e)=>{this.userIdchange(e)}} disabled={this.state.showEdit} required/>
                      </div>
                      {this.state.showEdit ? null : (this.state.emptyUserId ? <div>
                        <p className="text-danger">Error! The User Id can not be empty</p></div> : (this.state.showError ? 
                        <div><p className="text-danger">Error! The User Id that you enetered exists in this system please use a different one or edit the User Id tab</p></div> 
                        : <div className="form-group"><p className="text-danger">* User Id should be number</p></div>))}
                      <div className="form-group">
                        <input type="text"  className="form-control" placeholder="Last Name" value={this.state.lastname} onChange={(e)=>{this.lastNamechange(e)}} />
                      </div>
                      <div className="form-group">
                        <input type="text"  className="form-control" placeholder="First Name" value={this.state.firstname}  onChange={(e)=>{this.firstNamechange(e)}}/>
                      </div>
                      <div className="form-group">
                        <input type="email"  className="form-control" placeholder="Email" value={this.state.email} onChange={(e)=>{this.emailchange(e)}} disabled={this.state.showEdit}/>
                      </div>
                      {this.state.errorEmail ? <div><p className="text-danger"> The Email Id cannot be empty or syntax in not correct</p></div> : this.state.showEmailError ? <div><p className="text-danger">Error! The Email Id that you enetered exists in this system please use a different one or edit the Email Id tab if you dont wish to change email id then press close or cancel</p> </div> : null}
                      
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                        <label className="input-group-text" for="inputGroupSelect02">Role</label>
                        </div>
                        <select className="custom-select" id="inputGroupSelect02"  value={this.state.accessrole} onChange={(e)=>{this.accessRolechange(e)}}>
                          <option selected>Choose...</option>
                          <option value="Admin">Admin</option>
                          <option value="Student">Student</option>
                        </select>
                      </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={(e)=>{this.validateUserAndEmail(e, this.state.id_user, this.state.id_role)}}>
                      Submit
                    </Button>
                  </Modal.Footer>
            </Modal>
            <Modal show={this.state.deleteClicked} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Delete</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                        <p>Are you sure you want to delete user with User ID <b>{this.state.userId}</b> and First Name <b>{this.state.firstname }</b>, Doing this will also delete the project associated with this User
                            in the sapportal database.
                          </p>
                        </Modal.Body>

                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleClose}>No</Button>
                          <Button variant="btn btn-danger" onClick={(e)=>this.delete(this.state.userId)}>Yes</Button>
                        </Modal.Footer>
              </Modal>
            <div className="container  mt-5">
              <table className="table">
                <thead>
                  <tr>
                  <th>User Id</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Email</th>
                  <th>Access Role</th>
                  <th>Edit</th>
                  <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {this.mergeTwoArray(this.state.users, this.state.roles).map((user, index)=> 
                    
                    
                  <tr key={index}>
                    <td>{user.userId}</td>
                    <td>{user.lastname}</td>
                    <td>{user.firstname}</td>
                    <td>{user.email}</td>
                    <td>{user.accessrole}</td>
                    <td>
                      <Button className="btn btn-sm btn-primary"  onClick={(e)=>this.edit_user(user.id_user, user.id_role)} > 
                        <i className="fa fa-pencil"></i>
                      </Button>
                    </td>
                    <td>
                      <Button className="btn btn-sm btn-danger" onClick={(e)=>this.triggerDelete(user.id_user, user.id_role)}>
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
export default UserAccessRole