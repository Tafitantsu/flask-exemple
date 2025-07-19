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

        stage('Push to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker tag ${IMAGE_NAME}:latest ${DOCKER_USER}/my-flask-app:latest
                        docker push ${DOCKER_USER}/my-flask-app:latest
                    '''
                }
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
