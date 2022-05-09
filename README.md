# Move_To_Inprogress

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
      - uses: ./
        with:
          access-token: "${{ secrets.GHSECRET }}"
          TYPE: "to_progress"
          PROJECT: "My Project"
          LABEL: "active"
          USERNAME: "your username"
