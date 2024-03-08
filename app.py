from flask import Flask, request , jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
import json

app = Flask(__name__)
# 'mongodb://localhost:27017/demo2'

app.config["MONGO_URI"]='mongodb+srv://sapportal:Khushal9661@@khushalkumar.172pb.mongodb.net/Sapportal'
mongo = PyMongo(app)
CORS(app)

db = mongo.db.demo2

# FOR HOME
@app.route('/',methods=["GET","POST"])
def getpost():
    if request.method == "GET":
        o = []
        for i in db.find():
            o.append({"_ID":str(ObjectId(i["_id"])), "name":i["name"], "email":i["email"], "password":i["password"]})
        return jsonify(o)
    elif request.method == "POST":
        id = db.insert({"name": request.json["name"], "email": request.json["email"], "password": request.json["password"]})
        return jsonify(str(ObjectId(id)))



@app.route('/<id>',methods=["DELETE","PUT"])
def deleteput(id):
    if request.method == "DELETE":
        db.delete_one({"_id":ObjectId(id)})
        return jsonify({"message":"deleted"})
    elif request.method == "PUT":
        db.update({"_id":ObjectId(id)}, {"$set":{
            "name": request.json["name"],
            "email": request.json["email"],
            "password": request.json['password']
        }})
        return jsonify({"message": "updated"})
        
@app.route('/getone/<id>',methods=["GET"])
def getone(id):
    res = db.find_one({"_id":ObjectId(id)})
    print(res)
    return {"_ID":str(ObjectId(res["_id"])), "name":res["name"],"email":res["email"],"password":res["password"] }


#FOR USER ACCESS PAGE

#CREATING TWO DATABASES I.E. USER DATABASE FOR USERS AND ROLE DATABASE FOR USERS ACCESS ROLE 
user_db = mongo.db.users
role_db = mongo.db.role


@app.route('/useraccess/',methods=["GET","POST"])
def getpost_useraccess():
    if request.method == "GET":
        x = []
        for j in user_db.find():
            # print(j["lastname"] +" " + j["firstname"] + " " + j["accessrole"])
            x.append({"_ID":str(ObjectId(j["_id"])), "userId": j["userId"], "lastname":j["lastname"], "firstname":j["firstname"], "email":j["email"]})
        return jsonify(x)

    elif request.method == "POST":

        if ((user_db.find({"userId": request.json["userId"]}).count() > 0) and (user_db.find({"email": request.json["email"]}).count() > 0)):
            print("this email and user ID already exists please use different email")
            return jsonify(message='bothEmailAndUserIdExists'),500

        elif (user_db.find({"email": request.json["email"]}).count() > 0):
            print("this email already exists please use different email")
            return jsonify(message='email'),500
            
        elif (user_db.find({"userId": request.json["userId"]}).count() > 0):
            print("this user Id already exists please use different User Id")
            return jsonify(message='userId'),500

        elif (request.json["userId"] == "" and request.json["email"] == ""):
            print("this user Id and email is empty")
            return jsonify(message='emptyUserIdAndEmail'),500

        elif (request.json["userId"] == "" ):
            print("this user Id is empty")
            return jsonify(message='emptyUserId'),500

        elif (request.json["email"] == "" ):
            print("this email Id is empty")
            return jsonify(message='emptyUserId'),500

        elif (request.json["firstname"] == ''):
                id = user_db.insert({"userId": request.json["userId"], "lastname": request.json["lastname"],
                "firstname": 'Student', "email": request.json["email"]})
                return jsonify(str(ObjectId(id)))
        
        else:
            id = user_db.insert({"userId": request.json["userId"], "lastname": request.json["lastname"], "firstname": request.json["firstname"], "email":request.json["email"]})
            return jsonify(str(ObjectId(id)))

