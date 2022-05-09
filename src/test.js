const github = require("@actions/github");
const core = require("@actions/core");

import  {token} from '../credientials'


const octokit = github.getOctokit(token);


async function getProjects (octokit,username,projectName){
    const projects = await octokit.rest.projects.listForUser({
        username:username,
      });

    return projects.data.find(projectObj=>projectObj.name=projectName)
    
}


const results  = await getProjects(octokit,'suleimanabubakar','SMS')


console.log(results)