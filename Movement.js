import { map } from "./wall.js"
let result = null

export const AStar = (position, goal) => {
    const getDirectDistance = (position, goal) => {
        const result = Math.sqrt(Math.pow(position.x - goal.x, 2) + Math.pow(position.y - goal.y,2)) 
        return result
    }
    
    const currentPosition = position
    const hospitalMap = map()
    const goalPosition = goal
    const tree = [{value: getDirectDistance(currentPosition, goalPosition),position: currentPosition ,tree: null, treeClass: 0, key: true, path: [currentPosition]}]
    let minOfTree = {value: 999999999, position: null};
    let moveMent =[currentPosition]
    const trackedPath = [currentPosition]
    
    const pushTree =  (currentPosition, currentTree, newMovement, treeClass = 1) => {
        currentTree.forEach((branch, index)=>{
            if(branch.key === true){
                if(newMovement.length !== 0){
                    for(let i=0; i<newMovement.length ; i++){
                        newMovement[i].treeClass = treeClass
                        newMovement[i].path = [...branch.path, {x: newMovement[i].position.x, y: newMovement[i].position.y }]
                    }
                    branch.tree = newMovement
                    return 'Found It'
                }else{
                    branch.tree = 'Blocked'
                }
            }else {
                if(index === currentTree.length - 1){
                    const newTreeClass = treeClass + 1
                    currentTree.forEach((branch) => {
                        if(branch.tree && branch.tree !== 'Blocked'){
                            pushTree(currentPosition, branch.tree, newMovement, newTreeClass) 
                        }
                    })
                }
            }
        })
    }
    
    
    const setMinOfTree =  (currentTree) => {
        currentTree.forEach((branch,index)=>{
            if(branch.value < minOfTree.value && !branch.tree){
                minOfTree.value = branch.value
                minOfTree.position = branch.position
                branch.key = true
                resetTree(tree,index, branch.treeClass, branch.position)
            }
            if(index === currentTree.length - 1){
                currentTree.forEach((branch) => {
                    if(branch.tree && branch.tree !== 'Blocked'){
                        setMinOfTree(branch.tree)
                    }
                })
            }
        })
    }
    
    const resetTree = (currentTree,ignoreIndex, treeClass, position) => {
        currentTree.forEach((branch,index)=>{
            if(ignoreIndex !== index || treeClass !== branch.treeClass || branch.position.x !== position.x || branch.position.y !== position.y ){
                branch.key = false
            }
            if(index === currentTree.length - 1){
                currentTree.forEach((branch) => {
                    if(branch.tree && branch.tree !== 'Blocked'){
                        resetTree(branch.tree,ignoreIndex, treeClass, position)
                    }
                })
            }
        })
    }
    
    const setMovement = (currentTree) => {
        currentTree.forEach((branch,index)=>{
            if(branch.key){
                const result = [...branch.path]
                moveMent = result
                return
            }
            if(index === currentTree.length - 1){
                currentTree.forEach((branch) => {
                    if(branch.tree && branch.tree !== 'Blocked'){
                        setMovement(branch.tree)
                    }
                })
            }
        })
    } 
    
    const getNextPosition =  (nextPosition) => {
        const currentPosition = moveMent[moveMent.length - 1]
        const newMovement = []
        
        nextPosition.forEach((position)=>{
            if(hospitalMap[position.y - 1][position.x - 1] !== 'wall'){
                let checked = true
                for(let i=0; i<trackedPath.length; i++){
                    if(trackedPath[i].x === position.x && trackedPath[i].y === position.y){
                        checked = false
                        break
                    }
                }
                if(checked){
                    trackedPath.push(position)
                    newMovement.push({value: getDirectDistance(position, goalPosition) + moveMent.length,position: position, tree:null})
                }  
            }
        })
        pushTree(currentPosition, tree, newMovement)
        
        //Action
        minOfTree = {value: 999999999, position: null};
        setMinOfTree(tree)
        setMovement(tree)

        return minOfTree.position
    }
    
    const handleMovement =  (currentPosition) => {
        const top = { x: currentPosition.x - 1, y: currentPosition.y}
        const left = { x: currentPosition.x , y: currentPosition.y - 1}
        const right = { x: currentPosition.x, y: currentPosition.y + 1}
        const bottom = { x: currentPosition.x + 1, y: currentPosition.y}
        const nextPosition = [top,  left, right , bottom ]

        if(currentPosition.x === goalPosition.x && currentPosition.y === goalPosition.y){
            finalPath(tree)
            return
        }
    
        //????? quy
        const newPosition = getNextPosition(nextPosition)
        if(newPosition.x === goalPosition.x && newPosition.y === goalPosition.y){
            finalPath(tree)
            return
        }else{
            handleMovement(newPosition)
        }
    }
    
    
    const finalPath = (currentTree) => {
        currentTree.forEach((branch,index)=>{
            if(branch.key){
                result = branch.path
            }
            if(index === currentTree.length - 1){
                currentTree.forEach((branch) => {
                    if(branch.tree && branch.tree !== 'Blocked'){
                        finalPath(branch.tree)
                    }
                })
            }
        })
    }

    //Handle 
    handleMovement(currentPosition)
}


export const getResult = () => {
    return result
}
