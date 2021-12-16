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
  const { taskCount, tasks, createTask } = contract.functions;
  const [taskCountValue, setTaskCountValue] = useState<string>("");
  const [tasksValue, setTasksValue] = useState<Task[]>([]);

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

  return {
    taskCount: taskCountValue,
    tasks: tasksValue,
g  }
}
const Content: VFC<{contract: ethers.Contract}> = ({contract}) => {
  const { taskCount, tasks } = useContent(contract);

  return (
    <div>
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
