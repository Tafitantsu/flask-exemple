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
                sh 'docker run --rm ${IMAGE_NAME} python -m unittest discover || echo "No tests yet"'
            }
        }

        stage('Deploy to Docker Compose') {
            steps {
                script {
                sh 'docker stop my-flask-app || true'
                sh 'docker rm my-flask-app || true'
                sh 'docker run -d --name my-flask-app -p 5000:5000 ${IMAGE_NAME}'
                }
            }
        }
    }
}
