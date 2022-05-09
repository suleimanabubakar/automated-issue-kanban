const github = require("@actions/github");
const core = require("@actions/core");


async function run (){
    // const token  = core.getInput('GITHUB_TOKEN')
    // console.log('token is ', token)
    const token = 'xysxs'
  
    const project = core.getInput('PROJECT')
    const octokit = github.getOctokit(token);
    const context = github.context;
    const label = core.getInput('LABEL')
    const type = core.getInput('TYPE')
    const username = core.getInput('USERNAME')


    // check if context is an issue
    if (context.payload.issue){
        issue = context.payload.issue
        console.log(issue.url)

        if (issue.labels.find(labelObj=>labelObj.name == label)) {

            const projectObj = await getProject(octokit,project,username)

            console.log(projectObj)

            // if (projectObj){

            //     console.log(projectObj)
                
            //     const columns = await getColumns(octokit,projectObj.id,type)
            //     const currentColumn =columns[0]
            //     const newColumn = columns[1]

            //     const card = await getCard(octokit,currentColumn.id,issue.url)
            //     console.log('card is')
            //     console.log(card)

            //     if (card){
            //         const movingCard = await moveCard(octokit,newColumn.id,card.id)
                    
            //         console.log("Issue Successfully Moved")
            //     }else{
            //         console.log("Card Issue Not Found !")
            //     }
            
            // }else{
            //     console.log("Project  Not Found !")
            // }


        }else{         
            
            console.log(`${label} Not A Listener`)
        }
    


    }else{
        console.log('Not An Issue')
    }


}




async function getProject(octokit,projectName,username){
    try{
        const projects = await octokit.rest.projects.listForUser({
            username:username,
          });
          
          return projects.data.find(projectObj=>projectObj.name==projectName)
    
    }catch(error){
        console.log('Error Found')
        return error
    }
    

}

async function getColumns(octokit,projectId,type){
    if (type == "to_progress"){
        const columnList = await octokit.rest.projects.listColumns({
               project_id: projectId,
              }); 
        const to_do_colum = columnList.data.find(columnObj=>columnObj.name=="To do")
        const progress_column = columnList.data.find(columnObj=>columnObj.name=="In progress")
        return [to_do_colum,progress_column]
    }else{
        return "type not configured"
    }
}


async function getCard(octokit,columId,issue_url){
    const cards  = await octokit.rest.projects.listCards({
            column_id : columId,
          }); 
    console.log('card are')
    console.log(cards)
    return cards.data.find(cardObj=>cardObj.content_url == issue_url)
}

async function moveCard(octokit,columnId,card){
    const moveC = await octokit.rest.projects.moveCard({
        card_id:card,
        position:"top",
        column_id:columnId
      });
    return "Card Successfully Moved"
}

run()