@app.route('/useraccess/<id>',methods=["DELETE","PUT"])
def deleteput_useraccess(id):
    if request.method == "DELETE":
        user_db.delete_one({"userId":id})
        role_db.delete_one({"userId": id})
        if(project_db.find({"studentId": id}).count() > 0 ):
            project_db.delete_one({"studentId":id})
        return jsonify({"message":"deleted"})

    elif request.method == "PUT":
        # tempUser = user_db.find({"_id":ObjectId(id)})
        
        # if(tempUser["email"] == request.json["email"]):
        #     user_db.update({"_id":ObjectId(id)}, {"$set":{
        #         "userId": request.json["userId"],
        #         "lastname": request.json["lastname"],
        #         "firstname": request.json["firstname"],
        #         "email": request.json["email"]
        #     }})
        #     return jsonify({"message": "updated"})
        if (request.json["firstname"] == ''):
                user_db.update({"_id":ObjectId(id)}, {"$set":{
                "userId": request.json["userId"],
                "lastname": request.json["lastname"],
                "firstname": 'Student',
                "email": request.json["email"]
            }})

        # if (user_db.find({"email": request.json["email"]}).count() > 0):
        #         print("this email already exists please use different email")
        #         return jsonify(message='email'),500
        else:
            user_db.update({"_id":ObjectId(id)}, {"$set":{
                "userId": request.json["userId"],
                "lastname": request.json["lastname"],
                "firstname": request.json["firstname"],
                "email": request.json["email"]
            }})
        return jsonify({"message": "updated"})

@app.route('/useraccess/edit_user/<id>',methods=["GET"])
def edit_useraccess(id):
    res = user_db.find_one({"_id":ObjectId(id)})
    print(res)
    return {"_ID":str(ObjectId(res["_id"])),"userId":res["userId"], "lastname":res["lastname"], "firstname":res["firstname"], "email":res["email"]}

#FOR USER ROLE PAGE


@app.route('/role/',methods=["GET","POST"])
def getpost_role():
    if request.method == "GET":
        x = []
        for j in role_db.find():
            # print(j["lastname"] +" " + j["firstname"] + " " + j["accessrole"])
            x.append({"_ID":str(ObjectId(j["_id"])), "userId": j["userId"], "accessrole": j["accessrole"]})
        return jsonify(x)

    elif request.method == "POST":
        if(request.json["accessrole"] == "Choose..."):
            id = role_db.insert({"userId": request.json["userId"], "accessrole": 'Student'})
            return jsonify(str(ObjectId(id)))

        else:
            id = role_db.insert({"userId": request.json["userId"], "accessrole": request.json["accessrole"]})
            return jsonify(str(ObjectId(id)))

@app.route('/role/<id>',methods=["PUT"])
def put_role(id):
    # if request.method == "DELETE":
    #     role_db.delete_one({"_id":ObjectId(id)})
    #     return jsonify({"message":"deleted"})

    if request.method == "PUT":
        role_db.update({"_id":ObjectId(id)}, {"$set":{
            "userId": request.json["userId"],
            "accessrole": request.json["accessrole"]
        }})
        return jsonify({"message": "updated"})

@app.route('/role/edit_user/<id>',methods=["GET"])
def edit_role(id):
    res = role_db.find_one({"_id":ObjectId(id)})
    print(res)
    return {"_ID":str(ObjectId(res["_id"])),"userId":res["userId"]}


# FOR COMMENT

feedback_db = mongo.db.feedback

@app.route('/comments/',methods=["GET","POST"])
def getpost_comments():
    if request.method == "GET":
        o = []
        for k in feedback_db.find():
            o.append({"_ID":str(ObjectId(k["_id"])), "studentId":k["studentId"],"name":k["name"],"comment":k["comment"]})
        return jsonify(o)
    elif request.method == "POST":
        id = feedback_db.insert({"studentId":request.json["studentId"],"name":request.json["name"],"comment":request.json["comment"]})
        return jsonify(str(ObjectId(id)))



