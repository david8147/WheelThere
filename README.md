### README:

#### Usage steps:
* npm install (installs dependencies from package.json)
* brew install yarn
* yarn add firebase
* npm start (should start server)

#### Installing new packages
* npm install `package-name` --save (will add to package.json)


#### Branching:
* git checkout -b `branchname`
* git branch (to check what branch you're in)
* `do all your coding in your branch`
* git pull origin master (pull changes people have potentially made, solves merge conflicts)
* git merge master (merges master into your branch)
* git checkout master (change to master branch)
* git merge `branchname` (merge in the branch you were working on)
* git push origin master (push to github)


#### Style:
* We are using [reactstrap](https://reactstrap.github.io/components/alerts/) which uses bootstrap
* in order to use:
```
import { Alert } from 'reactstrap';
const Example = (props) => {
  return (
        <Alert color="success">
          This is a success alert — check it out!
        </Alert>
    );
  };

```
