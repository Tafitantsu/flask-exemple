pipeline {
    agent any

    environment {
        IMAGE_NAME = 'manou05/my-flask-app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}")
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }

        stage('Deploy to Docker Compose') {
            steps {
                echo 'deploy running'
                script {
                sh 'docker run -d --name my-flask-app -p 5000:5000 ${IMAGE_NAME}'
                }
            }
        }
        stage('Cleanup') {
            steps {
                echo 'clean up'
            }
        }
    }
}
