import React, { useEffect, useState, VFC } from "react";
import { ethers } from "ethers";
import artifact from "./abi/TodoList.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export const App: VFC = () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
  const { taskCount } = contract.functions;

  const [taskCountValue, setTaskCountValue] = useState<string>("");
  useEffect(() => {
    const getTaskCount = async () => {
      const _taskCount = await taskCount();
      setTaskCountValue(_taskCount);
    }
    getTaskCount()
  }, [])

  return (
    <div>
      <h1>Hello, TodoList Contract.</h1>
      <p>{`taskCount ... ${taskCountValue}`}</p>
    </div>
  )
}
