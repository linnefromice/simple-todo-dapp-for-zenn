import { expect } from "chai";
import { ethers } from "hardhat";

describe("TodoList", () => {
  it("Should has three tasks in task list provided by constructor", async () => {
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.deployed();

    expect(await todoList.taskCount()).to.equal(1);
  });

  describe("function createTask", async () => {
    it("emit event named `Created`", async () => {
      const TodoList = await ethers.getContractFactory("TodoList");
      const todoList = await TodoList.deploy();
      await todoList.deployed();

      await expect(todoList.createTask("Test Task"))
      .to.emit(todoList, "Created")
      .withArgs(2, "Test Task");
    });
    it("create task", async () => {
      const TodoList = await ethers.getContractFactory("TodoList");
      const todoList = await TodoList.deploy();
      await todoList.deployed();

      await todoList.createTask("first task");
      expect((await todoList.tasks(2)).content).to.equal("first task");
      await todoList.createTask("second task");
      expect((await todoList.tasks(3)).content).to.equal("second task");
    });
  });

  describe("function toggleIsCompleted", async () => {
    it("emit event named `UpdatedIsCompleted`", async () => {
      const TodoList = await ethers.getContractFactory("TodoList");
      const todoList = await TodoList.deploy();
      await todoList.deployed();
        await expect(todoList.toggleIsCompleted(1))
        .to.emit(todoList, "UpdatedIsCompleted")
        .withArgs(1, true);
    });
    it("toggle one task's complete status", async () => {
      const TodoList = await ethers.getContractFactory("TodoList");
      const todoList = await TodoList.deploy();
      await todoList.deployed();

      await todoList.toggleIsCompleted(1);
      expect((await todoList.tasks(1)).isCompleted).to.equal(true);

      await todoList.toggleIsCompleted(1);
      expect((await todoList.tasks(1)).isCompleted).to.equal(false);
    });
  });
});