@app.route('/comments/<id>',methods=["DELETE","PUT"])
def deleteput_comments(id):
    if request.method == "DELETE":
        feedback_db.delete_one({"_id":ObjectId(id)})
        return jsonify({"message":"deleted"})
    elif request.method == "PUT":
        feedback_db.update({"_id":ObjectId(id)}, {"$set":{
            "studentId":request.json["studentId"], "name":request.json["name"], "comment":request.json["comment"]}})
        return jsonify({"message": "updated"})
        
@app.route('/comments/getone/<id>',methods=["GET"])
def getone_comments(id):
    res = feedback_db.find_one({"_id":ObjectId(id)})
    print(res)
    return {"_ID":str(ObjectId(res["_id"])), "studentId":res["studentId"], "name":res["name"],"comment":res["comment"]}

# FOR FACULTY

faculty_db = mongo.db.faculty

@app.route('/faculty/',methods=["GET","POST"])
def getpost_faculty():
    if request.method == "GET":
        o = []
        for k in faculty_db.find():
            o.append({"_ID":str(ObjectId(k["_id"])), "lastname":k["lastname"],"firstname":k["firstname"],"email":k["email"]})
        return jsonify(o)
    elif request.method == "POST":
        if (faculty_db.find({"email": request.json["email"]}).count() > 0):
            print("this email already exists please use different email")
            return jsonify(message='email'),500
        else:
            id = faculty_db.insert({"lastname":request.json["lastname"],"firstname":request.json["firstname"],"email":request.json["email"]})
            return jsonify(str(ObjectId(id)))



@app.route('/faculty/<id>',methods=["DELETE","PUT"])
def deleteput_faculty(id):
    if request.method == "DELETE":
        faculty_db.delete_one({"_id":ObjectId(id)})
        return jsonify({"message":"deleted"})
    elif request.method == "PUT":
        faculty_db.update({"_id":ObjectId(id)}, {"$set":{
            "lastname":request.json["lastname"], "nfirstame":request.json["firstname"], "email":request.json["email"]}})
        return jsonify({"message": "updated"})
        
@app.route('/faculty/getone/<id>',methods=["GET"])
def getone_faculty(id):
    res = faculty_db.find_one({"_id":ObjectId(id)})
    print(res)
    return {"_ID":str(ObjectId(res["_id"])), "lastname":res["lastname"], "firstname":res["firstname"],"email":res["email"]}


# FOR PROJECT 

project_db = mongo.db.project

@app.route('/project/',methods=["GET","POST"])
def getpost_project():
    if request.method == "GET":
        o = []
        for i in project_db.find():
            o.append({"_ID":str(ObjectId(i["_id"])), "studentId":i["studentId"], "lastname":i["lastname"], "firstname":i["firstname"], "groupno": i["groupno"], "title":i["title"], "supervisor":i["supervisor"], "cosupervisor":i["cosupervisor"], "assessmentstatus": i["assessmentstatus"]})
        return jsonify(o)
    elif request.method == "POST":
        if (project_db.find({"studentId": request.json["studentId"]}).count() > 0 ): # checking if student id exists 
            print("this user already exists please use different User Id")
            return jsonify(message='studentId'),500

        # elif request.json["studentId"] == "":
        #     print("the Student Id is empty")
        #     return jsonify(message='emptyStudentId'),500

        else:
            if (request.json["firstname"] == '' and user_db.find({"userId": request.json["studentId"]}).count() > 0):
                id = project_db.insert({"studentId":request.json["studentId"], "lastname":request.json["lastname"], "firstname": 'Student', "groupno": request.json["groupno"], "title":request.json["title"], "supervisor":request.json["supervisor"], "cosupervisor":request.json["cosupervisor"], "assessmentstatus": request.json["assessmentstatus"]})
                return jsonify(str(ObjectId(id)))

            elif(user_db.find({"userId": request.json["studentId"]}).count() > 0):
                id = project_db.insert({"studentId":request.json["studentId"], "lastname":request.json["lastname"], "firstname":request.json["firstname"], "groupno": request.json["groupno"], "title":request.json["title"], "supervisor":request.json["supervisor"], "cosupervisor":request.json["cosupervisor"], "assessmentstatus": request.json["assessmentstatus"]})
                return jsonify(str(ObjectId(id)))

            
            else:
                print("this user Id doesn't exists in database please first create user in user access tab with this Student Id")
                return jsonify(message='notExist'),500



