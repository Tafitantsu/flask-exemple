pipeline {
    agent any

    environment {
        IMAGE_NAME = 'manou05/my-flask-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
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
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Test') {
            steps {
                sh 'docker run --rm ${IMAGE_NAME} python -c "print('Test OK')" || echo "No tests yet"'
            }
        }
        stage('deploy') {
            steps {
                script {
                  sh "docker run -d --name my-flask-app -p 5000:5000 ${IMAGE_NAME}"
                }
            }
        }
        stage('clean') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }
}
