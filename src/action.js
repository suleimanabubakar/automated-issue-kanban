const github = require("@actions/github");
const core = require("@actions/core");

async function run (){
    const token  = core.getInput('GITHUB_TOKEN')
    console.log(token)
    const project = core.getInput('PROJECT')
    const octokit = github.getOctokit(token);
    const context = github.context;
    const label = core.getInput('LABEL')
    const type = core.getInput('TYPE')
    const username = core.getInput('USERNAME')

    // console.log(octokit)
    // console.log(context)

    // check if context is an issue
    if (context.payload.issue){
        issue = context.payload.issue

        if (issue.labels.find(labelObj=>labelObj.name == label)) {

            const projectObj = await getProject(octokit,project,username)

            if (projects){
                const columns = await getColumns(octokit,projectObj.id,type)
                const currentColumn =columns[0]
                const newColumn = columns[1]
                const card = await getCard(octokit,currentColumn.id,issue.url)
                if (card){
                    const movingCard = await moveCard(octokit,newColumn,card.id)
                    return "Issue Successfully Moved"
                }else{
                    return "Card Issue Not Found !"
                }
            
            }else{
                return "Project  Not Found !"
            }


        }else{
            return `${label} Not A Listener`
        }
    


    }else{
        return "Not And Issue"
    }


}




async function getProject(octokit,projectName,username){
    try{
        const projects = await octokit.rest.projects.listForUser({
            username,
          });
          
          return projects.data.filter(projectObj=>projectObj.name=projectName)
    
    }catch(error){
        console.log('Error Found')
        console.log(error)
        return error
    }
    

}

async function getColumns(octokit,projectId,type){
    if (type == "to_progress"){
        const columnList = await octokit.rest.projects.listColumns({
               project_id: projectId,
              }); 
        to_do_colum = columnList.data.find(columnObj=>columnObj.name=="To do")
        progress_column = columnList.data.find(columnObj=>columnObj.name=="In progress")
        return [to_do_colum,progress_column]
    }else{
        return "type not configured"
    }
}


async function getCard(octokit,columId,issue_url){
    const cards  = octokit.rest.projects.listCards({
            column_id : columId,
          }); 
    return cards.data.find(cardObj=>cardObj.content_url == issue_url)
}

async function moveCard(octokit,columnId,card){
    const moveC = octokit.rest.projects.moveCard({
        card_id:card,
        position:"top",
        column_id:columnId
      });
    return "Card Successfully Moved"
}

run()