@app.route('/project/<id>',methods=["DELETE","PUT"])
def deleteput_project(id):
    if request.method == "DELETE":
        project_db.delete_one({"_id":ObjectId(id)})
        return jsonify({"message":"deleted"})
    elif request.method == "PUT":
        # if(project_db.find({"studentId": request.json["studentId"]}).count() > 0 ):
        #     return ValueError('This Student Id already exists')
        if (request.json["firstname"] == ''):
            project_db.update({"_id":ObjectId(id)}, {"$set":{
                    "studentId":request.json["studentId"], "lastname":request.json["lastname"], "firstname":'Student', "groupno": request.json["groupno"], "title":request.json["title"], "supervisor":request.json["supervisor"], "cosupervisor":request.json["cosupervisor"], "assessmentstatus": request.json["assessmentstatus"]}})
            return jsonify({"message": "updated"})

        else:
            project_db.update({"_id":ObjectId(id)}, {"$set":{
                    "studentId":request.json["studentId"], "lastname":request.json["lastname"], "firstname":request.json["firstname"], "groupno": request.json["groupno"], "title":request.json["title"], "supervisor":request.json["supervisor"], "cosupervisor":request.json["cosupervisor"], "assessmentstatus": request.json["assessmentstatus"]}})
            return jsonify({"message": "updated"})
            
        
@app.route('/project/getone/<id>',methods=["GET"])
def getone_project(id):
    res = project_db.find_one({"_id":ObjectId(id)})
    print(res)
    return {"_ID":str(ObjectId(res["_id"])), "studentId":res["studentId"], "lastname":res["lastname"], "firstname":res["firstname"], "groupno": res["groupno"], "title":res["title"], "supervisor":res["supervisor"], "cosupervisor":res["cosupervisor"], "assessmentstatus": res["assessmentstatus"] }
    # if(project_db.find({"studentId": res["studentId"]}).count() > 0 ):
    #     return ValueError('This Student Id already exists')
    # else:
    
# FOR USER PAGE
@app.route('/user/',methods=["GET"])
def get_user():
        x = []
        for j in user_db.find():
            x.append({"_ID":str(ObjectId(j["_id"])), "userId": j["userId"], "lastname":j["lastname"], "firstname":j["firstname"], "email":j["email"]})
        return jsonify(x)

@app.route('/user/<id>',methods=["DELETE","PUT"])
def deleteput_user(id):
    if request.method == "DELETE":
        user_db.delete_one({"userId": id})
        role_db.delete_one({"userId": id})
        if(project_db.find({"studentId": id}).count() > 0 ):
            project_db.delete_one({"studentId":id})
        return jsonify({"message":"deleted"})

    elif request.method == "PUT":
        if (request.json["firstname"] == ''):
                user_db.update({"_id":ObjectId(id)}, {"$set":{
                "userId": request.json["userId"],
                "lastname": request.json["lastname"],
                "firstname": 'Student',
                "email": request.json["email"]
            }})

        else:
            user_db.update({"_id":ObjectId(id)}, {"$set":{
                "userId": request.json["userId"],
                "lastname": request.json["lastname"],
                "firstname": request.json["firstname"],
                "email": request.json["email"]
            }})
        return jsonify({"message": "updated"})

@app.route('/user/edit_user/<id>',methods=["GET"])
def edit_user(id):
    res = user_db.find_one({"_id":ObjectId(id)})
    print(res)
    return {"_ID":str(ObjectId(res["_id"])),"userId":res["userId"], "lastname":res["lastname"], "firstname":res["firstname"], "email":res["email"]}
