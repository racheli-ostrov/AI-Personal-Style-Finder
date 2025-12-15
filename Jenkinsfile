pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME_BACKEND = "yourdockeruser/style-finder-backend"
        IMAGE_NAME_FRONTEND = "yourdockeruser/style-finder-frontend"
    }
    stages {
        stage('Build Backend Docker Image') {
            steps {
                dir('backend-python') {
                    script {
                        docker.build(env.IMAGE_NAME_BACKEND)
                    }
                }
            }
        }
        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        docker.build(env.IMAGE_NAME_FRONTEND)
                    }
                }
            }
        }
        stage('Push Images to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        docker.withRegistry('https://index.docker.io/v1/', env.DOCKERHUB_CREDENTIALS) {
                            docker.image(env.IMAGE_NAME_BACKEND).push()
                            docker.image(env.IMAGE_NAME_FRONTEND).push()
                        }
                    }
                }
            }
        }
        stage('Deploy (optional)') {
            steps {
                echo 'Add deployment steps here if needed.'
            }
        }
    }
}