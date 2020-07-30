import React from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap'
import Result from './Result'



class Project extends React.Component {

  
constructor(props)
{
  super(props);
  this.handleShow = this.handleShow.bind(this);
  this.handleClose = this.handleClose.bind(this);
  // this.handleShowError = this.handleShowError.bind(this);
  // this.handleCloseError = this.handleCloseError.bind(this);
  
  this.state =
  {
    people:[],
    studentId: '',
    lastname:'',
    firstname:'',
    groupno:'',
    title:'',
    supervisor:'',
    cosupervisor:'',
    assessmentstatus:'0',
    message: 'Make New Project',
    id:0,
    show: false,
    showEdit: false,
    showError: false,
    notExistError: false,
    deleteClicked: false,
    tempDelUser: '',
    emptyId: false,
    emptyGroupNo: false
  }

}

componentDidMount(){
  axios.get('http://localhost:5000/project/')
  .then((res)=>
    this.setState({
      people:res.data,
      studentId: '',
      lastname:'',
      firstname:'',
      groupno:'',
      title:'',
      supervisor:'',
      cosupervisor:'',
      assessmentstatus:'0',
      id:0,
      show: false,
      showEdit: false,
      showError: false,
      tempDelUser: '',
      deleteClicked: false,
      emptyId: false
    })
  )
}
  studentIdchange = event =>{
    this.setState({
      studentId:event.target.value
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
  groupNochange = event =>{
    this.setState({
      groupno:event.target.value
    })
  }
  titlechange = event =>{
    this.setState({
      title:event.target.value
    })
  }
  supervisorchange = event =>{
    this.setState({
      supervisor:event.target.value
    })
  }
  coSupervisorchange = event =>{
    this.setState({
      cosupervisor:event.target.value
    })
  }
  assessmentStatuschange = event =>{
    this.setState({
      assessmentstatus:event.target.value

    })
  }
  
validateStudentId(event, id){
    if(this.state.studentId === ''){
      this.setState({
        show: true,
        // emptyGroupNo: false,
        emptyId: true
      })
    }
    if(this.state.studentId !== ''){
      this.setState({
        show: false,
        emptyId: false
      })
    }
    if(this.state.groupno === ''){
      this.setState({
        show: true,
        emptyGroupNo: true
      })
    }
    else{
      this.setState({
        show: false,
        emptyGroupNo: false
      })
      this.submit(event, id);
    }
}
//   routing methods
submit(event, id){
  this.setState({ 
    show: false,
    showError: false,
    emptyId: false,
    emptyGroupNo: false
   });
  event.preventDefault();
  if(id===0){
    axios.post('http://localhost:5000/project/',{
        "studentId":this.state.studentId,
        "lastname":this.state.lastname,
        "firstname":this.state.firstname,
        "groupno":this.state.groupno,
        "title":this.state.title,
        "supervisor": this.state.supervisor,
        "cosupervisor": this.state.cosupervisor,
        "assessmentstatus": this.state.assessmentstatus
      })
    .then(()=>{
      this.componentDidMount();
    })
    .catch(err =>{
      if(err.response){
        if(err.response.data.message === 'studentId'){
          this.setState({
            show: true,
            emptyId: false,
            showError: true
          })
        }
        else if(err.response.message === "emptyStudentId") {
          this.setState({
            emptyId:  true,
            show: true
          })
        }
        else{
          this.setState({
            show: true,
            notExistError: true
          })
        }
      }

      
    })
  }else{
    //  let tempStuId = this.state.studentId
    axios.put(`http://localhost:5000/project/${id}`,{
      "studentId":this.state.studentId,
      "lastname":this.state.lastname,
      "firstname":this.state.firstname,
      "groupno":this.state.groupno,
      "title":this.state.title,
      "supervisor": this.state.supervisor,
      "cosupervisor": this.state.cosupervisor,
      "assessmentstatus": this.state.assessmentstatus
    })
  .then(()=>{
    this.componentDidMount();
  })
  }
}
triggerDelete(id){
  axios.get(`http://localhost:5000/project/getone/${id}`)
  .then((res)=>{
    this.setState({
        studentId: res.data.studentId,
        lastname:res.data.lastname,
        firstname:res.data.firstname,
        groupno:res.data.groupno,
        title:res.data.title,
        supervisor:res.data.supervisor,
        cosupervisor:res.data.cosupervisor,
        assessmentstatus:res.data.assessmentstatus,
        id: res.data._ID,
        show: false,
        showEdit: false,
        showError: false,
        notExistError: false,
        emptyId: false,
        deleteClicked: true,
        tempDelUser: id
    })
  })
}

delete(id){
  axios.delete(`http://localhost:5000/project/${id}`)
  .then(()=>{
    this.componentDidMount();
  })
}

getone(id){
  // this.setState({});
  axios.get(`http://localhost:5000/project/getone/${id}`)
  .then((res)=>{
    this.setState({
        studentId: res.data.studentId,
        lastname:res.data.lastname,
        firstname:res.data.firstname,
        groupno:res.data.groupno,
        title:res.data.title,
        supervisor:res.data.supervisor,
        cosupervisor:res.data.cosupervisor,
        assessmentstatus:res.data.assessmentstatus,
        id: res.data._ID,
        message: 'Edit Project',
        show: true,
        showEdit: true,
        showError: false,
        notExistError: false,
        emptyId: false
    })
  })
}

createNew(event){
  event.preventDefault();
  // this.setState({ show: true });
    this.setState({
        show: true,
        studentId: '',
        lastname:'',
        firstname:'',
        groupno:'',
        title:'',
        supervisor:'',
        cosupervisor:'',
        assessmentstatus:'0',
        id:0,
        showEdit: false,
        showError: false,
        notExistError: false,
        emptyId: false,
        emptyGroupNo: false
    })
}

handleClose() {
  this.setState({ show: false,
                  deleteClicked: false});
}

handleShow() {
  this.setState({ show: true });
}

render() {
  return(
    
      <div className="container mt-5">
        <div className="row mt-5 mb-5"><h1>The project Database overview</h1></div>

        <Button type="button" class="btn btn-primary"   onClick={(e)=>{this.createNew(e)}}>
          Create New Project
        </Button>
        <Modal  show={this.state.show} onHide={this.handleClose} >
          <Modal.Header closeButton>
              <Modal.Title>{this.state.message}</Modal.Title>
          </Modal.Header>
              <Modal.Body>
                    <div className="form-group">
                        <input type="number"   min="1" className="form-control" placeholder="Student Id" value={this.state.studentId} onChange={(e)=>{this.studentIdchange(e)}} disabled={this.state.showEdit} required/>
                    </div>
                    { this.state.showEdit ? null : (this.state.emptyId ? <div >
                      <p className="text-danger">Field Required! The student Id cannot be empty</p></div> : (this.state.showError ? 
                    <div show={this.state.showError}>
                      <p className="text-danger">Error! The student Id that you enetered exists in this system please use a different one or edit the student Id tab</p>
                    </div> : (this.state.notExistError ? <div className="form-group"><p class="text-danger">this user Id doesn't exists in database please first create user in user access tab with this Student Id</p></div>
                      : <div className="form-group"><p class="text-danger">* Student Id should be number</p></div>) ))}
                    
                    <div className="form-group">
                        <input type="text"  className="form-control" placeholder="Last Name" value={this.state.lastname} onChange={(e)=>{this.lastNamechange(e)}} />
                    </div>
                    <div className="form-group">
                        <input type="text"  className="form-control" placeholder="First Name" value={this.state.firstname}  onChange={(e)=>{this.firstNamechange(e)}}/>
                    </div>
                    <div className="form-group">
                        <input type="number"   min="1" className="form-control" placeholder="Group No" value={this.state.groupno} onChange={(e)=>{this.groupNochange(e)}} />
                    </div>
                    {this.state.emptyGroupNo ? <div className="form-group"><p class="text-danger">Field Required! Group Number should not be empty</p></div> : this.state.showError || this.state.notExistError ? null : <div className="form-group"><p class="text-danger">* Group Number should be number</p></div>}
                    <div className="form-group">
                        <input type="text"  className="form-control" placeholder="Title" value={this.state.title}  onChange={(e)=>{this.titlechange(e)}}/>
                    </div>
                    <div className="form-group">
                        <input type="text"  className="form-control" placeholder="Supervisor" value={this.state.supervisor}  onChange={(e)=>{this.supervisorchange(e)}}/>
                    </div>
                    <div className="form-group">
                        <input type="text"  className="form-control" placeholder="Co Supervisor" value={this.state.cosupervisor}  onChange={(e)=>{this.coSupervisorchange(e)}}/>
                    </div>
                    {this.state.showEdit ?
                    (<div class="input-group mb-3" show={this.state.showEdit}>
                                  <div class="input-group-prepend">
                                  <label class="input-group-text" for="inputGroupSelect02">Assessment Status</label>
                                  </div>
                                  <select class="custom-select" id="inputGroupSelect02" value={this.state.assessmentstatus} onChange={(e)=>{this.assessmentStatuschange(e)}}>
                                    {/* <option selected  >Choose...</option> */}
                                    <option selected value='0' >0</option>
                                    <option value='1' >1</option>
                                  </select>
                    </div>) : (this.state.showError || this.state.notExistError ? null : <Result />) }

              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit" onClick={(e)=>{this.validateStudentId(e, this.state.id)}}>
                  Submit
                </Button>
              </Modal.Footer>
        </Modal>
        <Modal show={this.state.deleteClicked} onHide={this.handleClose}>
              <Modal.Header closeButton>
                          <Modal.Title>Delete Project</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                    <p>Are you sure you want to delete this student with Student Id <b>{this.state.studentId}</b> and First Name <b>{this.state.firstname}</b> Project?
                          </p>
                        </Modal.Body>

                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleClose}>No</Button>
                          <Button variant="btn btn-danger" onClick={(e)=>this.delete(this.state.tempDelUser)}>Yes</Button>
                </Modal.Footer>
          </Modal>
        <div className="table-responsive  mt-5">
          <table className="table">
            <thead>
              <th>Student Id</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Group No</th>
              <th>Title</th>
              <th>Supervisor</th>
              <th>Co Supervisor</th>
              <th>Assessment Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </thead>
            <tbody>

              {this.state.people.map(person=>
                
                
              <tr>
                <td>{person.studentId}</td>
                <td>{person.lastname}</td>
                <td>{person.firstname}</td>
                <td>{person.groupno}</td>
                <td>{person.title}</td>
                <td>{person.supervisor}</td>
                <td>{person.cosupervisor}</td>
              <td>{person.assessmentstatus}</td>
                <td>
                  <Button onClick={(e)=>this.getone(person._ID)} className="btn btn-sm btn-primary" >
                    <i className="fa fa-pencil"></i>
                  </Button>

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
  )}
}

export default Project;