pipeline {
  agent any

  environment {
    FLASK_APP = 'app.py'
    FLASK_RUN_PORT = '5000'
  }

  stages {
    stage('Clone Repository') {
      steps {
        git 'https://github.com/Tafitantsu/flask-exemple.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'pip3 install -r requirements.txt'
      }
    }

    stage('Run Flask App') {
      steps {
        sh 'python3 app.py &'
        sh 'sleep 3'
        sh 'curl -s http://localhost:5000 || true'
      }
    }
  }
}
