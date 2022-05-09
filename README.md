# Moving Project Cards

Moves Issue Project  Card To Columns --- For User Level Project


## Usage

```yml

on:
  issues:
    types: [labeled]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: suleimanabubakar/automated-issue-kanban@v1.0.0
        with:
          access-token: "${{ secrets.GHSECRET }}"
          TYPE: "to_progress"
          PROJECT: "My Project"
          LABEL: "active"
          USERNAME: "your username" 
```


## Required Inputs

- `access-token`: Access token for repository. Since its a user level projects, create a secret within your repository assigned to your project
- `type`: Currently supported type is ` to_progress ` responsible for moving issue cards from ` To do ` to ` In progress ` columns within your kanban
- `label`: The label that would trigger the issue to transfer to `In progress` column
