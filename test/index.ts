import { expect } from "chai";
import { ethers } from "hardhat";

describe("TodoList", () => {
  it("Should has three tasks in task list provided by constructor", async () => {
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.deployed();

    expect(await todoList.taskCount()).to.equal(1);
  });
});