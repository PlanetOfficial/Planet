import loginTest from "./tests/authTests/loginTest";
import tabTest from "./tests/miscTests/tabTest"
import createTest1 from "./tests/createTests/createTest1";
import createTest2 from "./tests/createTests/createTest2";
import logoutTest from "./tests/authTests/logoutTest";

loginTest();
tabTest();

createTest1();

createTest2();

logoutTest();

/*  TODO: test switching accounts and ensure correct functionality
        according to new account.
    TODO: test signup process
*/