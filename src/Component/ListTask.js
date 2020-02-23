import React from 'react';
import '../asset/css/bootstrap.min.css';
import '../asset/css/App.css';
export default function ListTask(props){
    let {SearchData,data, socket, changeData,changeDisplayLoading,changeFormValue, changeFormDisplay,changeFormType} = props;
    function checkLevel(level){
        if(level == 1){
            return {level:"Small", style:"badge badge-secondary"}
        }else if(level == 2){
            return {level:"Medium", style:"badge badge-info"}
        }else{
            return {level: "Hight",style:"badge badge-danger"}
        }
    }

    function deleteTask(taskID){
        changeDisplayLoading('block')
        socket.emit('delete-task', taskID)
        socket.on('deleted-task',function(deletedTaskID){
            changeDisplayLoading('none')
            socket.removeListener('deleted-task')
            var index = data.findIndex(task => task._id === deletedTaskID) 
            data.splice(index,1)
            changeData([...data])
        })
    }
    function putTaskToEdit(value){
        changeFormDisplay('flex')
        changeFormType('Update')
        changeFormValue(value)
    }
    return(
    <div className="panel panel-success">
        <div className="panel-heading">List Task</div>
        <table className="table table-hover ">
            <tr>
              <th style={{width: "10%"}} className="text-center">#</th>
              <th>Task</th>
              <th style={{width: "20%"}} className="text-center">Level</th>
              <th style={{width: 160}}>Action</th>
            </tr>
            {
                SearchData.map((task,index)=>{
                    return(
                    <tr key={task._id}>
						<td className="text-center">{index}</td>
						<td>{task.name}</td>
						<td className="text-center"><span className={checkLevel(task.level).style}> {checkLevel(task.level).level} </span></td>
						<td>
							<button type="button" onClick={()=>putTaskToEdit({name:task.name, level:task.level,taskID:task._id})} className="btn btn-warning">Edit</button>
							<button type="button" onClick={()=>deleteTask(task._id)} className="btn btn-danger">Delete</button>
						</td>
					</tr>
                    )
                })
            }
        </table>
    </div>
    )
}