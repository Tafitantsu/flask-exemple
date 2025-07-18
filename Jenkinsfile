pipeline {
  agent {
    node {
      label 'Python' // ou ton label d’agent personnalisé
  }

  environment {
    FLASK_APP = 'app.py'
    FLASK_RUN_PORT = '5000'
  }

  stages {
    stage('Install Dependencies') {
      steps {
        sh 'python3 -m pip install --upgrade pip'
        sh 'pip3 install -r requirements.txt' // ou `pip3 install -r requirements.txt`
      }
    }

    stage('Run Flask App') {
      steps {
        sh 'python3 app.py &'
        sh 'sleep 3'
        sh 'curl -s http://localhost:5000 || true'  // test simple
      }
    }
  }
}
