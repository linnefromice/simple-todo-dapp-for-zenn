import React, { useEffect, useState, VFC } from "react";
import { ethers } from "ethers";
import artifact from "./abi/TodoList.json";

type Task = {
  id: string,
  content: string,
  isCompleted: boolean
}
const useContent = (
  contract: ethers.Contract
) => {
  const { taskCount, tasks, createTask, toggleIsCompleted } = contract.functions;
  const [taskCountValue, setTaskCountValue] = useState<string>("");
  const [tasksValue, setTasksValue] = useState<Task[]>([]);
  const [taskContent, setTaskContent] = useState<string>("");

  useEffect(() => {
    const getTasks = async () => {
      const _taskCount = await taskCount();
      setTaskCountValue(_taskCount);

      const _tasks = []
      for (let i = 1; i <= _taskCount; i++) {
        const _task = await tasks(i);
        _tasks.push({
          ..._task,
          id: i
        })
      }
      setTasksValue(_tasks);
    }
    getTasks();
  }, [])

  const updateTaskContent = (e: React.ChangeEvent<HTMLInputElement>) => setTaskContent(e.target.value);
  const requestCreateTask = async () => {
    if (taskContent === "") return;
    await createTask(taskContent);
  };

  const requestToggleIsCompleted = async (id: string) => {
    for (const _task of tasksValue) {
      if (id === _task.id) {
        await toggleIsCompleted(id);
        return;
      }
    }
  }

  return {
    taskCount: taskCountValue,
    tasks: tasksValue,
    updateTaskContent,
    requestCreateTask,
    requestToggleIsCompleted
  }
}
const Content: VFC<{contract: ethers.Contract}> = ({contract}) => {
  const { taskCount, tasks, updateTaskContent, requestCreateTask, requestToggleIsCompleted } = useContent(contract);

  const handleCreateTask = async () => {
    await requestCreateTask();
    window.location.reload();
  }

  const handleToggleIsCompleted = async (id: string) => {
    await requestToggleIsCompleted(id);
    window.location.reload();
  }

  return (
    <div>
      <p>
        <input onChange={updateTaskContent} />
        <button onClick={handleCreateTask}>Create Task</button>
      </p>
      <p>{`taskCount ... ${taskCount}`}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Content</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t, index) => <tr key={`task.${index}`}>
            <td>{t.id}</td>
            <td>{t.content}</td>
            <td>{t.isCompleted ? "Completed" : "Not Completed"}</td>
            <td><button onClick={() => handleToggleIsCompleted(t.id)}>Change</button></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export const App: VFC = () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
  const contractWithSigner = contract.connect(signer);

  return (
    <div>
      <h1>Hello, TodoList Contract.</h1>
      <Content contract={contractWithSigner} />
    </div>
  )
}
