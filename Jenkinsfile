#!groovy

node {
    def commit_id;
    def git_branch;
    def git_tag;

    try{
       // fetching git repo
       stage('Preparation') {
         git_branch = env.gitlabSourceBranch.toString();
         if (git_branch=='null' ){
           git_branch = 'develop';
         }

         git url: 'xxxxx.git',
            credentialsId: 'gitlab-ssh-key', branch: git_branch

        commit_id = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim().toString()
        git_tag = sh(returnStdout: true, script: "git tag --sort version:refname | tail -1").trim()

       }
       // running test cases
       stage('test') {
         def myTestContainer = docker.image('python:3.5')
            myTestContainer.pull()
            myTestContainer.inside {
            //sh 'pip install -r requirements/local.txt'
            //sh 'python manage.py test --settings=config.settings.test'
            echo 'branch--->> '+git_branch;
            echo 'commit--->> '+commit_id;
            echo 'tag------>> '+git_tag;

            }
          def content = "Test cases done"
          emailext(body: content, mimeType: 'text/html',
            replyTo: '$DEFAULT_REPLYTO', subject: 'Test Report Zevac',
            to: '$DEFAULT_RECIPIENTS', attachLog: true )
       }
       stage('docker build/push') {
         if (git_branch == 'develop'){
             docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
               def app = docker.build("xxxxx/yyyyyy:canary-"+git_tag.substring(1), '.').push()
             }
             build job: 'xxx-newman-testSuit', propagate: false, wait: false;
           }
         if (git_branch == 'master'){
             docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
               def app = docker.build("xxxxx/yyyyyy:production-"+git_tag.substring(1), '.').push()
             }
           }
       }
   }
   catch(e){
        // mark build as failed
        currentBuild.result = "FAILURE";
        // set variables
        def subject = "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} ${currentBuild.result}"
        def content = '${JELLY_SCRIPT,template="html"}'

        // send email
      emailext(body: content, mimeType: 'text/html',
         replyTo: '$DEFAULT_REPLYTO', subject: subject,
         to: '$DEFAULT_RECIPIENTS', attachLog: true )

        // mark current build as a failure and throw the error
        throw e;

   }
}
