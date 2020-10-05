# Self-Assessment Portal edit and delete

## To set up virtual environment in LINUX: -

### To install virtal environment, follow the command below:-

```
python3 -m install --user virtualenv
pip3 install virtualenv
```

### Make the environment using the command below

```
python3 -m venv env
```

### To run the program follow the commands below:-

```
pip install -r requirements.txt
source env/bin/activate
export FLASK_APP=app.py
export FLASK_DEBUG=True
```

### Run the flask app

```
flask run
```

or

```
python3 -m flask run
```

## To set up virtual environment in WINDOWS: -

One of the requirements is to have python installed in the system or pc, to check use this command: -
```
py -m pip --version
```

### To install virtal environment, follow the command below:-

```
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
pip install virtualenv
```

### Make the environment using the command below, and make sure the current working directory is the project folder

```
virtualenv env
py -m pip install requirements.txt
```

### To run the program follow the commands below:-

```
\env\Scripts\activate.bat
export FLASK_APP=app.py
export FLASK_DEBUG=True
```

### Run the flask app

```
flask run
```

### Now, go into the public folder type the following commands:-

```
npm install
npm i axios --save
npm install react-bootstrap bootstrap
npm start
```

for more instructions, refer to README.md in public folder
