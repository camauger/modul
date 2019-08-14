#!/usr/bin/env groovy

// Création de la release d'un repo modul
// ce script est utilisé dans un pipeline Jenkins
// le code source original est conservé ici https://github.com/ulaval/modul-components/tree/develop/doc/jenkins-release-pipeline.groovy
// toujours utiliser la version qui se trouve sur Github

pipeline {
    agent none

    parameters {
        choice(name: 'repourl', description: "Url du repo Github.", choices: 'github.com/ulaval/modul-components.git\ngithub.com/ulaval/modul-website.git')
        booleanParam(name: 'creerrelease', description: "Création de la branche release.", defaultValue: true)
        choice(name: 'version', description: 'Incrément de la version dans le fichier package.json (utiliser prerelease tant qu\'on est en beta).', choices: 'prerelease\npatch\nminor\nmajor')
        booleanParam(name: 'merge', description: "Merger la branche release dans master.", defaultValue: true)
        string(name: 'mergefrom', description: "Nom de la branche à merger dans master et ramener dans develop (ex: release/v1.0.0-beta.40). Laisser à blanc si l'option 'creerrelease' est sélectionnée.", defaultValue: '')
        booleanParam(name: 'tag', description: "Tagger master.", defaultValue: true)
        booleanParam(name: 'npmpublish', description: "Publier la version sur npm.", defaultValue: true)
        string(name: 'npmtag', description: "Tag spécifique à associer au package sur npm (ex: beta). Laisser à blanc si le package doit être taggé 'latest'.", defaultValue: '')
        booleanParam(name: 'pullrequest', description: "Création d'un PR pour ramener la release dans la branche develop.", defaultValue: true)
        booleanParam(name: 'dryrun', description: "Pas de commit, pas de npm publish. Unique des logs dans la console pour simuler ce qui va se passer.", defaultValue: true)
    }

    options {
        // Discarter après 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))

        // Ajouter les timestamps dans le log
        timestamps()
    }

    // Les valeurs contenues de cette section ne doit pas se retrouver sur Github
    environment {
        // Pour éviter une erreur: EACCES: permission denied, mkdir '/.npm'
        npm_config_cache = 'npm-cache'
        DOCKER_REPOSITORY = 'docker-local.maven.at.ulaval.ca/modul'
        DOCKER_REPOSITORY_URL = 'https://docker-local.maven.at.ulaval.ca'
        REPO_URL = "${params.repourl}"
        GIT_CREDS = '9ec5088f-92ad-4447-a2b2-b25b57d1eb62'
        BRANCHE_RELEASE = "${params.mergefrom}"
        JENKINS_USER = 'Jenkins'
        JENKINS_EMAIL = 'jenkins@dti.ulaval.com'
        NPM_CONFIG = 'modul-npmrc-config'
        POST_RECIPIENTS = 'martin.simard@dti.ulaval.ca,vincent.dallaire@dti.ulaval.ca,jean-francois.nadeau.9@ulaval.ca,jean-philippe.goydadin@dti.ulaval.ca,charles.maheu@dti.ulaval.ca'
        // POST_RECIPIENTS = 'charles.maheu@dti.ulaval.ca'
        CODEOWNERS_DEV = 'jomat76,gabra20,pytremblay,jsroy19,cabob,jpguilmette,Mboulianne,lucmartin3elien,mturcotteDTI,jacob1992,tharle'
        CODEOWNERS_DEV_EXT = '*.ts'
        CODEOWNERS_STYLES = 'Atiomi,sioue19,raphpare,setur52'
        CODEOWNERS_STYLES_EXT = '*.css,*.scss'
        CODEOWNERS_TEMPLATES_EXT = '*.html'
        CODEOWNERS_LEADS = 'jfnadeau,simardo,vidal7'
        CODEOWNERS_LEADS_EXT = '*'
    }

    stages {
        stage('Création de la branche release') {
            when {
                expression { params.creerrelease == true }
            }

            agent {
                docker {
                    image 'node:9.4.0'
                }
            }

            steps {
                script {
                    try {
                        git branch: 'develop',
                            credentialsId: GIT_CREDS,
                            url: "https://${REPO_URL}"

                        sh("git config user.name '${JENKINS_USER}'")
                        sh("git config user.email '${JENKINS_EMAIL}'")
                        sh("git config push.default simple")

                        def newVersion = sh (
                            script: "npm version ${params.version} --no-git-tag-version",
                            returnStdout: true
                        ).trim()
                        BRANCHE_RELEASE = "release/${newVersion}"

                        if (params.dryrun) {
                            echo "Créer branche ${BRANCHE_RELEASE}"
                        } else {
                            withCredentials([usernamePassword(credentialsId: GIT_CREDS, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                                sh "git checkout -b ${BRANCHE_RELEASE}"
                                sh 'git add -A'
                                sh "git commit -m'Release ${newVersion}'"
                                sh('git push https://${GIT_USERNAME}:${GIT_PASSWORD}@${REPO_URL}')
                            }
                        }
                    } finally {
                        cleanWs()
                    }
                }
            }
        }

        stage('Merge release dans master') {
            when {
                expression { params.merge == true }
            }

            agent {
                docker {
                    image 'node:9.4.0'
                }
            }

            steps {
                script {
                    try {
                        git branch: 'master',
                            credentialsId: GIT_CREDS,
                            url: "https://${REPO_URL}"

                        sh("git config user.name '${JENKINS_USER}'")
                        sh("git config user.email '${JENKINS_EMAIL}'")
                        sh("git config push.default simple")

                        if (params.dryrun) {
                            echo "Merge origin/${BRANCHE_RELEASE} dans master"
                        } else {
                            withCredentials([usernamePassword(credentialsId: GIT_CREDS, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                                sh "git merge --no-ff origin/${BRANCHE_RELEASE}"
                                sh('git push https://${GIT_USERNAME}:${GIT_PASSWORD}@${REPO_URL}')
                            }
                        }
                    } finally {
                        cleanWs()
                    }
                }
            }
        }

        stage('Build & Tag') {
            when {
                expression { params.tag == true }
            }

            agent {
                docker {
                    image 'node:9.4.0'
                }
            }

            steps {
                script {
                    try {
                        git branch: 'master',
                            credentialsId: GIT_CREDS,
                            url: "https://${REPO_URL}"

                        sh("git config user.name '${JENKINS_USER}'")
                        sh("git config user.email '${JENKINS_EMAIL}'")
                        sh("git config push.default simple")

                        withNPM(npmrcConfig: NPM_CONFIG) {
                            echo "Cleaning up..."

                            sh "rm -rf node_modules"
                            sh "npm install"

                            echo "Test packaging..."
                            sh "npm pack"
                        }

                        def testVersion = sh (
                            script: 'npm run print_version_nx --silent',
                            returnStdout: true
                        ).trim()

                        if (params.dryrun) {
                            echo "tag v${testVersion} -> version actuelle dans master et non mergée"
                        } else {
                            withCredentials([usernamePassword(credentialsId: GIT_CREDS, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                                sh("git tag -a v${testVersion} -m 'Release ${testVersion}'")
                                sh("git push https://${GIT_USERNAME}:${GIT_PASSWORD}@${REPO_URL} v${testVersion}")
                            }
                        }
                    } finally {
                        cleanWs()
                    }
                }
            }
        }

        stage('npm publish') {
            when {
                expression { params.npmpublish == true }
            }

            agent {
                docker {
                    image 'node:9.4.0'
                }
            }

            steps {
                script {
                    try {
                        git branch: BRANCHE_RELEASE,
                            credentialsId: GIT_CREDS,
                            url: "https://${REPO_URL}"

                        if (params.dryrun) {
                            echo "publish avec le tag '${params.npmtag}' (si '' -> LATEST)"
                        } else {
                            withNPM(npmrcConfig: NPM_CONFIG) {
                                echo "Cleaning up..."

                                sh("rm -rf node_modules")
                                sh("npm install")
                                if (params.npmtag != '') {
                                    sh("npm publish --access public --tag ${params.npmtag}")
                                } else {
                                    sh("npm publish --access public")
                                }
                            }
                        }
                    } finally {
                        cleanWs()
                    }
                }
            }
        }

        stage('PR pour merge dans develop') {
            when {
                expression { params.pullrequest == true }
            }

            agent {
                docker {
                    image 'node:9.4.0'
                }
            }

            steps {
                script {
                    try {
                        def reponame = REPO_URL.substring(REPO_URL.lastIndexOf('/') + 1, REPO_URL.lastIndexOf('.'))
                        if (params.dryrun) {
                            echo "Création d'un PR pour ${BRANCHE_RELEASE} vers develop pour ulaval/${reponame}"
                        } else {
                            withCredentials([
                                [$class: 'UsernamePasswordMultiBinding', credentialsId: GIT_CREDS, usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD']
                            ]) {
                                sh "curl -d '{\"title\": \"${BRANCHE_RELEASE}\",\"body\": \"Merge back branch `${BRANCHE_RELEASE}` into develop. MERGE COMMIT ONLY - *DO NOT SQUASH/REBASE MERGE*.\",\"head\": \"${BRANCHE_RELEASE}\",\"base\": \"develop\"}' -X POST https://api.github.com/repos/ulaval/${reponame}/pulls?access_token=${GIT_PASSWORD}"
                            }
                        }
                    } finally {
                        cleanWs()
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (!params.dryrun) {
                    def message = []

                    message.push("<h3>repourl : ${params.repourl}</h3>")
                    message.push("creerrelease : ${params.creerrelease}")
                    message.push("version : ${params.version}")
                    message.push("merge : ${params.merge}")
                    message.push("mergefrom : ${params.mergefrom}")
                    message.push("tag : ${params.tag}")
                    message.push("npmpublish : ${params.npmpublish}")
                    message.push("npmtag : ${params.npmtag}")
                    message.push("pullrequest : ${params.pullrequest}")
                    message.push('<pre>')
                    message.push('$DEFAULT_CONTENT')
                    message.push('</pre>')

                    def subject = "Release ${params.repourl} - Build #${currentBuild.number} - ${currentBuild.currentResult}!"

                    emailext subject: subject,
                            body: message.join('<br/>'),
                            replyTo: '$DEFAULT_REPLYTO',
                            to: "${POST_RECIPIENTS}"
                    recipientProviders:
                    [[$class: 'DevelopersRecipientProvider']]
                }
            }
        }
    }
}
