import React from 'react';
import '../asset/css/bootstrap.min.css';
import '../asset/css/App.css';

export default function AddTask(props){
    let {socket,Sort,changeSort,SearchData,changeSearchData, Data, changeData,SearchValue,changeSearchValue,changeDisplayLoading,FormDisplay,changeFormDisplay,FormType,changeFormType,changeFormValue,FormValue} = props;
    
    const levelOption =[
        {level:1, name:'Small'},
        {level:2, name:'Medium'},
        {level:3, name:'High'},
    ]
    React.useEffect(()=>{
        search()
    },[SearchValue])
    React.useEffect(()=>{
        sortData(Sort)
    },[Sort])
    function search(){
        if(SearchValue !=''){
            var searchData=[]
            Data.forEach((o,i)=>{
                if(o.name.indexOf(SearchValue) != -1){
                    searchData.push(o)
                }
            })
            changeSearchData([...searchData])
        }else{
            changeSearchData([...Data])
        }
    }
    function formButtonClick(){
        changeDisplayLoading('block')
        if(FormType =="Submit"){
            socket.emit('add-task',FormValue)
            socket.on('add-task-success',task=>{
                socket.removeListener('add-task-success')
                changeDisplayLoading('none')
                Data.push(task)
                changeData([...Data])
            })
        }else{
            socket.emit('edit-task',FormValue);
            socket.on('edit-success',function(){
                changeDisplayLoading('none')
                var index = Data.findIndex(task => task._id === FormValue.taskID) 
                Data[index].name = FormValue.name
                Data[index].level = FormValue.level
                changeData([...Data])
            })
        }
    }
    function addTaskBtn(){
        changeFormDisplay('flex')
        changeFormType('Submit')
        changeFormValue({name:'', level:1})
    }
    function checkSelected(option){
        if(option.level == FormValue.level){
            return <option selected value={option.level}> {option.name} </option>
        }
        return <option  value={option.level}> {option.name} </option>
    }
    function sortData(type){
        if(type == 'Name ASC'){
            SearchData.sort((a,b)=>{
                var nameA = a.name
                var nameB = b.name
                if(nameA > nameB){
                    return 1
                }else if(nameA < nameB){
                    return -1
                }
                return 0
            })
            changeSort(type)
            changeSearchData([...SearchData])
        }else if(type == 'Name DESC'){
            SearchData.sort((a,b)=>{
                var nameA = a.name
                var nameB = b.name
                if(nameA > nameB){
                    return -1
                }else if(nameA < nameB){
                    return 1
                }
                return 0
            })
            changeSort(type)
            changeSearchData([...SearchData])
        }else if(type == 'Level ASC'){
            SearchData.sort((a,b)=>{
                var levelA = a.level
                var levelB = b.level
                if(levelA > levelB){
                    return 1
                }else if(levelA < levelB){
                    return -1
                }
                return 0
            })
            changeSort(type)
            changeSearchData([...SearchData])
        }else if( type == 'Level DESC'){
            SearchData.sort((a,b)=>{
                var levelA = a.level
                var levelB = b.level
                if(levelA > levelB){
                    return -1
                }else if(levelA < levelB){
                    return 1
                }
                return 0
            })
            changeSort(type)
            changeSearchData([...SearchData])
        }else{
            changeSort(type)
            changeSearchData([...Data])
            search()
        }
    }
    return(
        <div className="row">
            <div className="col-12 col-lg-6">
                <div className="row">
                    <div className="col-12">
                    <div className="form-group">
                        <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Sort by
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" onClick={()=>changeSort('None')}> Không </a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" onClick={()=>changeSort('Name ASC')}>Name ASC</a>
                            <a className="dropdown-item" onClick={()=>changeSort('Name DESC')}>Name DESC</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" onClick={()=>changeSort('Level ASC')}>Level ASC</a>
                            <a className="dropdown-item" onClick={()=>changeSort('Level DESC')}>Level DESC</a>
                        </div>
                        <span className="badge badge-success badge-medium"> {Sort} </span>
                        </div>
                    </div>
                    </div>
                    <div className="col-12">
                    <div className="input-group">
                        <input type="text" className="form-control" value={SearchValue} onChange={e=>changeSearchValue(e.target.value)} placeholder="Search for..." />
                        <span className="input-group-append">
                        <button onClick={()=>changeSearchValue('')} className="btn btn-info" type="button">Clear!</button>
                        </span>
                    </div>
                    </div>
                </div>
                </div>
                <div className="col-12 col-lg-6">
                <div className="form-group add-task">
                    <button onClick={addTaskBtn} type="button" className="btn btn-info btn-block">Add Task</button>
                </div>
                <form style={{display:FormDisplay}} action="" method="POST" className="form-inline justify-content-between">
                    <div className="form-group">
                    <label className="sr-only" for="">label</label>
                    <input onChange={(e)=>changeFormValue({name:e.target.value,level:FormValue.level,taskID:FormValue.taskID})} value={FormValue.name} type="text" className="form-control" placeholder="Task Name" />
                    </div>
                    <div className="form-group">
                    <label className="sr-only" for="">label</label>
                    <select onChange={e=>changeFormValue({name:FormValue.name,level:e.target.value,taskID:FormValue.taskID})} name="ds" className="form-control" required="required">
                        {
                            levelOption.map(option=>{
                                return(
                                    checkSelected(option)
                                )
                            })
                        }
                    </select>
                    </div>

                    <button type="button" onClick={formButtonClick} className="btn btn-primary"> {FormType} </button>
                    <button type="button" onClick={()=>changeFormDisplay('none')} className="btn btn-secondary">Cancel</button>
                </form>
            </div>
        </div>
    )
}