const github = require("@actions/github");
const core = require("@actions/core");

async function run (){
    const token  = core.getInput('GITHUB_TOKEN')
    const project = core.getInput('PROJECT')
    const octokit = github.getOctokit(token);
    const context = github.context;
    const label = core.getInput('LABEL')
    const username = core.getInput('USERNAME')



    // check if context is an issue
    if (context.payload.issue){
        issue = context.payload.issue

        if (issue.labels.find(labelObj=>labelObj.name == label)) {

            const projectObj = await getProject(project)

            if (projects){
                const columns = await getColumns(projectObj.id)
                const currentColumn =columns[0]
                const newColumn = columns[1]
                const card = await getCard(currentColumn.id,issue.url)
                if (card){
                    const movingCard = await moveCard(newColumn,card.id)
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


async function getProject(projectName,username){
    const projects = await octokit.rest.projects.listForUser({
        username,
      });

    return projects.data.filter(projectObj=>projectObj.name=projectName)

}

async function getColumns(projectId,type){
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


async function getCard(columId,issue_url){
    const cards  = octokit.rest.projects.listCards({
            column_id : columId,
          }); 
    return cards.data.find(cardObj=>cardObj.content_url == issue_url)
}

async function moveCard(columnId,card){
    const moveC = octokit.rest.projects.moveCard({
        card_id:card,
        position:"top",
        column_id:columnId
      });
    return "Card Successfully Moved"
}

run()