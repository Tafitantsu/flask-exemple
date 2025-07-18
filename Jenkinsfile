pipeline {
    agent { 
        node {
            label 'AgentIND'
            }
      }
    triggers {
        pollSCM 'H/1 * * * *'
    }
    stages {
        stage('Build') {
            steps {
                echo "Building.."
                sh '''
                apt install -y python3
                '''
            }
        }
        stage('Test') {
            steps {
                echo "Testing.."
                sh '''
                echo "test was launched"
                '''
            }
        }
    }
}
